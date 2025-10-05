#!/usr/bin/env python3
"""
Script to add purchases to consolidated user purchase history (one row per user)
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

def add_purchase_to_user_history(user_id, store_location, total_amount, items, points_earned=None, hunt_id=None, receipt_image_url=None, purchase_date=None):
    """Add a purchase to user's consolidated purchase history"""
    
    config = {
        'account': os.getenv('SNOWFLAKE_ACCOUNT'),
        'user': os.getenv('SNOWFLAKE_USER'),
        'password': os.getenv('SNOWFLAKE_PASSWORD'),
        'warehouse': os.getenv('SNOWFLAKE_WAREHOUSE'),
        'database': os.getenv('SNOWFLAKE_DATABASE'),
        'schema': os.getenv('SNOWFLAKE_SCHEMA')
    }
    
    try:
        print("🔄 Connecting to Snowflake...")
        conn = snowflake.connector.connect(**config)
        cursor = conn.cursor(DictCursor)
        print("✅ Connected successfully!")
        
        # Get user info
        cursor.execute("SELECT user_id, first_name, last_name, email FROM users WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()
        
        if not user:
            print(f"❌ User {user_id} not found!")
            return False
        
        print(f"✅ User found: {user['FIRST_NAME']} {user['LAST_NAME']}")
        
        # Calculate points if not provided
        if points_earned is None:
            points_earned = int(float(total_amount))
        
        if purchase_date is None:
            purchase_date = datetime.now()
        
        # Create purchase object
        purchase = {
            'purchase_id': str(uuid.uuid4()),
            'store_location': store_location,
            'total_amount': float(total_amount),
            'items': items,
            'points_earned': int(points_earned),
            'hunt_id': hunt_id,
            'receipt_image_url': receipt_image_url,
            'purchase_date': purchase_date.isoformat(),
            'status': 'COMPLETED'
        }
        
        print(f"\n📋 New Purchase:")
        print(f"  ID: {purchase['purchase_id']}")
        print(f"  Store: {purchase['store_location']}")
        print(f"  Amount: ${purchase['total_amount']}")
        print(f"  Points: {purchase['points_earned']}")
        print(f"  Date: {purchase['purchase_date']}")
        print(f"  Items: {len(items)} item(s)")
        
        # Check if user already has a purchase history record
        cursor.execute("SELECT * FROM user_purchase_history WHERE user_id = %s", (user_id,))
        existing_record = cursor.fetchone()
        
        if existing_record:
            print(f"\n📊 Found existing purchase history for {user['FIRST_NAME']}")
            print(f"  Current purchases: {existing_record['TOTAL_PURCHASES']}")
            print(f"  Current total spent: ${existing_record['TOTAL_SPENT']}")
            print(f"  Current points earned: {existing_record['TOTAL_POINTS_EARNED']}")
            
            # Get existing purchases array and add new purchase
            existing_purchases = existing_record['PURCHASES']
            if isinstance(existing_purchases, str):
                existing_purchases = json.loads(existing_purchases)
            elif existing_purchases is None:
                existing_purchases = []
            
            # Add new purchase to the array
            existing_purchases.append(purchase)
            
            # Update the record
            new_total_purchases = existing_record['TOTAL_PURCHASES'] + 1
            new_total_spent = existing_record['TOTAL_SPENT'] + purchase['total_amount']
            new_total_points = existing_record['TOTAL_POINTS_EARNED'] + purchase['points_earned']
            
            print(f"\n💾 Updating existing record...")
            cursor.execute("""
                UPDATE user_purchase_history 
                SET 
                    purchases = PARSE_JSON(%s),
                    total_purchases = %s,
                    total_spent = %s,
                    total_points_earned = %s,
                    last_updated = %s
                WHERE user_id = %s
            """, (
                json.dumps(existing_purchases),
                new_total_purchases,
                new_total_spent,
                new_total_points,
                datetime.now(),
                user_id
            ))
            
        else:
            print(f"\n💾 Creating new purchase history record for {user['FIRST_NAME']}")
            
            # Create new record with first purchase
            cursor.execute("""
                INSERT INTO user_purchase_history 
                (user_id, first_name, last_name, email, total_purchases, total_spent, total_points_earned, purchases, last_updated)
                SELECT %s, %s, %s, %s, %s, %s, %s, PARSE_JSON(%s), %s
            """, (
                user_id,
                user['FIRST_NAME'],
                user['LAST_NAME'],
                user['EMAIL'],
                1,  # first purchase
                purchase['total_amount'],
                purchase['points_earned'],
                json.dumps([purchase]),  # array with one purchase
                datetime.now()
            ))
        
        # Update user points in users table
        cursor.execute("""
            UPDATE users 
            SET points = points + %s, updated_at = %s 
            WHERE user_id = %s
        """, (purchase['points_earned'], datetime.now(), user_id))
        
        conn.commit()
        print("✅ Purchase added and user points updated!")
        
        # Show updated record
        cursor.execute("SELECT * FROM user_purchase_history WHERE user_id = %s", (user_id,))
        updated_record = cursor.fetchone()
        
        print(f"\n🎉 Updated Purchase History for {user['FIRST_NAME']} {user['LAST_NAME']}:")
        print(f"  Total purchases: {updated_record['TOTAL_PURCHASES']}")
        print(f"  Total spent: ${updated_record['TOTAL_SPENT']}")
        print(f"  Total points earned: {updated_record['TOTAL_POINTS_EARNED']}")
        print(f"  Last updated: {updated_record['LAST_UPDATED']}")
        
        # Show individual purchases
        purchases_array = updated_record['PURCHASES']
        if isinstance(purchases_array, str):
            purchases_array = json.loads(purchases_array)
        
        print(f"\n📝 All Purchases ({len(purchases_array)}):")
        for i, p in enumerate(purchases_array, 1):
            print(f"  {i}. {p['store_location']} - ${p['total_amount']} ({p['purchase_date'][:10]})")
            print(f"     Points: {p['points_earned']}, Hunt: {p.get('hunt_id', 'None')}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    # Example usage
    print("💡 This script consolidates purchases into one row per user")
    print("📝 Call add_purchase_to_user_history() with purchase data")
    print("\n🔍 Example: add_purchase_to_user_history(user_id, store, amount, items, points, hunt_id)")
    print("\n👆 Each purchase gets added to the user's purchases array!")
