#!/usr/bin/env python3
"""
Test script to verify authentication flow
"""
import requests
import json

BASE_URL = "https://mangrove-watch.onrender.com"

def test_signup():
    """Test user signup"""
    print("Testing signup...")
    signup_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123"
    }
    
    response = requests.post(f"{BASE_URL}/signup", json=signup_data)
    print(f"Signup response: {response.status_code}")
    print(f"Response body: {response.json()}")
    return response.json()

def test_login():
    """Test user login"""
    print("\nTesting login...")
    login_data = {
        "username": "testuser",
        "password": "testpass123"
    }
    
    response = requests.post(f"{BASE_URL}/login", json=login_data)
    print(f"Login response: {response.status_code}")
    print(f"Response body: {response.json()}")
    return response.json()

if __name__ == "__main__":
    try:
        # Test signup
        signup_result = test_signup()
        
        # Test login
        login_result = test_login()
        
        # Check if username and email are returned
        if login_result.get("status") == "success":
            print(f"\n✅ Login successful!")
            print(f"Username: {login_result.get('username')}")
            print(f"Email: {login_result.get('email')}")
            print(f"User ID: {login_result.get('user_id')}")
        else:
            print(f"\n❌ Login failed: {login_result.get('message')}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend server. Make sure it's running on https://mangrove-watch.onrender.com")
    except Exception as e:
        print(f"❌ Error: {e}")
