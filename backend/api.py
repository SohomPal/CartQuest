from typing import List, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ------------- FastAPI app + CORS -------------
app = FastAPI(title="Coupon Hunt API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # dev-friendly; tighten for prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------- Models (camelCase where you asked) -------------
class CartItem(BaseModel):
    id: str
    name: str
    category: str
    location: str
    points: int
    price: float
    isPromo: Optional[bool] = None

class HuntResult(BaseModel):
    # Keep the camelCase keys you requested
    userId: str = Field(..., description="User ID")
    shoppingCart: List[CartItem] = Field(default_factory=list)

# ------------- Health check -------------
@app.get("/")
def root():
    return {"status": "Coupon Hunt API is running!"}

# ------------- GET /shoppinglist -------------
# Accepts userId as a query parameter (e.g., /shoppinglist?userId=risha123)
@app.get("/shoppinglist")
def get_shopping_list(userId: str):
    """
    TODO (later):
      - query snowflake for last xyz purchases / typical purchases by date
      - generate probability distribution of likely purchases today
      - include additional/sponsored items based on store parameter
      - return list of N items + product info
    For now: return a generic list.
    """
    return {
        "status": "okay",
        "userId": userId,
        "list": [
            { "id": "22", "name": "All-Purpose Flour", "category": "Baking", "location": "Aisle 8, Left",   "points": 100, "price": 3.49 },
            { "id": "23", "name": "Sugar",             "category": "Baking", "location": "Aisle 8, Left",   "points": 100, "isPromo": True, "price": 2.99 },
            { "id": "24", "name": "Butter",            "category": "Dairy",  "location": "Aisle 3, Center", "points": 100, "price": 4.49 },
            { "id": "25", "name": "Vanilla Extract",   "category": "Baking", "location": "Aisle 8, Center", "points": 100, "price": 5.99 },
        ],
    }

# ------------- POST /huntresult -------------
# Expects: { "userId": "...", "shoppingCart": [ {id, name, ...}, ... ] }
# For now: just echo it back.
@app.post("/huntresult")
def submit_hunt_result(payload: HuntResult):
    # Echo back exactly what you sent, plus a status.
    try:
        echoed = payload.model_dump(by_alias=True)  # pydantic v2
    except AttributeError:
        echoed = payload.dict(by_alias=True)        # pydantic v1 fallback

    return {
        "status": "okay",
        "data": echoed
    }
