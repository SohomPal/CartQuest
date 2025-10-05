#!/usr/bin/env python3
"""
Script to add test users to the Snowflake users table
"""
import os
from dotenv import load_dotenv
import snowflake.connector
from snowflake.connector import DictCursor
import uuid
from datetime import datetime

# Load environment variables
load_dotenv()

def add_test_users():
    """Add two test users to the users table"""
    
    # Get connection parameters
    config = {
        'account': os.getenv('SNOWFLAKE_ACCOUNT'),
        'user': os.getenv('SNOWFLAKE_USER'),
        'password': os.getenv('SNOWFLAKE_PASSWORD'),
        'warehouse': os.getenv('SNOWFLAKE_WAREHOUSE'),
        'database': os.getenv('SNOWFLAKE_DATABASE'),
        'schema': os.getenv('SNOWFLAKE_SCHEMA')
    }
    
    # Test users data
    test_users = [
        {
            'user_id': str(uuid.uuid4()),
            'email': 'alice.smith@example.com',
            'first_name': 'Alice',
            'last_name': 'Smith'
        },
        {
            'user_id': str(uuid.uuid4()),
            'email': 'bob.johnson@example.com',
            'first_name': 'Bob',
            'last_name': 'Johnson'
        }
    ]
    
    try:
        print("🔄 Connecting to Snowflake...")
        conn = snowflake.connector.connect(**config)
        cursor = conn.cursor(DictCursor)
        print("✅ Connected successfully!")
        
        current_time = datetime.now()
        
        print("\n🔄 Adding test users...")
        
        for i, user in enumerate(test_users, 1):
            try:
                print(f"Adding user {i}: {user['first_name']} {user['last_name']} ({user['email']})")
                
                cursor.execute("""
                    INSERT INTO users (user_id, email, first_name, last_name, points, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    user['user_id'],
                    user['email'],
                    user['first_name'],
                    user['last_name'],
                    0,  # starting points
                    current_time,
                    current_time
                ))
                
                print(f"✅ Added user: {user['first_name']} {user['last_name']} (ID: {user['user_id']})")
                
            except snowflake.connector.errors.IntegrityError as e:
                print(f"⚠️  User {user['email']} already exists, skipping...")
            except Exception as e:
                print(f"❌ Error adding user {user['email']}: {e}")
        
        # Commit the changes
        conn.commit()
        print("\n✅ All changes committed!")
        
        # Show all users in the table
        print("\n📋 Current users in the table:")
        cursor.execute("SELECT user_id, email, first_name, last_name, points, created_at FROM users ORDER BY created_at")
        users = cursor.fetchall()
        
        if users:
            print(f"{'Name':<20} {'Email':<25} {'Points':<8} {'User ID':<36}")
            print("-" * 90)
            for user in users:
                name = f"{user['FIRST_NAME']} {user['LAST_NAME']}"
                print(f"{name:<20} {user['EMAIL']:<25} {user['POINTS']:<8} {user['USER_ID']}")
        else:
            print("No users found in the table.")
        
        conn.close()
        print(f"\n🎉 Successfully processed {len(test_users)} users!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nMake sure:")
        print("1. Your users table exists in Snowflake")
        print("2. Your connection credentials are correct")
        print("3. Your warehouse is running")

if __name__ == "__main__":
    add_test_users()
