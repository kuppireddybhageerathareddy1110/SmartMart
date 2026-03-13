import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./app/shared/navbar/Navbar"
import Footer from "./app/shared/footer/Footer"

import Home from "./app/pages/home/Home"
import Products from "./app/pages/products/Products"
import Cart from "./app/pages/cart/Cart"
import Login from "./app/pages/login/Login"
import Checkout from "./app/pages/checkout/Checkout"
import Orders from "./app/pages/orders/Orders"
import Wishlist from "./app/pages/wishlist/Wishlist"
import Admin from "./app/pages/admin/Admin"

// Enterprise Portals
import AdminDashboard from "./app/pages/admin/AdminDashboard"
import ShopkeeperDashboard from "./app/pages/shopkeeper/ShopkeeperDashboard"
import DeliveryDashboard from "./app/pages/delivery/DeliveryDashboard"
import WarehouseDashboard from "./app/pages/warehouse/WarehouseDashboard"
import OrderTimeline from "./app/pages/orders/OrderTimeline"

import { ThemeProvider } from "./app/core/services/theme.context"
import { CartProvider } from "./app/core/services/cart.context"
import CustomCursor from "./app/shared/components/CustomCursor"

/* ================= AUTH GUARD ================= */

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/login" replace />
}

/* ================= APP ================= */

import { ErrorBoundary } from "./app/shared/components/ErrorBoundary"

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <CustomCursor />
        <CartProvider>
          <BrowserRouter>
            <Navbar />

            <main style={{ minHeight: "calc(100vh - 140px)", paddingBottom: "40px" }}>
              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/login" element={<Login />} />

                {/* CART & WISHLIST */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />

                {/* PROTECTED ROUTES */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                {/* ADMIN (OPTIONAL) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />

                {/* ENTERPRISE PORTALS */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/shopkeeper"
                  element={
                    <ProtectedRoute>
                      <ShopkeeperDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/delivery"
                  element={
                    <ProtectedRoute>
                      <DeliveryDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/warehouse"
                  element={
                    <ProtectedRoute>
                      <WarehouseDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders/:orderId/timeline"
                  element={
                    <ProtectedRoute>
                      <OrderTimeline />
                    </ProtectedRoute>
                  }
                />

                {/* FALLBACK */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
          </BrowserRouter>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

/* ================= 404 PAGE ================= */

function NotFound() {
  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "var(--text-muted)"
    }}>
      <h2>404</h2>
      <p>Page not found</p>
    </div>
  )
}
