from fastapi import APIRouter, Depends, HTTPException, Header
from typing import List, Optional
from database import get_database, doc_to_dict, docs_to_list
from schemas import OrderResponse, OrderCreate
from auth import decode_token
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/api/orders", tags=["orders"])


def get_user_id_from_header(authorization: Optional[str] = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload.get("userId")


@router.get("", response_model=List[OrderResponse])
async def get_my_orders(user_id: str = Depends(get_user_id_from_header)):
    db = get_database()
    cursor = db.orders.find({"userId": user_id})
    orders = await cursor.to_list(length=200)
    return docs_to_list(orders)


@router.post("", response_model=OrderResponse, status_code=201)
async def place_order(order_data: OrderCreate, user_id: str = Depends(get_user_id_from_header)):
    db = get_database()
    total = sum(item.price * item.quantity for item in order_data.items)

    items_list = [
        {"id": str(ObjectId()), "productId": item.productId, "quantity": item.quantity, "price": item.price}
        for item in order_data.items
    ]

    doc = {
        "userId": user_id,
        "status": "PENDING",
        "totalAmount": total,
        "orderDate": datetime.utcnow(),
        "items": items_list
    }
    result = await db.orders.insert_one(doc)
    created = await db.orders.find_one({"_id": result.inserted_id})
    return doc_to_dict(created)
