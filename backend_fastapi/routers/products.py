from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from database import get_database, doc_to_dict, docs_to_list
from schemas import ProductResponse, ProductCreate, ProductUpdate
from dependencies import require_admin, require_role, get_current_user
from bson import ObjectId

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=List[ProductResponse])
async def get_all_products():
    db = get_database()
    cursor = db.products.find({})
    products = await cursor.to_list(length=1000)
    return docs_to_list(products)


@router.get("/{id}", response_model=ProductResponse)
async def get_product_by_id(id: str):
    db = get_database()
    try:
        product = await db.products.find_one({"_id": ObjectId(id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid product ID")
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return doc_to_dict(product)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(product: ProductCreate, admin: dict = Depends(require_admin)):
    db = get_database()
    doc = product.model_dump()
    result = await db.products.insert_one(doc)
    created = await db.products.find_one({"_id": result.inserted_id})
    return doc_to_dict(created)


@router.put("/{id}", response_model=ProductResponse)
async def update_product(id: str, product: ProductUpdate, user: dict = Depends(get_current_user)):
    db = get_database()
    try:
        oid = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid product ID")

    result = await db.products.update_one({"_id": oid}, {"$set": product.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")

    updated = await db.products.find_one({"_id": oid})
    return doc_to_dict(updated)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(id: str, admin: dict = Depends(require_admin)):
    db = get_database()
    try:
        oid = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid product ID")

    result = await db.products.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
