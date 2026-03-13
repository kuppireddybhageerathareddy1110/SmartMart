# SmartMart Frontend Application

The SmartMart frontend application is a responsive, highly-interactive SPA (Single Page Application) built utilizing the React ecosystem. It features an incredibly sleek, modern **Dark Glassmorphism** design scheme, custom CSS animations, and instant API integrations.

## 🎨 UI/UX Design System
We enforce a strict design system utilizing `Vanilla CSS` encapsulated in `styles.scss` / `index.css`:
- **Glassmorphism:** Elements mimic frosted glass, sitting on vibrant animated background gradients.
- **Card-Based UI:** Products and admin data are rendered inside softly-shadowed floating cards.
- **Micro-interactions:** Buttons and cards feature hover and active state transformations to improve tactile feedback.
- **Toast Notifications:** Subtle, non-intrusive bottom-right toast messages replace aggressive browser `alert()` popups.

## 🏗️ Technical Stack
- **React 18:** Functional components utilizing Hooks (`useState`, `useEffect`, Context API for Cart Management).
- **Vite:** Next-generation frontend tooling for instantaneous Hot Module Replacement (HMR).
- **Axios:** Interceptor-configured REST API calls to the FastAPI backend.
- **React Router Base:** Client-side routing for an uninterrupted Native-App-like experience.

## 📦 Setting Up
If you have NodeJS (v18+) installed:

```bash
# Navigate to the frontend directory
cd smartmart/frontend

# Install dependencies (Node Modules)
npm install

# Start the development server
npm run dev
```

The application will launch on your local network, default `http://localhost:5173`.

## 📁 Key Directories
- `/src/app/pages`: Top-level navigational views (e.g. Products, Admin Dashboard, Login).
- `/src/app/core/services`: Axiom API interaction layers (`api.js`).
- `/src/app/shared`: Common components like `Navbar.jsx`, `Footer.jsx`, and `Modal.jsx`. 

## 🌐 Fallback Systems
Data resiliency is built-in. If the FastAPI backend is totally unresponsive (Server Error or Offline), the frontend components automatically parse a local static fallback cache. This guarantees the user interface never breaks into a blank white screen. 
