from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from datetime import datetime, timezone
import snowflake.connector
from snowflake.connector import DictCursor
import os
from contextlib import contextmanager
import uuid
from dotenv import load_dotenv
import json


# Load environment variables
load_dotenv()

app = FastAPI(title="Grocery Store User Profile API", version="1.0.0")

# If you’re mounting sub-apps/routers, put this on the sub-app too.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # or ["http://localhost:3000"] for tighter security
    allow_credentials=True,
    allow_methods=["*"],          # includes OPTIONS automatically
    allow_headers=["*"],          # e.g. Content-Type
)

# Pydantic models for request/response
class UserProfile(BaseModel):
    user_id: str
    email: str
    first_name: str
    last_name: str
    points: int = 0
    created_at: datetime
    updated_at: datetime
    

class UserProfileCreate(BaseModel):
    email: str
    first_name: str
    last_name: str

class UserProfileUpdate(BaseModel):
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class PointsUpdate(BaseModel):
    points_change: int
    description: Optional[str] = None

class Purchase(BaseModel):
    purchase_id: str
    user_id: str
    store_location: str
    total_amount: float
    items: List[dict]  # List of purchased items
    purchase_date: datetime
    
# class PurchaseCreate(BaseModel):
#     store_location: str
#     total_amount: float
#     items: List[dict]

class LineItem(BaseModel):
    id: str               # allow numeric ids from cart
    name: str
    quantity: int = Field(ge=1)
    price: float          # allow ints or floats

class PurchaseCreate(BaseModel):
    store_location: str
    total_amount: float
    items: List[LineItem]

# Snowflake connection configuration
SNOWFLAKE_CONFIG = {
    'account': os.getenv('SNOWFLAKE_ACCOUNT'),
    'user': os.getenv('SNOWFLAKE_USER'),
    'password': os.getenv('SNOWFLAKE_PASSWORD'),
    'warehouse': os.getenv('SNOWFLAKE_WAREHOUSE'),
    'database': os.getenv('SNOWFLAKE_DATABASE'),
    'schema': os.getenv('SNOWFLAKE_SCHEMA')
}

@contextmanager
def get_snowflake_connection():
    """Context manager for Snowflake database connections"""
    conn = None
    try:
        conn = snowflake.connector.connect(**SNOWFLAKE_CONFIG)
        yield conn
    except Exception as e:
        if conn:
            conn.rollback()
        raise e
    finally:
        if conn:
            conn.close()

# Database initialization
def init_database():
    """Initialize database tables if they don't exist"""
    with get_snowflake_connection() as conn:
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id VARCHAR(50) PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                points INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
            )
        """)
        
        # Create purchases table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS purchases (
                purchase_id VARCHAR(50) PRIMARY KEY,
                user_id VARCHAR(50) NOT NULL,
                store_location VARCHAR(255) NOT NULL,
                total_amount DECIMAL(10,2) NOT NULL,
                items VARIANT NOT NULL,
                purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        """)
        
        conn.commit()

# API Routes

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_database()

@app.get("/")
async def root():
    return {"message": "Grocery Store User Profile API"}

