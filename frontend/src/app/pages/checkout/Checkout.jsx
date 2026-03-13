import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../core/services/api"
import { useCart } from "../../core/services/cart.context"
import { useTheme } from "../../core/services/theme.context"
import { motion } from "framer-motion"
import {
  TruckIcon,
  CreditCardIcon,
  MapPinIcon,
  CheckCircleIcon,
  ShoppingBagIcon
} from "@heroicons/react/24/outline"

/* ================= STYLES ================= */

const container = {
  maxWidth: "1200px",
  margin: "40px auto",
  padding: "20px",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
}

const header = {
  textAlign: "center",
  marginBottom: "40px"
}

const title = {
  fontSize: "2.5rem",
  fontWeight: "800",
  backgroundImage: "linear-gradient(45deg, #667eea, #764ba2)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  margin: "0 0 10px 0"
}

const checkoutGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 400px",
  gap: "40px",
  alignItems: "start"
}

const formSection = {
  background: "#fff",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  padding: "32px"
}

const sectionTitle = {
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#1a1a1a",
  margin: "0 0 24px 0",
  display: "flex",
  alignItems: "center",
  gap: "12px"
}

const formGroup = {
  marginBottom: "20px"
}

const label = {
  display: "block",
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#1a1a1a",
  marginBottom: "6px"
}

const input = {
  width: "100%",
  padding: "12px 16px",
  border: "2px solid #e1e5e9",
  borderRadius: "8px",
  fontSize: "16px",
  outline: "none",
  transition: "border-color 0.3s ease",
  background: "#fff"
}

const inputGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px"
}

const paymentOptions = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  marginTop: "16px"
}

const paymentOption = {
  padding: "16px",
  border: "2px solid #e1e5e9",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background: "#fff"
}

const orderSummary = {
  background: "#fff",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  padding: "32px",
  position: "sticky",
  top: "20px"
}

const summaryItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid #f0f0f0"
}

const summaryTotal = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "20px",
  paddingTop: "20px",
  borderTop: "2px solid #f0f0f0",
  fontSize: "1.25rem",
  fontWeight: "700",
  color: "#1a1a1a"
}

const placeOrderBtn = {
  width: "100%",
  padding: "16px",
  background: "linear-gradient(45deg, #667eea, #764ba2)",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontSize: "1.1rem",
  fontWeight: "600",
  cursor: "pointer",
  marginTop: "24px",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)"
}

const emptyState = {
  textAlign: "center",
  padding: "80px 20px",
  background: "#fff",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  margin: "40px 0"
}

/* ================= COMPONENT ================= */

export default function Checkout() {
  const { cart, total, clear } = useCart()
  const { currentTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "India"
  })
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (cart.length === 0) {
    return (
      <div style={container}>
        <motion.div
          style={emptyState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ShoppingBagIcon style={{ width: 80, height: 80, color: "#ccc", margin: "0 auto 20px" }} />
          <h2 style={{ margin: "0 0 10px 0", color: "#666" }}>Your cart is empty</h2>
          <p style={{ margin: "0 0 20px 0", color: "#999" }}>Add some products before checkout</p>
          <motion.button
            style={{
              padding: "12px 24px",
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer"
            }}
            onClick={() => navigate("/products")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Browse Products
          </motion.button>
        </motion.div>
      </div>
    )
  }

  const placeOrder = async () => {
    // Basic validation
    if (!formData.firstName || !formData.email || !formData.address) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)

      const orderData = {
        totalAmount: total + total * 0.18, // Including tax
        shippingAddress: formData,
        paymentMethod,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.qty,
        })),
      }

      await api.post("/orders", orderData)

      clear()
      navigate("/")
      alert("Order placed successfully! 🎉")
    } catch (error) {
      console.error("Order failed:", error)
      alert("Order failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={container}>
      <motion.div
        style={header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={title}>Checkout</h1>
        <p style={{ color: "#666", margin: "0" }}>Complete your purchase</p>
      </motion.div>

      <motion.div
        style={checkoutGrid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* FORM SECTION */}
        <div>
          {/* SHIPPING INFORMATION */}
          <motion.div
            style={formSection}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 style={sectionTitle}>
              <MapPinIcon style={{ width: 24, height: 24, color: "#667eea" }} />
              Shipping Information
            </h3>

            <div style={inputGrid}>
              <div style={formGroup}>
                <label style={label}>First Name *</label>
                <input
                  style={input}
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={formGroup}>
                <label style={label}>Last Name</label>
                <input
                  style={input}
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div style={inputGrid}>
              <div style={formGroup}>
                <label style={label}>Email *</label>
                <input
                  style={input}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={formGroup}>
                <label style={label}>Phone</label>
                <input
                  style={input}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div style={formGroup}>
              <label style={label}>Address *</label>
              <input
                style={input}
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address"
                required
              />
            </div>

            <div style={inputGrid}>
              <div style={formGroup}>
                <label style={label}>City</label>
                <input
                  style={input}
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div style={formGroup}>
                <label style={label}>ZIP Code</label>
                <input
                  style={input}
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </motion.div>

          {/* PAYMENT METHOD */}
          <motion.div
            style={formSection}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 style={sectionTitle}>
              <CreditCardIcon style={{ width: 24, height: 24, color: "#667eea" }} />
              Payment Method
            </h3>

            <div style={paymentOptions}>
              <motion.div
                style={{
                  ...paymentOption,
                  borderColor: paymentMethod === "card" ? "#667eea" : "#e1e5e9",
                  background: paymentMethod === "card" ? "#f8f9ff" : "#fff"
                }}
                onClick={() => setPaymentMethod("card")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CreditCardIcon style={{ width: 20, height: 20 }} />
                <span>Credit/Debit Card</span>
              </motion.div>

              <motion.div
                style={{
                  ...paymentOption,
                  borderColor: paymentMethod === "cod" ? "#667eea" : "#e1e5e9",
                  background: paymentMethod === "cod" ? "#f8f9ff" : "#fff"
                }}
                onClick={() => setPaymentMethod("cod")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TruckIcon style={{ width: 20, height: 20 }} />
                <span>Cash on Delivery</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ORDER SUMMARY */}
        <motion.div
          style={orderSummary}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 style={sectionTitle}>
            <CheckCircleIcon style={{ width: 24, height: 24, color: "#667eea" }} />
            Order Summary
          </h3>

          {cart.map(item => (
            <div key={item.id} style={summaryItem}>
              <span>{item.name} × {item.qty}</span>
              <span>₹{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}

          <div style={summaryItem}>
            <span>Subtotal</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          <div style={summaryItem}>
            <span>Shipping</span>
            <span style={{ color: "#4CAF50" }}>Free</span>
          </div>

          <div style={summaryItem}>
            <span>Tax (18%)</span>
            <span>₹{(total * 0.18).toFixed(0).toLocaleString()}</span>
          </div>

          <div style={summaryTotal}>
            <span>Total</span>
            <span>₹{(total + total * 0.18).toFixed(0).toLocaleString()}</span>
          </div>

          <motion.button
            style={placeOrderBtn}
            onClick={placeOrder}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
