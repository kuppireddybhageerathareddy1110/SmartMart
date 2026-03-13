# SmartMart FastAPI Backend

SmartMart's backend architecture leveraging **FastAPI** for blazing-fast ASGI performance, **MongoDB** (with `motor`) for robust asynchronous data storage, and **PyJWT** for token-based authentication.

## 🌟 Key Features
- **Async Mongo Queries:** Non-blocking database calls using `motor`.
- **Role-Based Routing:** Strict API boundaries managed by FastAPI Dependencies (`ADMIN`, `USER`, `SHOPKEEPER`, `DELIVERY_AGENT`, `WAREHOUSE_OWNER`).
- **Comprehensive API:** 10+ distinct routers for Products, Auth, Users, Cart, Orders, Admin, Warehouse, Delivery, SAP, and Timeline.
- **Auto-Seeding:** Ships with a `seed_cache.json` containing 150+ realistic e-commerce products spanning 6 categories. Database automatically hydrates on an empty run.
- **Strong Encryption:** `passlib[bcrypt]` securely hashes and salts user passwords.

## 🧰 Setup Instructions

### 1. Requirements
Ensure you have Python 3.10+ installed and a MongoDB instance running at `mongodb://localhost:27017` (or configured via `.env`).

### 2. Installation
```bash
# Clone the repository and navigate here
cd smartmart/backend_fastapi

# Create a virtual environment
python -m venv .venv

# Activate the venv
# Windows:
.venv\Scripts\activate
# Mac/Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Execution
Run the server using Uvicorn (make sure the virtual environment is activated):
```bash
python -m uvicorn main:app --reload
```

## 📚 API Documentation
FastAPI automatically generates comprehensive Open API documentation. Once the server is running, visit:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

Explore all live endpoints right from your browser!

## 💾 Environmental Variables
| Variable | Description | Default |
|---|---|---|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017` |
| `SECRET_KEY` | JWT Secret Key | `supersecretkey` |
| `ALGORITHM` | JWT Signature Algorithm | `HS256` |

You can place these in a `.env` file at the root of the `backend_fastapi` directory.
