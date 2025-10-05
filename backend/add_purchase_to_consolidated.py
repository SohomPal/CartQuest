#!/usr/bin/env python3
"""
Script to add a purchase to the consolidated user_purchase_history table
This adds purchases to the user's purchases array (one row per user approach)
"""
import os
from dotenv import load_dotenv
import snowflake.connector
from snowflake.connector import DictCursor
import uuid
import json
from datetime import datetime

# Load environment variables
load_dotenv()

def add_purchase_to_user(user_id=None, purchase_data=None):
    """Add a purchase to a user's purchases array in the consolidated table"""
    
    # Get connection parameters
    config = {
        'account': os.getenv('SNOWFLAKE_ACCOUNT'),
        'user': os.getenv('SNOWFLAKE_USER'),
        'password': os.getenv('SNOWFLAKE_PASSWORD'),
        'warehouse': os.getenv('SNOWFLAKE_WAREHOUSE'),
        'database': os.getenv('SNOWFLAKE_DATABASE'),
        'schema': os.getenv('SNOWFLAKE_SCHEMA')
    }
    
    # Default purchase data if not provided
    if purchase_data is None:
        purchase_data = {
            'purchase_id': str(uuid.uuid4()),
            'store_name': 'Target',
            'amount': 45.99,
            'items': [
                {'name': 'Groceries', 'price': 35.99},
                {'name': 'Household Items', 'price': 10.00}
            ],
            'purchase_date': datetime.now().isoformat(),
            'points_earned': 46  # roughly 1 point per dollar
        }
    
    try:
        print("🔄 Connecting to Snowflake...")
        conn = snowflake.connector.connect(**config)
        cursor = conn.cursor(DictCursor)
        print("✅ Connected successfully!")
        
        # If no user_id provided, find John Doe
        if user_id is None:
            print("🔍 Looking for John Doe user...")
            cursor.execute("SELECT user_id, first_name, last_name, email, points FROM users WHERE first_name = %s AND last_name = %s", ('John', 'Doe'))
            user = cursor.fetchone()
            
            if not user:
                print("❌ John Doe user not found! Please create a user first.")
                return False
                
            user_id = user['USER_ID']
            current_points = user['POINTS']
            first_name = user['FIRST_NAME']
            last_name = user['LAST_NAME']
            email = user['EMAIL']
            print(f"✅ Found user: {first_name} {last_name} (ID: {user_id})")
            print(f"   Current points: {current_points}")
        else:
            # Get user details for the provided user_id
            cursor.execute("SELECT user_id, first_name, last_name, email, points FROM users WHERE user_id = %s", (user_id,))
            user = cursor.fetchone()
            if not user:
                print(f"❌ User with ID {user_id} not found!")
                return False
            current_points = user['POINTS']
            first_name = user['FIRST_NAME']
            last_name = user['LAST_NAME']
            email = user['EMAIL']
        
        # Check if user exists in purchase history table
        cursor.execute("SELECT * FROM user_purchase_history WHERE user_id = %s", (user_id,))
        existing_record = cursor.fetchone()
        
        if existing_record:
            print("📝 User has existing purchase history, adding to existing record...")
            
            # Get current purchases array
            current_purchases = existing_record['PURCHASES']
            if current_purchases is None:
                current_purchases = []
            elif isinstance(current_purchases, str):
                current_purchases = json.loads(current_purchases)
            
            # Add new purchase to array
            current_purchases.append(purchase_data)
            
            # Update totals
            new_total_purchases = existing_record['TOTAL_PURCHASES'] + 1
            new_total_spent = float(existing_record['TOTAL_SPENT']) + purchase_data['amount']
            new_total_points = existing_record['TOTAL_POINTS_EARNED'] + purchase_data['points_earned']
            
            # Update the record
            update_sql = """
            UPDATE user_purchase_history 
            SET purchases = (SELECT PARSE_JSON(%s)),
                total_purchases = %s,
                total_spent = %s,
                total_points_earned = %s,
                last_purchase_date = %s
            WHERE user_id = %s
            """
            
            cursor.execute(update_sql, (
                json.dumps(current_purchases),
                new_total_purchases,
                new_total_spent,
                new_total_points,
                purchase_data['purchase_date'],
                user_id
            ))
            
        else:
            print("🆕 Creating new purchase history record for user...")
            
            # Create new record with first purchase
            purchases_array = [purchase_data]
            
            insert_sql = """
            INSERT INTO user_purchase_history (
                user_id, first_name, last_name, email, purchases, 
                total_purchases, total_spent, total_points_earned,
                first_purchase_date, last_purchase_date
            ) 
            SELECT %s, %s, %s, %s, PARSE_JSON(%s), %s, %s, %s, %s, %s
            """
            
            cursor.execute(insert_sql, (
                user_id,
                first_name,
                last_name,
                email,
                json.dumps(purchases_array),
                1,
                purchase_data['amount'],
                purchase_data['points_earned'],
                purchase_data['purchase_date'],
                purchase_data['purchase_date']
            ))
        
        # Update user's points
        new_points = current_points + purchase_data['points_earned']
        cursor.execute("UPDATE users SET points = %s WHERE user_id = %s", (new_points, user_id))
        
        conn.commit()
        print("✅ Purchase added successfully!")
        
        # Show the updated record
        cursor.execute("SELECT * FROM user_purchase_history WHERE user_id = %s", (user_id,))
        updated_record = cursor.fetchone()
        
        print(f"\n📊 Updated Purchase History:")
        print(f"   Total Purchases: {updated_record['TOTAL_PURCHASES']}")
        print(f"   Total Spent: ${updated_record['TOTAL_SPENT']:.2f}")
        print(f"   Last Purchase: {updated_record['LAST_PURCHASE_DATE']}")
        
        # Show latest purchase details
        purchases = updated_record['PURCHASES']
        if isinstance(purchases, str):
            purchases = json.loads(purchases)
        
        latest_purchase = purchases[-1]
        print(f"\n🛍️ Latest Purchase Added:")
        print(f"   Store: {latest_purchase['store_name']}")
        print(f"   Amount: ${latest_purchase['amount']:.2f}")
        print(f"   Points Earned: {latest_purchase['points_earned']}")
        print(f"   Items: {len(latest_purchase['items'])} items")
        
        # Show updated user points
        cursor.execute("SELECT points FROM users WHERE user_id = %s", (user_id,))
        user_points = cursor.fetchone()['POINTS']
        print(f"\n👤 User's Updated Points: {user_points}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error adding purchase: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return False

if __name__ == "__main__":
    print("🛒 Adding purchase to consolidated purchase history...")
    
    # Add a purchase for John Doe (or first available user)
    success = add_purchase_to_user()
    
    if success:
        print("\n🎉 Purchase successfully added to consolidated table!")
    else:
        print("\n❌ Failed to add purchase")
