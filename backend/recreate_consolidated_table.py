#!/usr/bin/env python3
"""
Script to recreate the user_purchase_history table with consolidated structure
"""
import os
from dotenv import load_dotenv
import snowflake.connector
from snowflake.connector import DictCursor

load_dotenv()

def recreate_consolidated_table():
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
        
        print("🔄 Recreating user_purchase_history table with consolidated structure...")
        
        # Drop existing table
        print("🗑️ Dropping existing table...")
        cursor.execute("DROP TABLE IF EXISTS user_purchase_history")
        
        # Create new consolidated table
        print("🔨 Creating new consolidated table...")
        create_sql = """
        CREATE TABLE user_purchase_history (
            user_id VARCHAR(50) PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            purchases VARIANT NOT NULL DEFAULT '[]',
            total_purchases INTEGER DEFAULT 0,
            total_spent NUMBER(10,2) DEFAULT 0.00,
            total_points_earned INTEGER DEFAULT 0,
            first_purchase_date TIMESTAMP_NTZ,
            last_purchase_date TIMESTAMP_NTZ,
            last_updated TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
        COMMENT = 'Consolidated user purchase history - one row per user with all purchases in array'
        """
        
        cursor.execute(create_sql)
        
        # Verify table structure
        print("✅ Table created! Checking structure...")
        cursor.execute("DESCRIBE TABLE user_purchase_history")
        columns = cursor.fetchall()
        
        print("📋 New table structure:")
        for col in columns:
            print(f"  {col['name']}: {col['type']} ({'NOT NULL' if col['null?'] == 'N' else 'NULLABLE'})")
        
        conn.commit()
        conn.close()
        
        print("🎉 Consolidated table created successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error recreating table: {e}")
        return False

if __name__ == "__main__":
    recreate_consolidated_table()
