from fastapi import APIRouter, Depends, HTTPException
from database import get_database, doc_to_dict, docs_to_list
from dependencies import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/timeline", tags=["timeline"])


@router.get("/order/{order_id}")
async def get_order_timeline(order_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    cursor = db.product_timeline.find({"orderId": order_id}).sort("timestamp", 1)
    events = await cursor.to_list(length=100)
    return docs_to_list(events)