# User Profile Management
@app.post("/users", response_model=UserProfile)
async def create_user(user_data: UserProfileCreate):
    """Create a new user profile"""
    user_id = str(uuid.uuid4())
    current_time = datetime.now()
    
    with get_snowflake_connection() as conn:
        cursor = conn.cursor(DictCursor)
        
        try:
            cursor.execute("""
                INSERT INTO users (user_id, email, first_name, last_name, points, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (user_id, user_data.email, user_data.first_name, user_data.last_name, 0, current_time, current_time))
            
            conn.commit()
            
            return UserProfile(
                user_id=user_id,
                email=user_data.email,
                first_name=user_data.first_name,
                last_name=user_data.last_name,
                points=0,
                created_at=current_time,
                updated_at=current_time
            )
        except snowflake.connector.errors.IntegrityError:
            raise HTTPException(status_code=400, detail="User with this email already exists")

@app.get("/users/{user_id}", response_model=UserProfile)
async def get_user(user_id: str):
    """Get user profile by ID"""
    with get_snowflake_connection() as conn:
        cursor = conn.cursor(DictCursor)
        
        cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserProfile(**user)

@app.put("/users/{user_id}", response_model=UserProfile)
async def update_user(user_id: str, user_data: UserProfileUpdate):
    """Update user profile"""
    with get_snowflake_connection() as conn:
        cursor = conn.cursor(DictCursor)
        
        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="User not found")
        
        # Build update query dynamically
        update_fields = []
        update_values = []
        
        if user_data.email is not None:
            update_fields.append("email = %s")
            update_values.append(user_data.email)
        if user_data.first_name is not None:
            update_fields.append("first_name = %s")
            update_values.append(user_data.first_name)
        if user_data.last_name is not None:
            update_fields.append("last_name = %s")
            update_values.append(user_data.last_name)
        
        if update_fields:
            update_fields.append("updated_at = %s")
            update_values.append(datetime.now())
            update_values.append(user_id)
            
            cursor.execute(f"""
                UPDATE users 
                SET {', '.join(update_fields)}
                WHERE user_id = %s
            """, update_values)
            
            conn.commit()
        
        # Return updated user
        cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()
        return UserProfile(**user)

@app.delete("/users/{user_id}")
async def delete_user(user_id: str):
    """Delete user profile"""
    with get_snowflake_connection() as conn:
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT user_id FROM users WHERE user_id = %s", (user_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="User not found")
        
        # Delete user (this will cascade to related records if foreign keys are set up properly)
        cursor.execute("DELETE FROM users WHERE user_id = %s", (user_id,))
        conn.commit()
        
        return {"message": "User deleted successfully"}

# Points Management
@app.post("/users/{user_id}/points")
async def update_user_points(user_id: str, points_data: PointsUpdate):
    """Add or subtract points for a user"""
    with get_snowflake_connection() as conn:
        cursor = conn.cursor(DictCursor)
        
        # Check if user exists and get current points
        cursor.execute("SELECT points FROM users WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        current_points = user['POINTS']
        new_points = current_points + points_data.points_change
        
        # Prevent negative points balance
        if new_points < 0:
            raise HTTPException(status_code=400, detail="Insufficient points balance")
        
        # Update user points
        cursor.execute("""
            UPDATE users 
            SET points = %s, updated_at = %s 
            WHERE user_id = %s
        """, (new_points, datetime.now(), user_id))
        
        conn.commit()
        
        return {
            "user_id": user_id,
            "previous_points": current_points,
            "points_change": points_data.points_change,
            "new_points": new_points,
            "description": points_data.description
        }

# Purchase History Management
@app.post("/users/{user_id}/purchases", response_model=Purchase)
def create_purchase(user_id: str, purchase_data: PurchaseCreate):
    purchase_id = str(uuid.uuid4())
    current_time = datetime.now(timezone.utc)

    # --- Normalize items to a JSON string (critical) ---
    def to_plain(x):
        return x.model_dump() if hasattr(x, "model_dump") else (x.dict() if hasattr(x, "dict") else x)
    items_plain = [to_plain(i) for i in purchase_data.items]
    items_json: str = json.dumps(items_plain)  # <-- must be a STRING

    # --- Prepare safe, scalar params ---
    pid = str(purchase_id)
    uid = str(user_id)
    loc = str(purchase_data.store_location)
    total = float(purchase_data.total_amount)
    items_json_str = str(items_json)
    ts = current_time

    # Runtime sanity check: no dicts/lists slip through
    for idx, p in enumerate((pid, uid, loc, total, items_json_str, ts), start=1):
        if isinstance(p, (list, dict)):
            raise HTTPException(
                status_code=500,
                detail=f"Param {idx} is not scalar (type={type(p).__name__})."
            )

    try:
        with get_snowflake_connection() as conn:
            with conn.cursor(DictCursor) as cursor:
                # Confirm user exists
                cursor.execute("SELECT user_id FROM users WHERE user_id = %s", (uid,))
                if not cursor.fetchone():
                    raise HTTPException(status_code=404, detail="User not found")

                # ✅ Use INSERT ... SELECT so PARSE_JSON is allowed
                sql = """
                    INSERT INTO purchases
                      (purchase_id, user_id, store_location, total_amount, items, purchase_date)
                    SELECT %s, %s, %s, %s, PARSE_JSON(%s), %s
                """
                params = (pid, uid, loc, total, items_json_str, ts)
                cursor.execute(sql, params)
                conn.commit()

        return Purchase(
            purchase_id=pid,
            user_id=uid,
            store_location=loc,
            total_amount=total,
            items=items_plain,
            purchase_date=ts,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")

@app.get("/users/{user_id}/purchases", response_model=List[Purchase])
async def get_purchase_history(user_id: str, limit: int = 50):
    """Get purchase history for a user"""
    with get_snowflake_connection() as conn:
        cursor = conn.cursor(DictCursor)
        
        # Check if user exists
        cursor.execute("SELECT user_id FROM users WHERE user_id = %s", (user_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="User not found")
        
        cursor.execute("""
            SELECT * FROM purchases 
            WHERE user_id = %s 
            ORDER BY purchase_date DESC 
            LIMIT %s
        """, (user_id, limit))
        
        purchases = cursor.fetchall()
        return [Purchase(**purchase) for purchase in purchases]

@app.get("/users/{user_id}/purchases/{purchase_id}", response_model=Purchase)
async def get_purchase(user_id: str, purchase_id: str):
    """Get a specific purchase by ID"""
    with get_snowflake_connection() as conn:
        cursor = conn.cursor(DictCursor)
        
        cursor.execute("""
            SELECT * FROM purchases 
            WHERE user_id = %s AND purchase_id = %s
        """, (user_id, purchase_id))
        
        purchase = cursor.fetchone()
        if not purchase:
            raise HTTPException(status_code=404, detail="Purchase not found")
        
        return Purchase(**purchase)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)