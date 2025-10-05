#!/usr/bin/env python3
"""
Check the current structure of the user_purchase_history table
"""
import os
from dotenv import load_dotenv
import snowflake.connector
from snowflake.connector import DictCursor

load_dotenv()

def check_table_structure():
    config = {
        'account': os.getenv('SNOWFLAKE_ACCOUNT'),
        'user': os.getenv('SNOWFLAKE_USER'),
        'password': os.getenv('SNOWFLAKE_PASSWORD'),
        'warehouse': os.getenv('SNOWFLAKE_WAREHOUSE'),
        'database': os.getenv('SNOWFLAKE_DATABASE'),
        'schema': os.getenv('SNOWFLAKE_SCHEMA')
    }
    
    try:
        conn = snowflake.connector.connect(**config)
        cursor = conn.cursor(DictCursor)
        
        print("🔍 Checking user_purchase_history table structure...")
        
        # Check if table exists and get its structure
        cursor.execute("DESCRIBE TABLE user_purchase_history")
        columns = cursor.fetchall()
        
        print("📋 Current table structure:")
        for col in columns:
            print(f"  {col['name']}: {col['type']} ({'NOT NULL' if col['null?'] == 'N' else 'NULLABLE'})")
        
        # Check if there are any existing records
        cursor.execute("SELECT COUNT(*) as record_count FROM user_purchase_history")
        count = cursor.fetchone()['RECORD_COUNT']
        print(f"\n📊 Current records in table: {count}")
        
        if count > 0:
            cursor.execute("SELECT * FROM user_purchase_history LIMIT 3")
            records = cursor.fetchall()
            print("\n📋 Sample records:")
            for i, record in enumerate(records, 1):
                print(f"  Record {i}: {dict(record)}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error checking table: {e}")

if __name__ == "__main__":
    check_table_structure()
