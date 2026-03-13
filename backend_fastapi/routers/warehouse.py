from fastapi import APIRouter, Depends, HTTPException
from typing import List
from database import get_database, doc_to_dict, docs_to_list
from dependencies import require_warehouse_owner
from pydantic import BaseModel
from bson import ObjectId

router = APIRouter(prefix="/api/warehouse", tags=["warehouse"])


class WarehouseCreate(BaseModel):
    name: str
    location: str
    capacity: int


class StockUpdate(BaseModel):
    productId: str
    quantity: int


@router.get("")
async def get_warehouses(owner: dict = Depends(require_warehouse_owner)):
    db = get_database()
    cursor = db.warehouses.find({"managerId": owner["id"]})
    warehouses = await cursor.to_list(length=100)
    return docs_to_list(warehouses)


@router.post("", status_code=201)
async def create_warehouse(warehouse: WarehouseCreate, owner: dict = Depends(require_warehouse_owner)):
    db = get_database()
    doc = {
        "name": warehouse.name,
        "location": warehouse.location,
        "capacity": warehouse.capacity,
        "currentStock": 0,
        "managerId": owner["id"]
    }
    result = await db.warehouses.insert_one(doc)
    created = await db.warehouses.find_one({"_id": result.inserted_id})
    return doc_to_dict(created)


@router.put("/{warehouse_id}/stock")
async def update_stock(warehouse_id: str, stock: StockUpdate, owner: dict = Depends(require_warehouse_owner)):
    db = get_database()
    try:
        oid = ObjectId(warehouse_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid warehouse ID")

    result = await db.warehouses.update_one(
        {"_id": oid, "managerId": owner["id"]},
        {"$inc": {"currentStock": stock.quantity}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    updated = await db.warehouses.find_one({"_id": oid})
    return {"message": f"Stock updated. Current stock: {updated['currentStock']}"}
