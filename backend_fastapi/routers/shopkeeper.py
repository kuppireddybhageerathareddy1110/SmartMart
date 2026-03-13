from fastapi import APIRouter, Depends, HTTPException
from typing import List
from database import get_database, doc_to_dict, docs_to_list
from dependencies import require_shopkeeper
from bson import ObjectId

router = APIRouter(prefix="/api/shopkeeper", tags=["shopkeeper"])


@router.get("/orders")
async def get_pending_orders(shopkeeper: dict = Depends(require_shopkeeper)):
    db = get_database()
    cursor = db.orders.find({"status": "PENDING"})
    orders = await cursor.to_list(length=200)
    return docs_to_list(orders)


@router.put("/orders/{order_id}/fulfill")
async def fulfill_order(order_id: str, shopkeeper: dict = Depends(require_shopkeeper)):
    db = get_database()
    try:
        oid = ObjectId(order_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID")

    result = await db.orders.update_one({"_id": oid}, {"$set": {"status": "PROCESSING"}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order marked as Processing"}
