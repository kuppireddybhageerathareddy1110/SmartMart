from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional, Any
from datetime import datetime


# ── Helpers ──────────────────────────────────────────────────────────────────

class PyObjectIdStr(str):
    """Accept MongoDB ObjectId strings as str fields."""
    pass


# ── User ─────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "USER"  # allow admin to set role on create


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str


# ── Auth ─────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    token: str


# ── Product ───────────────────────────────────────────────────────────────────

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    imageUrl: Optional[str] = None
    category: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: str


# ── Order ─────────────────────────────────────────────────────────────────────

class OrderItemBase(BaseModel):
    productId: str
    quantity: int
    price: float


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemResponse(OrderItemBase):
    id: str


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]


class OrderResponse(BaseModel):
    id: str
    userId: str
    status: str
    totalAmount: float
    orderDate: datetime
    items: List[OrderItemResponse] = []


# ── Cart ──────────────────────────────────────────────────────────────────────

class CartItemCreate(BaseModel):
    productId: str
    quantity: int = 1


class CartItemResponse(BaseModel):
    id: str
    productId: str
    quantity: int
    product: Optional[ProductResponse] = None
