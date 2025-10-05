#!/usr/bin/env python3
"""
Script to delete any user from the Snowflake users table
"""
import os
from dotenv import load_dotenv
import snowflake.connector
from snowflake.connector import DictCursor

# Load environment variables
load_dotenv()

def delete_user(first_name, last_name):
    """Delete a user from the users table by first and last name"""
    
    # Get connection parameters
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
        
        # First, let's see all users before deletion
        print("\n📋 Users before deletion:")
        cursor.execute("SELECT user_id, email, first_name, last_name, points FROM users ORDER BY created_at")
        users_before = cursor.fetchall()
        
        if users_before:
            print(f"{'Name':<20} {'Email':<25} {'Points':<8} {'User ID':<36}")
            print("-" * 90)
            for user in users_before:
                name = f"{user['FIRST_NAME']} {user['LAST_NAME']}"
                print(f"{name:<20} {user['EMAIL']:<25} {user['POINTS']:<8} {user['USER_ID']}")
        else:
            print("No users found in the table.")
            return
        
        # Find and delete the specified user
        print(f"\n🔄 Looking for {first_name} {last_name}...")
        cursor.execute("""
            SELECT user_id, email, first_name, last_name 
            FROM users 
            WHERE first_name = %s AND last_name = %s
        """, (first_name, last_name))
        user = cursor.fetchone()
        
        if user:
            print(f"Found user: {user['FIRST_NAME']} {user['LAST_NAME']} ({user['EMAIL']})")
            print(f"User ID: {user['USER_ID']}")
            
            # Delete the user
            print(f"🗑️  Deleting {first_name} {last_name}...")
            cursor.execute("DELETE FROM users WHERE user_id = %s", (user['USER_ID'],))
            
            # Check how many rows were affected
            rows_deleted = cursor.rowcount
            print(f"✅ Deleted {rows_deleted} user(s)")
            
            # Commit the changes
            conn.commit()
            print("✅ Changes committed!")
            
        else:
            print(f"❌ {first_name} {last_name} not found in the database")
            return
        
        # Show remaining users after deletion
        print("\n📋 Users after deletion:")
        cursor.execute("SELECT user_id, email, first_name, last_name, points FROM users ORDER BY created_at")
        users_after = cursor.fetchall()
        
        if users_after:
            print(f"{'Name':<20} {'Email':<25} {'Points':<8} {'User ID':<36}")
            print("-" * 90)
            for user in users_after:
                name = f"{user['FIRST_NAME']} {user['LAST_NAME']}"
                print(f"{name:<20} {user['EMAIL']:<25} {user['POINTS']:<8} {user['USER_ID']}")
        else:
            print("No users remaining in the table.")
        
        conn.close()
        print(f"\n🎉 {first_name} {last_name} has been successfully deleted from the database!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nMake sure:")
        print("1. Your users table exists in Snowflake")
        print("2. Your connection credentials are correct")
        print("3. Your warehouse is running")
        print("4. The user exists in the database")

if __name__ == "__main__":
    # Example usage - modify these values as needed:
    
    # To delete Alice Smith:
    # delete_user("Alice", "Smith")
    
    # To delete Bob Johnson:
    # delete_user("Bob", "Johnson")
    
    # To delete any user:
    # delete_user("FirstName", "LastName")
    
    print("� This script is ready to use!")
    print("📝 Edit the bottom of this file to specify:")
    print("   - First name")
    print("   - Last name of user to delete")
    print("\n🔍 Example: delete_user('Alice', 'Smith')")
    print("⚠️  WARNING: This will permanently delete the user!")
    print("\n� Uncomment and modify one of the examples above, then run the script again!")

