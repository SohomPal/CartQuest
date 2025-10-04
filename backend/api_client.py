"""
Simple client functions for interacting with the Grocery Store User Profile API
Your friend can import these functions and use them directly.
"""

import requests
import json
from typing import List, Dict, Optional

class GroceryAPIClient:
    def __init__(self, base_url: str = "http://localhost:8000"):
        """
        Initialize the API client
        
        Args:
            base_url: The base URL of the API (default: http://localhost:8000)
        """
        self.base_url = base_url.rstrip('/')
    
    def update_user_points(self, user_id: str, points_change: int, description: str = None) -> Dict:
        """
        Update a user's points (add or subtract)
        
        Args:
            user_id: The user's ID
            points_change: Points to add (positive) or subtract (negative)
            description: Optional description for the point change
        
        Returns:
            Dict with point update details
        
        Example:
            client.update_user_points("user123", 50, "Bonus points")
            client.update_user_points("user123", -25, "Redeemed discount")
        """
        url = f"{self.base_url}/users/{user_id}/points"
        data = {
            "points_change": points_change,
            "description": description
        }
        
        response = requests.post(url, json=data)
        
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            raise Exception(f"User {user_id} not found")
        elif response.status_code == 400:
            raise Exception("Insufficient points balance")
        else:
            raise Exception(f"API error: {response.text}")
    
    def get_purchase_history(self, user_id: str, limit: int = 50) -> List[Dict]:
        """
        Get a user's purchase history
        
        Args:
            user_id: The user's ID
            limit: Maximum number of purchases to return (default: 50)
        
        Returns:
            List of purchase dictionaries
        
        Example:
            purchases = client.get_purchase_history("user123")
            for purchase in purchases:
                print(f"${purchase['total_amount']} at {purchase['store_location']}")
        """
        url = f"{self.base_url}/users/{user_id}/purchases"
        params = {"limit": limit}
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            raise Exception(f"User {user_id} not found")
        else:
            raise Exception(f"API error: {response.text}")
    
    def get_user_profile(self, user_id: str) -> Dict:
        """
        Get a user's profile including current points
        
        Args:
            user_id: The user's ID
        
        Returns:
            User profile dictionary
        
        Example:
            user = client.get_user_profile("user123")
            print(f"{user['first_name']} has {user['points']} points")
        """
        url = f"{self.base_url}/users/{user_id}"
        
        response = requests.get(url)
        
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            raise Exception(f"User {user_id} not found")
        else:
            raise Exception(f"API error: {response.text}")
    
    def get_specific_purchase(self, user_id: str, purchase_id: str) -> Dict:
        """
        Get details of a specific purchase
        
        Args:
            user_id: The user's ID
            purchase_id: The purchase ID
        
        Returns:
            Purchase details dictionary
        
        Example:
            purchase = client.get_specific_purchase("user123", "purchase456")
            print(f"Items: {purchase['items']}")
        """
        url = f"{self.base_url}/users/{user_id}/purchases/{purchase_id}"
        
        response = requests.get(url)
        
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            raise Exception(f"Purchase {purchase_id} not found for user {user_id}")
        else:
            raise Exception(f"API error: {response.text}")


# Convenience functions that don't require creating a client instance
def update_points(user_id: str, points_change: int, description: str = None, api_url: str = "http://localhost:8000") -> Dict:
    """
    Quick function to update user points
    
    Example:
        update_points("user123", 100, "Welcome bonus")
        update_points("user123", -50, "Coupon redemption")
    """
    client = GroceryAPIClient(api_url)
    return client.update_user_points(user_id, points_change, description)


def get_purchases(user_id: str, limit: int = 50, api_url: str = "http://localhost:8000") -> List[Dict]:
    """
    Quick function to get purchase history
    
    Example:
        purchases = get_purchases("user123")
        recent_purchases = get_purchases("user123", limit=10)
    """
    client = GroceryAPIClient(api_url)
    return client.get_purchase_history(user_id, limit)


def get_user_points(user_id: str, api_url: str = "http://localhost:8000") -> int:
    """
    Quick function to get just the user's current points
    
    Example:
        points = get_user_points("user123")
        print(f"User has {points} points")
    """
    client = GroceryAPIClient(api_url)
    user = client.get_user_profile(user_id)
    return user['points']


# Example usage
if __name__ == "__main__":
    # Example of how your friend would use these functions
    
    # Option 1: Use the client class
    client = GroceryAPIClient()
    
    try:
        # Add 100 points to a user
        result = client.update_user_points("user123", 100, "Loyalty bonus")
        print(f"Points updated: {result}")
        
        # Get purchase history
        purchases = client.get_purchase_history("user123", limit=10)
        print(f"Found {len(purchases)} recent purchases")
        
        # Check current points
        user = client.get_user_profile("user123")
        print(f"User {user['first_name']} now has {user['points']} points")
        
    except Exception as e:
        print(f"Error: {e}")
    
    # Option 2: Use convenience functions
    try:
        # Even simpler - just use the functions directly
        points = get_user_points("user123")
        print(f"Current points: {points}")
        
        update_points("user123", -25, "Redeemed for discount")
        
        recent_purchases = get_purchases("user123", limit=5)
        print(f"Recent purchases: {len(recent_purchases)}")
        
    except Exception as e:
        print(f"Error: {e}")