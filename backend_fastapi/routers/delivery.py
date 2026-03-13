from fastapi import APIRouter, Depends, HTTPException
from database import get_database, doc_to_dict, docs_to_list
from dependencies import require_delivery_agent
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/delivery", tags=["delivery"])


@router.get("/assigned")
async def get_assigned_deliveries(agent: dict = Depends(require_delivery_agent)):
    db = get_database()
    cursor = db.deliveries.find({"agentId": agent["id"]})
    deliveries = await cursor.to_list(length=200)
    return docs_to_list(deliveries)


@router.put("/{delivery_id}/status")
async def update_delivery_status(delivery_id: str, body: dict, agent: dict = Depends(require_delivery_agent)):
    db = get_database()
    try:
        oid = ObjectId(delivery_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid delivery ID")

    update = {"status": body.get("status", "IN_TRANSIT"), "updatedAt": datetime.utcnow()}
    if "currentLocation" in body:
        update["currentLocation"] = body["currentLocation"]

    result = await db.deliveries.update_one({"_id": oid}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Delivery not found")
    return {"message": f"Delivery status updated to {update['status']}"}
