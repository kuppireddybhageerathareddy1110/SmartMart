from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_db, close_db
from routers import auth, products, orders, cart, health, admin, shopkeeper, delivery, warehouse, timeline, sap
from seed_data import seed_data

# Initialize FastAPI app
app = FastAPI(
    title="SmartMart API",
    description="E-commerce backend built with FastAPI + MongoDB",
    version="3.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5183",
        "http://localhost:5184",
        "http://localhost:5185"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(cart.router)
app.include_router(health.router)
app.include_router(admin.router)
app.include_router(shopkeeper.router)
app.include_router(delivery.router)
app.include_router(warehouse.router)
app.include_router(timeline.router)
app.include_router(sap.router)


@app.on_event("startup")
async def on_startup():
    await connect_db()
    await seed_data()
    print("🚀 SmartMart FastAPI server is running on http://localhost:8000")
    print("📚 API docs available at http://localhost:8000/docs")


@app.on_event("shutdown")
async def on_shutdown():
    await close_db()


@app.get("/")
def root():
    return {
        "message": "Welcome to SmartMart API",
        "docs": "/docs",
        "version": "3.0.0",
        "database": "MongoDB"
    }
