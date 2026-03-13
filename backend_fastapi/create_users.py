"""
Create test users directly in the database with proper password hashing
"""
from database import SessionLocal, User
from auth import get_password_hash

def create_users():
    """Create test users with hashed passwords"""
    db = SessionLocal()
    
    try:
        print("=" * 70)
        print("CREATING TEST USERS")
        print("=" * 70)
        
        # Check if users already exist
        existing_count = db.query(User).count()
        if existing_count > 0:
            print(f"\n⚠️  Found {existing_count} existing users.")
            response = input("Delete all existing users and recreate? (yes/no): ")
            if response.lower() == 'yes':
                db.query(User).delete()
                db.commit()
                print("✅ Deleted all existing users")
            else:
                print("❌ Cancelled. Existing users kept.")
                return
        
        # Test users with their credentials
        test_users = [
            {"name": "Admin User", "email": "admin@smartmart.com", "password": "admin123", "role": "ADMIN"},
            {"name": "Shopkeeper User", "email": "shopkeeper@smartmart.com", "password": "shop123", "role": "SHOPKEEPER"},
            {"name": "Delivery Agent", "email": "delivery@smartmart.com", "password": "delivery123", "role": "DELIVERY_AGENT"},
            {"name": "Warehouse Manager", "email": "warehouse@smartmart.com", "password": "warehouse123", "role": "WAREHOUSE_OWNER"},
            {"name": "Regular User", "email": "user@smartmart.com", "password": "user123", "role": "USER"},
        ]
        
        print("\nCreating users...\n")
        
        for user_data in test_users:
            # Hash the password
            hashed_password = get_password_hash(user_data["password"])
            
            # Create user
            new_user = User(
                name=user_data["name"],
                email=user_data["email"],
                password=hashed_password,
                role=user_data["role"]
            )
            
            db.add(new_user)
            print(f"✅ Created: {user_data['email']:30} | Role: {user_data['role']:20} | Password: {user_data['password']}")
        
        db.commit()
        
        print("\n" + "=" * 70)
        print("✅ ALL USERS CREATED SUCCESSFULLY!")
        print("=" * 70)
        
        print("\nYou can now login with:")
        print("  - admin@smartmart.com / admin123 (ADMIN)")
        print("  - shopkeeper@smartmart.com / shop123 (SHOPKEEPER)")
        print("  - delivery@smartmart.com / delivery123 (DELIVERY_AGENT)")
        print("  - warehouse@smartmart.com / warehouse123 (WAREHOUSE_OWNER)")
        print("  - user@smartmart.com / user123 (USER)")
        
        print("\nFrontend: http://localhost:5173/login")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_users()
