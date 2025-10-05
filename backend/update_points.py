#!/usr/bin/env python3
"""
Script to update user points in the Snowflake users table
"""
import os
from dotenv import load_dotenv
import snowflake.connector
from snowflake.connector import DictCursor
from datetime import datetime

# Load environment variables
load_dotenv()

def update_user_points(first_name, last_name, points_change):
    """Update a user's points by adding or subtracting points"""
    
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
        
        # First, let's see all users and their current points
        print("\n📋 Current users and points:")
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
        
        # Find the user to update
        print(f"\n🔄 Looking for {first_name} {last_name}...")
        cursor.execute("""
            SELECT user_id, email, first_name, last_name, points 
            FROM users 
            WHERE first_name = %s AND last_name = %s
        """, (first_name, last_name))
        user = cursor.fetchone()
        
        if user:
            current_points = user['POINTS']
            new_points = current_points + points_change
            
            print(f"Found user: {user['FIRST_NAME']} {user['LAST_NAME']} ({user['EMAIL']})")
            print(f"Current points: {current_points}")
            print(f"Points change: {'+' if points_change >= 0 else ''}{points_change}")
            print(f"New points: {new_points}")
            
            # Prevent negative points
            if new_points < 0:
                print("❌ Error: Points cannot go below 0")
                return
            
            # Update the user's points
            print(f"💰 Updating {first_name} {last_name}'s points...")
            cursor.execute("""
                UPDATE users 
                SET points = %s, updated_at = %s 
                WHERE user_id = %s
            """, (new_points, datetime.now(), user['USER_ID']))
            
            # Check how many rows were affected
            rows_updated = cursor.rowcount
            print(f"✅ Updated {rows_updated} user(s)")
            
            # Commit the changes
            conn.commit()
            print("✅ Changes committed!")
            
        else:
            print(f"❌ {first_name} {last_name} not found in the database")
            return
        
        # Show all users after the update
        print("\n📋 Users after points update:")
        cursor.execute("SELECT user_id, email, first_name, last_name, points FROM users ORDER BY created_at")
        users_after = cursor.fetchall()
        
        if users_after:
            print(f"{'Name':<20} {'Email':<25} {'Points':<8} {'User ID':<36}")
            print("-" * 90)
            for user in users_after:
                name = f"{user['FIRST_NAME']} {user['LAST_NAME']}"
                # Highlight the updated user
                highlight = "🌟 " if user['FIRST_NAME'] == first_name and user['LAST_NAME'] == last_name else "   "
                print(f"{highlight}{name:<17} {user['EMAIL']:<25} {user['POINTS']:<8} {user['USER_ID']}")
        
        conn.close()
        print(f"\n🎉 Successfully updated {first_name} {last_name}'s points!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nMake sure:")
        print("1. Your users table exists in Snowflake")
        print("2. Your connection credentials are correct")
        print("3. Your warehouse is running")
        print("4. The user exists in the database")

if __name__ == "__main__":
    # Example usage - modify these values as needed:
    
    # To add 30 points to Alice:
    # update_user_points("Alice", "Smith", 30)
    
    # To add 50 points to Bob:
    # update_user_points("Bob", "Johnson", 50)
    
    # To subtract 10 points from any user:
    # update_user_points("FirstName", "LastName", -10)
    
    print("💡 This script is ready to use!")
    print("📝 Edit the bottom of this file to specify:")
    print("   - First name")
    print("   - Last name") 
    print("   - Points to add/subtract")
    print("\n🔍 Example: update_user_points('Alice', 'Smith', 30)")
    print("\n👆 Uncomment and modify one of the examples above, then run the script again!")
