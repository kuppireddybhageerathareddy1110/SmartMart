from fastapi import APIRouter, Depends, HTTPException
from typing import List
from database import get_database, doc_to_dict, docs_to_list
from schemas import CartItemCreate, CartItemResponse
from dependencies import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/api/cart", tags=["cart"])


@router.get("", response_model=List[CartItemResponse])
async def get_cart(current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = current_user["id"]
    cursor = db.cart_items.find({"userId": user_id})
    items = await cursor.to_list(length=200)
    result = []
    for item in items:
        d = doc_to_dict(item)
        # Attach product
        try:
            product = await db.products.find_one({"_id": ObjectId(d["productId"])})
            d["product"] = doc_to_dict(product) if product else None
        except Exception:
            d["product"] = None
        result.append(d)
    return result


@router.post("", status_code=201)
async def add_to_cart(item: CartItemCreate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = current_user["id"]

    existing = await db.cart_items.find_one({"userId": user_id, "productId": item.productId})
    if existing:
        await db.cart_items.update_one(
            {"_id": existing["_id"]},
            {"$inc": {"quantity": item.quantity}}
        )
        updated = await db.cart_items.find_one({"_id": existing["_id"]})
        return doc_to_dict(updated)

    doc = {"userId": user_id, "productId": item.productId, "quantity": item.quantity}
    result = await db.cart_items.insert_one(doc)
    created = await db.cart_items.find_one({"_id": result.inserted_id})
    return doc_to_dict(created)


@router.delete("/{item_id}", status_code=204)
async def remove_from_cart(item_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    try:
        oid = ObjectId(item_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid item ID")

    result = await db.cart_items.delete_one({"_id": oid, "userId": current_user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
