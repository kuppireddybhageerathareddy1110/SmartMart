"""
Seed SmartMart MongoDB with 30+ products, users for all roles, orders, deliveries, and warehouses.
Called automatically on backend startup if data is missing.
"""
from database import get_database
from auth import get_password_hash
from datetime import datetime, timedelta
import random
from bson import ObjectId

import json
import os

# Load seed data from JSON cache
CACHE_FILE = os.path.join(os.path.dirname(__file__), "seed_cache.json")

try:
    with open(CACHE_FILE, "r", encoding="utf-8") as f:
        _cache = json.load(f)
        PRODUCTS = _cache.get("products", [])
        USERS = _cache.get("users", [])
except FileNotFoundError:
    print(f"⚠️ Warning: {CACHE_FILE} not found. Database will not be seeded with initial products.")
    PRODUCTS = []
    USERS = []


async def seed_data():
    db = get_database()

    print("\n" + "=" * 70)
    print("  SEEDING SMARTMART MONGODB")
    print("=" * 70)

    # Wipe collections so the expanded list takes effect
    await db.products.delete_many({})
    await db.orders.delete_many({})
    await db.deliveries.delete_many({})
    await db.product_timeline.delete_many({})

    # ── Users ──────────────────────────────────────────────────────────────
    print("\n1. Seeding Users...")
    user_ids = {}
    for u in USERS:
        existing = await db.users.find_one({"email": u["email"]})
        if not existing:
            hashed = get_password_hash(u["password"])
            doc = {"name": u["name"], "email": u["email"], "password": hashed, "role": u["role"]}
            result = await db.users.insert_one(doc)
            user_ids[u["role"]] = result.inserted_id
            print(f"   ✅ Created: {u['email']} ({u['role']})")
        else:
            user_ids[u["role"]] = existing["_id"]
            print(f"   ✅ Exists : {u['email']} ({u['role']})")

    # ── Products ───────────────────────────────────────────────────────────
    print("\n2. Seeding Products...")
    await db.products.insert_many(PRODUCTS)
    print(f"   ✅ Inserted {len(PRODUCTS)} products")

    all_products = await db.products.find({}).to_list(length=500)

    # ── Orders ─────────────────────────────────────────────────────────────
    print("\n3. Seeding Orders...")
    user_oid = user_ids.get("USER")
    order_ids = []
    
    # We wiped orders, so just create them unconditionally
    for i in range(3):
        p = all_products[i % len(all_products)]
        order = {
            "userId": str(user_oid),
            "status": "DELIVERED",
            "totalAmount": p["price"],
            "orderDate": datetime.utcnow() - timedelta(days=random.randint(5, 30)),
            "items": [{"id": str(ObjectId()), "productId": str(p["_id"]), "quantity": 1, "price": p["price"]}]
        }
        result = await db.orders.insert_one(order)
        order_ids.append(result.inserted_id)
        await db.product_timeline.insert_one({
            "orderId": str(result.inserted_id),
            "status": "DELIVERED",
            "timestamp": datetime.utcnow(),
            "description": "Order delivered successfully",
            "location": "Customer Home"
        })

    # Pending orders for shopkeeper
    for i in range(2):
        p = all_products[random.randint(0, min(5, len(all_products)-1))]
        result = await db.orders.insert_one({
            "userId": str(user_oid),
            "status": "PENDING",
            "totalAmount": p["price"],
            "orderDate": datetime.utcnow(),
            "items": [{"id": str(ObjectId()), "productId": str(p["_id"]), "quantity": 1, "price": p["price"]}]
        })
        order_ids.append(result.inserted_id)
    print(f"   ✅ Created 5 orders")

    # ── Deliveries ─────────────────────────────────────────────────────────
    print("\n4. Seeding Deliveries...")
    agent_oid = user_ids.get("DELIVERY_AGENT")
    pending = await db.orders.find({"status": "PENDING"}).to_list(length=10)
    for order in pending:
        await db.deliveries.insert_one({
            "orderId": str(order["_id"]),
            "agentId": str(agent_oid),
            "status": "ASSIGNED",
            "currentLocation": "Sorting Facility",
            "createdAt": datetime.utcnow()
        })
    print(f"   ✅ Created {len(pending)} deliveries")

    # ── Warehouses ─────────────────────────────────────────────────────────
    print("\n5. Seeding Warehouses...")
    if await db.warehouses.count_documents({}) == 0:
        owner_oid = user_ids.get("WAREHOUSE_OWNER")
        await db.warehouses.insert_one({
            "name": "Central Logistics Hub",
            "location": "Mumbai SEZ",
            "capacity": 10000,
            "currentStock": 5400,
            "managerId": str(owner_oid)
        })
        print("   ✅ Created warehouse: Central Logistics Hub")
    else:
        print("   ✅ Warehouses already exist")

    print("\n" + "=" * 70)
    print("  ✅ SEEDING COMPLETE!")
    print("=" * 70 + "\n")

