#!/usr/bin/env python3
"""
Test script to verify Snowflake connection
"""
import os
from dotenv import load_dotenv
import snowflake.connector
from snowflake.connector import DictCursor

# Load environment variables
load_dotenv()

def test_snowflake_connection():
    """Test the Snowflake connection and basic operations"""
    
    # Get connection parameters
    config = {
        'account': os.getenv('SNOWFLAKE_ACCOUNT'),
        'user': os.getenv('SNOWFLAKE_USER'),
        'password': os.getenv('SNOWFLAKE_PASSWORD'),
        'warehouse': os.getenv('SNOWFLAKE_WAREHOUSE'),
        'database': os.getenv('SNOWFLAKE_DATABASE'),
        'schema': os.getenv('SNOWFLAKE_SCHEMA')
    }
    
    print("Testing Snowflake connection with:")
    print(f"Account: {config['account']}")
    print(f"User: {config['user']}")
    print(f"Warehouse: {config['warehouse']}")
    print(f"Database: {config['database']}")
    print(f"Schema: {config['schema']}")
    print("-" * 50)
    
    try:
        # Test connection
        print("🔄 Connecting to Snowflake...")
        conn = snowflake.connector.connect(**config)
        print("✅ Connection successful!")
        
        cursor = conn.cursor(DictCursor)
        
        # Test warehouse
        print("\n🔄 Testing warehouse...")
        cursor.execute("SELECT CURRENT_WAREHOUSE()")
        warehouse = cursor.fetchone()
        print(f"✅ Current warehouse: {warehouse}")
        
        # Test database and schema
        print("\n🔄 Testing database and schema...")
        cursor.execute("SELECT CURRENT_DATABASE(), CURRENT_SCHEMA()")
        db_schema = cursor.fetchone()
        print(f"✅ Current database: {db_schema['CURRENT_DATABASE()']}")
        print(f"✅ Current schema: {db_schema['CURRENT_SCHEMA()']}")
        
        # Check if users table exists
        print("\n🔄 Checking if users table exists...")
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = CURRENT_SCHEMA() 
            AND table_name = 'USERS'
        """)
        table_exists = cursor.fetchone()
        
        if table_exists:
            print("✅ Users table exists!")
            
            # Count users
            cursor.execute("SELECT COUNT(*) as user_count FROM users")
            count = cursor.fetchone()
            print(f"✅ Current user count: {count['USER_COUNT']}")
            
        else:
            print("⚠️  Users table not found. You may need to create it.")
            print("Run this in Snowflake:")
            print("""
CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
    updated_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);
            """)
        
        conn.close()
        print("\n🎉 All tests passed! Your Snowflake setup is ready!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nTroubleshooting tips:")
        print("1. Check your .env file has correct credentials")
        print("2. Make sure your warehouse is running in Snowflake")
        print("3. Verify database and schema names match what you created")
        
if __name__ == "__main__":
    test_snowflake_connection()
