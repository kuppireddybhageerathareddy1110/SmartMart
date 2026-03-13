from fastapi import APIRouter, Depends
from database import get_database, doc_to_dict, docs_to_list
from dependencies import require_admin
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/api/sap", tags=["sap"])


@router.post("/sync")
async def sync_to_sap(body: dict, admin: dict = Depends(require_admin)):
    db = get_database()
    doc = {
        "entityType": body.get("entityType"),
        "entityId": body.get("entityId"),
        "syncStatus": "SUCCESS",
        "syncTime": datetime.utcnow(),
        "sapResponse": '{"status": "synced"}'
    }
    result = await db.sap_sync.insert_one(doc)
    created = await db.sap_sync.find_one({"_id": result.inserted_id})
    return doc_to_dict(created)


@router.get("/sync/history")
async def get_sync_history(admin: dict = Depends(require_admin)):
    db = get_database()
    cursor = db.sap_sync.find({}).sort("syncTime", -1)
    history = await cursor.to_list(length=100)
    return docs_to_list(history)
