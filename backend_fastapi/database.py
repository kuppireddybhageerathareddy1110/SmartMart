"""
MongoDB database layer using Motor (async).
Replaces SQLAlchemy/SQLite with MongoDB.
"""
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = "smartmart"

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    """Connect to MongoDB"""
    global client, db
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    # Create indexes for performance
    await db.users.create_index([("email", ASCENDING)], unique=True)
    await db.products.create_index([("category", ASCENDING)])
    await db.orders.create_index([("userId", ASCENDING)])
    await db.cart_items.create_index([("userId", ASCENDING)])
    await db.warehouses.create_index([("managerId", ASCENDING)])
    print(f"✅ MongoDB connected: {MONGO_URL}/{DB_NAME}")


async def close_db():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("MongoDB connection closed")


def get_database():
    """Return the database object"""
    return db


def doc_to_dict(doc: dict) -> dict:
    """Convert MongoDB document to JSON-serializable dict"""
    if doc is None:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc


def docs_to_list(docs) -> list:
    """Convert list of MongoDB documents"""
    return [doc_to_dict(doc) for doc in docs]
