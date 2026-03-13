"""
Debug script to check user credentials and test password verification
"""
from database import SessionLocal, User
from auth import verify_password, get_password_hash

def debug_users():
    """Check all users and their password hashes"""
    db = SessionLocal()
    
    try:
        print("=" * 70)
        print("DATABASE USERS DEBUG")
        print("=" * 70)
        
        users = db.query(User).all()
        
        if not users:
            print("❌ No users found in database!")
            print("\nPlease register a user first via:")
            print("  1. Frontend: http://localhost:5173/login")
            print("  2. Or run: python test_api.py")
            return
        
        print(f"\nFound {len(users)} users:\n")
        
        for user in users:
            print(f"ID: {user.id}")
            print(f"Name: {user.name}")
            print(f"Email: {user.email}")
            print(f"Role: {user.role}")
            print(f"Password Hash: {user.password[:50]}...")
            print("-" * 70)
        
        # Test password verification
        print("\n" + "=" * 70)
        print("TESTING PASSWORD VERIFICATION")
        print("=" * 70)
        
        test_credentials = [
            ("admin@smartmart.com", "admin123"),
            ("shopkeeper@smartmart.com", "shop123"),
            ("delivery@smartmart.com", "delivery123"),
            ("warehouse@smartmart.com", "warehouse123"),
            ("user@smartmart.com", "user123"),
        ]
        
        for email, password in test_credentials:
            user = db.query(User).filter(User.email == email).first()
            if user:
                is_valid = verify_password(password, user.password)
                status = "✅ VALID" if is_valid else "❌ INVALID"
                print(f"{status} | {email:30} | Password: {password}")
            else:
                print(f"❌ NOT FOUND | {email}")
        
        print("\n" + "=" * 70)
        print("RECOMMENDATIONS")
        print("=" * 70)
        
        # Check if any passwords are invalid
        admin_user = db.query(User).filter(User.email == "admin@smartmart.com").first()
        if admin_user and not verify_password("admin123", admin_user.password):
            print("\n⚠️  Password verification failed for test users!")
            print("This means the passwords in the database don't match the test passwords.")
            print("\nTo fix this, you can:")
            print("  1. Delete the database file: smartmart.db")
            print("  2. Restart the server (it will recreate the database)")
            print("  3. Re-run: python test_api.py")
            print("  4. Re-run: python assign_roles.py")
        else:
            print("\n✅ All test credentials are working correctly!")
            print("\nYou can login with:")
            print("  - admin@smartmart.com / admin123")
            print("  - shopkeeper@smartmart.com / shop123")
            print("  - delivery@smartmart.com / delivery123")
            print("  - warehouse@smartmart.com / warehouse123")
            print("  - user@smartmart.com / user123")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_users()
