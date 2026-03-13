# SmartMart E-Commerce Platform

SmartMart is a modern, full-stack e-commerce application featuring a clean, responsive UI with a powerful, asynchronous backend. The platform supports multiple user roles (Admin, Shopkeeper, Delivery Agent, Warehouse Manager, Customer), robust product management, order processing, and a dark glassmorphism theme.

## 🚀 Tech Stack

### Frontend
- **React 18** (via Vite)
- **Axios** for API requests
- **HTML5/CSS3** with a custom Dark Glassmorphism design system
- Completely responsive design

### Backend
- **FastAPI** (Python 3.10+)
- **MongoDB** using `motor` for asynchronous database interactions
- **PyJWT** & **Passlib / Bcrypt** for secure JWT authentication
- **Uvicorn** ASGI server

## 📁 Repository Structure

```
smartmart/
├── backend_fastapi/    # Python FastAPI backend source code
├── frontend/           # React + Vite frontend source code
├── .gitignore          # Root ignore
└── README.md           # This file
```

## 🛠️ Quick Start

### 1. Database Setup
You must have MongoDB running locally (or provide an Atlas URI):
```bash
# Default connection string used by the backend:
mongodb://localhost:27017
```

### 2. Backend Setup
Navigate to the `backend_fastapi` directory and set up your virtual environment:
```bash
cd backend_fastapi
python -m venv .venv
.venv\Scripts\activate      # Windows
# source .venv/bin/activate # Mac/Linux

pip install -r requirements.txt
python -m uvicorn main:app --reload
```
*Note: The backend will automatically seed the MongoDB database with over 150 diverse products and test users upon startup via a JSON cache fallback if the database is empty.*

### 3. Frontend Setup
Open a new terminal, navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## 🧑‍💻 Default User Accounts (Demo)

The database is seeded with the following accounts (Password for all is `shop123`, `admin123`, `user123` depending on role, check `Login.jsx` demo panel):
- **Admin**: `admin@smartmart.com` / `admin123`
- **Customer**: `user@smartmart.com` / `user123`
- **Shopkeeper**: `shopkeeper@smartmart.com` / `shop123`
- **Delivery Agent**: `delivery@smartmart.com` / `delivery123`
- **Warehouse Owner**: `warehouse@smartmart.com` / `warehouse123`

You can use the convenient **Demo Credentials Panel** on the left side of the Login page to instantly auto-fill these accounts.

## 🔒 Security
- Passwords are encrypted using high-strength bcrypt.
- Session management is handled securely via short-lived JWTs.
- Protected routes employ FastAPI Dependencies for role-based access control.

## 📝 License
This project is licensed under the MIT License.