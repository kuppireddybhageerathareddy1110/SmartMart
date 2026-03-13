from fastapi import APIRouter, HTTPException, status
from database import get_database, doc_to_dict
from schemas import LoginRequest, RegisterRequest, LoginResponse, UserCreate
from auth import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: RegisterRequest):
    db = get_database()
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = get_password_hash(user.password)
    doc = {"name": user.name, "email": user.email, "password": hashed, "role": "USER"}
    result = await db.users.insert_one(doc)
    token = create_access_token({"userId": str(result.inserted_id), "email": user.email, "role": "USER"})
    return LoginResponse(token=token)


@router.post("/login")
async def login(credentials: LoginRequest):
    db = get_database()
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({
        "userId": str(user["_id"]),
        "email": user["email"],
        "role": user["role"]
    })
    return LoginResponse(token=token)
