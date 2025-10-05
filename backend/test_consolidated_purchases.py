#!/usr/bin/env python3
"""
Test script for consolidated purchase history (one row per user with purchases array)
"""
import os
from dotenv import load_dotenv
import snowflake.connector
from snowflake.connector import DictCursor
import uuid
import json
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

def test_consolidated_purchases():
    """Test adding multiple purchases to one user record"""
    
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
        
        # Get John Doe
        cursor.execute("SELECT user_id, first_name, last_name, email FROM users WHERE first_name = 'John' AND last_name = 'Doe'")
        user = cursor.fetchone()
        
        if not user:
            print("❌ John Doe not found! Run add_test_user.py first.")
            return
        
        user_id = user['USER_ID']
        print(f"🧪 Testing consolidated purchases for: {user['FIRST_NAME']} {user['LAST_NAME']}")
        
        # Test purchases to add
        test_purchases = [
            {
                'store_location': 'SuperMart Downtown',
                'total_amount': 47.83,
                'items': [
                    {'name': 'Organic Bananas', 'price': 2.99, 'quantity': 2},
                    {'name': 'Whole Wheat Bread', 'price': 3.49, 'quantity': 1},
                    {'name': 'Greek Yogurt', 'price': 5.99, 'quantity': 2}
                ],
                'points_earned': 48,
                'hunt_id': 'weekly-grocery-challenge',
                'purchase_date': datetime.now() - timedelta(days=2)
            },
            {
                'store_location': 'Fresh Market Plaza',
                'total_amount': 32.45,
                'items': [
                    {'name': 'Avocados', 'price': 1.99, 'quantity': 4},
                    {'name': 'Quinoa', 'price': 6.99, 'quantity': 1},
                    {'name': 'Spinach', 'price': 2.99, 'quantity': 2}
                ],
                'points_earned': 32,
                'hunt_id': 'healthy-eating-challenge',
                'purchase_date': datetime.now() - timedelta(days=1)
            },
            {
                'store_location': 'Corner Convenience',
                'total_amount': 15.67,
                'items': [
                    {'name': 'Coffee', 'price': 4.99, 'quantity': 1},
                    {'name': 'Muffin', 'price': 2.99, 'quantity': 2},
                    {'name': 'Orange Juice', 'price': 4.70, 'quantity': 1}
                ],
                'points_earned': 16,
                'hunt_id': 'morning-rush-bonus',
                'purchase_date': datetime.now()
            }
        ]
        
        print(f"\n📊 Will add {len(test_purchases)} purchases to one user record:")
        
        # Check if user already has purchase history
        cursor.execute("SELECT * FROM user_purchase_history WHERE user_id = %s", (user_id,))
        existing = cursor.fetchone()
        
        if existing:
            print(f"  Found existing record with {existing['TOTAL_PURCHASES']} purchases")
            print("  Will append new purchases to existing array")
        else:
            print("  No existing record - will create new consolidated record")
        
        # Add each purchase to the consolidated record
        for i, purchase in enumerate(test_purchases, 1):
            print(f"\n🛒 Adding Purchase {i}: {purchase['store_location']}")
            
            # Check current state
            cursor.execute("SELECT total_purchases, total_spent, purchases FROM user_purchase_history WHERE user_id = %s", (user_id,))
            current_state = cursor.fetchone()
            
            if current_state:
                # Update existing record
                existing_purchases = current_state['PURCHASES']
                if isinstance(existing_purchases, str):
                    existing_purchases = json.loads(existing_purchases)
                elif existing_purchases is None:
                    existing_purchases = []
                
                # Create new purchase object
                new_purchase = {
                    'purchase_id': str(uuid.uuid4()),
                    'store_location': purchase['store_location'],
                    'total_amount': purchase['total_amount'],
                    'items': purchase['items'],
                    'points_earned': purchase['points_earned'],
                    'hunt_id': purchase['hunt_id'],
                    'purchase_date': purchase['purchase_date'].isoformat(),
                    'status': 'COMPLETED'
                }
                
                existing_purchases.append(new_purchase)
                
                # Update totals
                new_total_purchases = current_state['TOTAL_PURCHASES'] + 1
                new_total_spent = current_state['TOTAL_SPENT'] + purchase['total_amount']
                
                cursor.execute("""
                    UPDATE user_purchase_history 
                    SET 
                        purchases = PARSE_JSON(%s),
                        total_purchases = %s,
                        total_spent = %s,
                        total_points_earned = total_points_earned + %s,
                        last_updated = %s
                    WHERE user_id = %s
                """, (
                    json.dumps(existing_purchases),
                    new_total_purchases,
                    new_total_spent,
                    purchase['points_earned'],
                    datetime.now(),
                    user_id
                ))
                
            else:
                # Create first record
                new_purchase = {
                    'purchase_id': str(uuid.uuid4()),
                    'store_location': purchase['store_location'],
                    'total_amount': purchase['total_amount'],
                    'items': purchase['items'],
                    'points_earned': purchase['points_earned'],
                    'hunt_id': purchase['hunt_id'],
                    'purchase_date': purchase['purchase_date'].isoformat(),
                    'status': 'COMPLETED'
                }
                
                cursor.execute("""
                    INSERT INTO user_purchase_history 
                    (user_id, first_name, last_name, email, total_purchases, total_spent, total_points_earned, purchases, last_updated)
                    SELECT %s, %s, %s, %s, %s, %s, %s, PARSE_JSON(%s), %s
                """, (
                    user_id,
                    user['FIRST_NAME'],
                    user['LAST_NAME'],
                    user['EMAIL'],
                    1,
                    purchase['total_amount'],
                    purchase['points_earned'],
                    json.dumps([new_purchase]),
                    datetime.now()
                ))
            
            conn.commit()
            print(f"  ✅ Added ${purchase['total_amount']} purchase from {purchase['store_location']}")
        
        # Show final consolidated record
        cursor.execute("SELECT * FROM user_purchase_history WHERE user_id = %s", (user_id,))
        final_record = cursor.fetchone()
        
        print(f"\n🎉 Final Consolidated Record for {user['FIRST_NAME']} {user['LAST_NAME']}:")
        print(f"  User ID: {final_record['USER_ID']}")
        print(f"  Total Purchases: {final_record['TOTAL_PURCHASES']}")
        print(f"  Total Spent: ${final_record['TOTAL_SPENT']:.2f}")
        print(f"  Total Points Earned: {final_record['TOTAL_POINTS_EARNED']}")
        print(f"  Last Updated: {final_record['LAST_UPDATED']}")
        
        # Show all purchases in the array
        purchases_array = final_record['PURCHASES']
        if isinstance(purchases_array, str):
            purchases_array = json.loads(purchases_array)
        
        print(f"\n📝 All Purchases in Array ({len(purchases_array)}):")
        print(f"{'#':<3} {'Date':<12} {'Store':<20} {'Amount':<8} {'Points':<8} {'Hunt ID'}")
        print("-" * 75)
        
        for i, p in enumerate(purchases_array, 1):
            date_str = p['purchase_date'][:10] if 'purchase_date' in p else 'Unknown'
            store = p['store_location'][:19] if len(p['store_location']) > 19 else p['store_location']
            hunt = p.get('hunt_id', 'None')[:15] if p.get('hunt_id') else 'None'
            print(f"{i:<3} {date_str:<12} {store:<20} ${p['total_amount']:<7.2f} {p['points_earned']:<8} {hunt}")
        
        conn.close()
        print("\n🎉 Consolidated purchase history test completed!")
        print("✅ One user = One row with all purchases in an array!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_consolidated_purchases()
