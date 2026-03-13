import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_registration():
    """Test user registration"""
    print("=" * 50)
    print("Testing User Registration")
    print("=" * 50)
    
    # Test data
    test_user = {
        "name": "Test Admin",
        "email": "admin@smartmart.com",
        "password": "admin123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=test_user)
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Registration successful!")
        print(f"Token received: {data['token'][:50]}...")
        return data['token']
    else:
        print(f"❌ Registration failed: {response.status_code}")
        print(f"Error: {response.text}")
        return None

def test_login(email, password):
    """Test user login"""
    print("\n" + "=" * 50)
    print("Testing User Login")
    print("=" * 50)
    
    credentials = {
        "email": email,
        "password": password
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=credentials)
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Login successful!")
        print(f"Token received: {data['token'][:50]}...")
        return data['token']
    else:
        print(f"❌ Login failed: {response.status_code}")
        print(f"Error: {response.text}")
        return None

def test_protected_endpoint(token):
    """Test accessing protected endpoint with token"""
    print("\n" + "=" * 50)
    print("Testing Protected Endpoint (My Orders)")
    print("=" * 50)
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(f"{BASE_URL}/orders", headers=headers)
    
    if response.status_code == 200:
        print("✅ Protected endpoint accessible!")
        print(f"Orders: {response.json()}")
        return True
    else:
        print(f"❌ Failed to access protected endpoint: {response.status_code}")
        print(f"Error: {response.text}")
        return False

def test_health():
    """Test health endpoint"""
    print("\n" + "=" * 50)
    print("Testing Health Endpoint")
    print("=" * 50)
    
    response = requests.get(f"{BASE_URL}/health")
    
    if response.status_code == 200:
        print("✅ Health check passed!")
        print(f"Response: {response.json()}")
        return True
    else:
        print(f"❌ Health check failed: {response.status_code}")
        return False

def create_test_users():
    """Create test users for each role"""
    print("\n" + "=" * 50)
    print("Creating Test Users for Each Role")
    print("=" * 50)
    
    test_users = [
        {"name": "Shopkeeper User", "email": "shopkeeper@smartmart.com", "password": "shop123"},
        {"name": "Delivery Agent", "email": "delivery@smartmart.com", "password": "delivery123"},
        {"name": "Warehouse Manager", "email": "warehouse@smartmart.com", "password": "warehouse123"},
        {"name": "Regular User", "email": "user@smartmart.com", "password": "user123"},
    ]
    
    tokens = {}
    for user in test_users:
        response = requests.post(f"{BASE_URL}/auth/register", json=user)
        if response.status_code == 200:
            print(f"✅ Created: {user['email']}")
            tokens[user['email']] = response.json()['token']
        else:
            print(f"❌ Failed to create: {user['email']} - {response.text}")
    
    return tokens

if __name__ == "__main__":
    print("\n🚀 SmartMart API Testing Suite\n")
    
    # Test 1: Health check
    test_health()
    
    # Test 2: Register admin user
    admin_token = test_registration()
    
    # Test 3: Login with admin credentials
    if admin_token:
        login_token = test_login("admin@smartmart.com", "admin123")
        
        # Test 4: Access protected endpoint
        if login_token:
            test_protected_endpoint(login_token)
    
    # Test 5: Create additional test users
    user_tokens = create_test_users()
    
    print("\n" + "=" * 50)
    print("✅ Testing Complete!")
    print("=" * 50)
    print(f"\nCreated {len(user_tokens) + 1} test users")
    print("\nNext steps:")
    print("1. Access database to assign roles to users")
    print("2. Login as different roles to test portals")
    print("3. Visit http://localhost:5173 to test frontend")
