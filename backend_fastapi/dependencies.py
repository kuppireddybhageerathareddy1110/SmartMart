"""
FastAPI dependencies for role-based access control using MongoDB.
"""
from fastapi import Depends, HTTPException, Header
from typing import Optional
from database import get_database, doc_to_dict
from auth import decode_token
from bson import ObjectId


async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """Extract and validate the current user from the JWT token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("userId")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    db = get_database()
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid user ID")

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return doc_to_dict(user)


async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


def require_role(*roles: str):
    async def checker(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user["role"] not in roles:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied. Required roles: {', '.join(roles)}"
            )
        return current_user
    return checker


async def require_shopkeeper(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user["role"] not in ("SHOPKEEPER", "ADMIN"):
        raise HTTPException(status_code=403, detail="Shopkeeper access required")
    return current_user


async def require_delivery_agent(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user["role"] not in ("DELIVERY_AGENT", "ADMIN"):
        raise HTTPException(status_code=403, detail="Delivery Agent access required")
    return current_user


async def require_warehouse_owner(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user["role"] not in ("WAREHOUSE_OWNER", "ADMIN"):
        raise HTTPException(status_code=403, detail="Warehouse Owner access required")
    return current_user
