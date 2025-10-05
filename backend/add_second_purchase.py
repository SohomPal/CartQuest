#!/usr/bin/env python3
"""
Script to add a second purchase to John Doe's purchase history with a different date
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

def add_second_purchase():
    """Add a second purchase record for John Doe from a different date"""
    
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
        
        # Find John Doe
        cursor.execute("SELECT user_id, first_name, last_name, points FROM users WHERE first_name = 'John' AND last_name = 'Doe'")
        user = cursor.fetchone()
        
        if not user:
            print("❌ John Doe not found! Run add_test_user.py first.")
            return
        
        user_id = user['USER_ID']
        current_points = user['POINTS']
        print(f"🧪 Adding second purchase for: {user['FIRST_NAME']} {user['LAST_NAME']}")
        print(f"💰 Current points: {current_points}")
        
        # Show current purchase history
        cursor.execute("SELECT COUNT(*) as purchase_count FROM user_purchase_history WHERE user_id = %s", (user_id,))
        history_count = cursor.fetchone()
        print(f"📊 Current purchases: {history_count['PURCHASE_COUNT']}")
        
        # Second purchase data - different store, different date (3 days ago)
        purchase_date = datetime.now() - timedelta(days=3)
        
        second_purchase = {
            'purchase_id': str(uuid.uuid4()),
            'user_id': user_id,
            'store_location': 'Fresh Market Plaza',
            'total_amount': 32.45,
            'items': [
                {'name': 'Avocados', 'price': 1.99, 'quantity': 4, 'category': 'produce'},
                {'name': 'Sourdough Bread', 'price': 4.99, 'quantity': 1, 'category': 'bakery'},
                {'name': 'Almond Milk', 'price': 3.79, 'quantity': 1, 'category': 'dairy'},
                {'name': 'Quinoa', 'price': 6.99, 'quantity': 1, 'category': 'pantry'},
                {'name': 'Spinach', 'price': 2.99, 'quantity': 2, 'category': 'produce'},
                {'name': 'Olive Oil', 'price': 8.99, 'quantity': 1, 'category': 'pantry'},
                {'name': 'Bell Peppers', 'price': 1.99, 'quantity': 2, 'category': 'produce'}
            ],
            'points_earned': 32,
            'hunt_id': 'healthy-eating-challenge',
            'receipt_image_url': 'https://receipts.couponhunt.com/receipt_' + str(uuid.uuid4())[:8] + '.jpg',
            'status': 'COMPLETED'
        }
        
        print(f"\n📋 Second Purchase Details (from {purchase_date.strftime('%Y-%m-%d')}):")
        print(f"  Store: {second_purchase['store_location']}")
        print(f"  Total: ${second_purchase['total_amount']}")
        print(f"  Points: {second_purchase['points_earned']}")
        print(f"  Hunt ID: {second_purchase['hunt_id']}")
        print(f"  Receipt: {second_purchase['receipt_image_url']}")
        print(f"  Items ({len(second_purchase['items'])}):")
        
        total_check = 0
        for i, item in enumerate(second_purchase['items'], 1):
            item_total = item['price'] * item['quantity']
            total_check += item_total
            print(f"    {i}. {item['name']} - ${item['price']} x {item['quantity']} = ${item_total:.2f} ({item['category']})")
        
        print(f"  Calculated total: ${total_check:.2f}")
        
        # Insert the purchase with custom date
        print(f"\n💾 Adding purchase from {purchase_date.strftime('%Y-%m-%d %H:%M:%S')}...")
        
        items_json = json.dumps(second_purchase['items'])
        
        cursor.execute("""
            INSERT INTO user_purchase_history 
            (purchase_id, user_id, store_location, total_amount, items, purchase_date, points_earned, hunt_id, receipt_image_url, status)
            SELECT %s, %s, %s, %s, PARSE_JSON(%s), %s, %s, %s, %s, %s
        """, (
            second_purchase['purchase_id'],
            second_purchase['user_id'],
            second_purchase['store_location'],
            second_purchase['total_amount'],
            items_json,
            purchase_date,  # Custom date
            second_purchase['points_earned'],
            second_purchase['hunt_id'],
            second_purchase['receipt_image_url'],
            second_purchase['status']
        ))
        
        # Update user points
        print("💰 Updating user points...")
        cursor.execute("""
            UPDATE users 
            SET points = points + %s, updated_at = %s 
            WHERE user_id = %s
        """, (second_purchase['points_earned'], datetime.now(), user_id))
        
        conn.commit()
        print("✅ Purchase and points update committed!")
        
        # Show updated user info
        cursor.execute("SELECT first_name, last_name, points FROM users WHERE user_id = %s", (user_id,))
        updated_user = cursor.fetchone()
        new_points = updated_user['POINTS']
        points_added = new_points - current_points
        
        print(f"\n🎉 {updated_user['FIRST_NAME']} {updated_user['LAST_NAME']} points updated!")
        print(f"  Before: {current_points} points")
        print(f"  Added: +{points_added} points")
        print(f"  After: {new_points} points")
        
        # Show complete purchase history
        cursor.execute("""
            SELECT 
                purchase_id,
                store_location,
                total_amount,
                points_earned,
                purchase_date,
                hunt_id,
                status
            FROM user_purchase_history 
            WHERE user_id = %s 
            ORDER BY purchase_date DESC
        """, (user_id,))
        
        purchases = cursor.fetchall()
        print(f"\n📈 Complete Purchase History for {updated_user['FIRST_NAME']} {updated_user['LAST_NAME']}:")
        print(f"{'Date':<12} {'Store':<20} {'Amount':<8} {'Points':<8} {'Hunt ID':<25} {'Status'}")
        print("-" * 90)
        
        for purchase in purchases:
            date_str = purchase['PURCHASE_DATE'].strftime('%Y-%m-%d')
            print(f"{date_str:<12} {purchase['STORE_LOCATION'][:19]:<20} ${purchase['TOTAL_AMOUNT']:<7.2f} {purchase['POINTS_EARNED']:<8} {purchase['HUNT_ID'][:24]:<25} {purchase['STATUS']}")
        
        # Show summary stats
        cursor.execute("""
            SELECT 
                COUNT(*) as total_purchases,
                SUM(total_amount) as total_spent,
                SUM(points_earned) as total_points_earned,
                AVG(total_amount) as avg_purchase,
                MIN(purchase_date) as first_purchase,
                MAX(purchase_date) as last_purchase
            FROM user_purchase_history 
            WHERE user_id = %s
        """, (user_id,))
        
        summary = cursor.fetchone()
        print(f"\n📊 Purchase Summary:")
        print(f"  Total purchases: {summary['TOTAL_PURCHASES']}")
        print(f"  Total spent: ${summary['TOTAL_SPENT']:.2f}")
        print(f"  Total points earned: {summary['TOTAL_POINTS_EARNED']}")
        print(f"  Average purchase: ${summary['AVG_PURCHASE']:.2f}")
        print(f"  First purchase: {summary['FIRST_PURCHASE'].strftime('%Y-%m-%d')}")
        print(f"  Last purchase: {summary['LAST_PURCHASE'].strftime('%Y-%m-%d')}")
        
        conn.close()
        print("\n🎉 Second purchase added successfully!")
        print("✅ Purchase history now shows multiple transactions!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    add_second_purchase()
