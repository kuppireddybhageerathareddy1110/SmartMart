"""
Script to assign roles to test users in the database
"""
from database import SessionLocal, User

def assign_roles():
    """Assign roles to test users"""
    db = SessionLocal()
    
    try:
        # Role assignments
        role_assignments = {
            "admin@smartmart.com": "ADMIN",
            "shopkeeper@smartmart.com": "SHOPKEEPER",
            "delivery@smartmart.com": "DELIVERY_AGENT",
            "warehouse@smartmart.com": "WAREHOUSE_OWNER",
            "user@smartmart.com": "USER"
        }
        
        print("=" * 60)
        print("Assigning Roles to Test Users")
        print("=" * 60)
        
        for email, role in role_assignments.items():
            user = db.query(User).filter(User.email == email).first()
            if user:
                user.role = role
                print(f"✅ {email:30} → {role}")
            else:
                print(f"❌ User not found: {email}")
        
        db.commit()
        
        print("\n" + "=" * 60)
        print("All Users and Their Roles:")
        print("=" * 60)
        
        all_users = db.query(User).all()
        for user in all_users:
            print(f"{user.id:3} | {user.email:30} | {user.role:20} | {user.name}")
        
        print("\n✅ Role assignment complete!")
        print("\nYou can now login as:")
        print("  - admin@smartmart.com (ADMIN) - Access Admin Dashboard")
        print("  - shopkeeper@smartmart.com (SHOPKEEPER) - Access Shopkeeper Portal")
        print("  - delivery@smartmart.com (DELIVERY_AGENT) - Access Delivery Portal")
        print("  - warehouse@smartmart.com (WAREHOUSE_OWNER) - Access Warehouse Portal")
        print("  - user@smartmart.com (USER) - Regular user access")
        print("\nAll passwords: admin123, shop123, delivery123, warehouse123, user123")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    assign_roles()
