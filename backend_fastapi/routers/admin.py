from fastapi import APIRouter, Depends, HTTPException
from typing import List
from database import get_database, doc_to_dict, docs_to_list
from schemas import UserResponse, ProductResponse, OrderResponse, UserCreate
from dependencies import require_admin
from auth import get_password_hash
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/admin", tags=["admin"])


class DashboardStats(BaseModel):
    totalUsers: int
    totalProducts: int
    totalOrders: int
    totalRevenue: float


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(admin: dict = Depends(require_admin)):
    db = get_database()
    total_users = await db.users.count_documents({})
    total_products = await db.products.count_documents({})
    total_orders = await db.orders.count_documents({})

    # Sum totalAmount
    pipeline = [{"$group": {"_id": None, "total": {"$sum": "$totalAmount"}}}]
    result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = result[0]["total"] if result else 0.0

    return DashboardStats(
        totalUsers=total_users,
        totalProducts=total_products,
        totalOrders=total_orders,
        totalRevenue=total_revenue
    )


@router.get("/users", response_model=List[UserResponse])
async def get_all_users(admin: dict = Depends(require_admin)):
    db = get_database()
    cursor = db.users.find({})
    users = await cursor.to_list(length=1000)
    return docs_to_list(users)


@router.post("/users", response_model=UserResponse, status_code=201)
async def create_user(user_data: UserCreate, admin: dict = Depends(require_admin)):
    """Admin creates a new user with a specific role."""
    db = get_database()
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    valid_roles = ["USER", "ADMIN", "SHOPKEEPER", "DELIVERY_AGENT", "WAREHOUSE_OWNER"]
    role = user_data.role or "USER"
    if role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}")

    hashed = get_password_hash(user_data.password)
    doc = {
        "name": user_data.name,
        "email": user_data.email,
        "password": hashed,
        "role": role,
        "createdAt": datetime.utcnow()
    }
    result = await db.users.insert_one(doc)
    created = await db.users.find_one({"_id": result.inserted_id})
    return doc_to_dict(created)


@router.put("/users/{user_id}/role")
async def update_user_role(user_id: str, role: str, admin: dict = Depends(require_admin)):
    valid_roles = ["USER", "ADMIN", "SHOPKEEPER", "DELIVERY_AGENT", "WAREHOUSE_OWNER"]
    if role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}")

    db = get_database()
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    result = await db.users.update_one({"_id": oid}, {"$set": {"role": role}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"User role updated to {role}"}


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, admin: dict = Depends(require_admin)):
    db = get_database()
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    result = await db.users.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}
