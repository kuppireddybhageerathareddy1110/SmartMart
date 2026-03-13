import { useCart } from "../../core/services/cart.context"
import { useTheme } from "../../core/services/theme.context"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingBagIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ArrowRightIcon
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

const emptyState = {
  textAlign: "center",
  padding: "80px 20px",
  background: "#fff",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  margin: "40px 0"
}

const emptyIcon = {
  width: "80px",
  height: "80px",
  color: "#ccc",
  margin: "0 auto 20px"
}

const cartGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 350px",
  gap: "40px",
  alignItems: "start"
}

const cartItems = {
  background: "#fff",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  overflow: "hidden"
}

const itemRow = {
  display: "flex",
  alignItems: "center",
  padding: "24px",
  borderBottom: "1px solid #f0f0f0",
  transition: "all 0.3s ease"
}

const itemImage = {
  width: "80px",
  height: "80px",
  borderRadius: "12px",
  objectFit: "cover",
  marginRight: "20px"
}

const itemDetails = {
  flex: 1
}

const itemName = {
  fontSize: "1.1rem",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0 0 4px 0"
}

const itemPrice = {
  fontSize: "0.9rem",
  color: "#666",
  margin: "0"
}

const qtyControls = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginRight: "20px"
}

const qtyBtn = {
  width: "36px",
  height: "36px",
  border: "none",
  borderRadius: "8px",
  background: "#f5f5f5",
  color: "#333",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  fontWeight: "600",
  transition: "all 0.2s ease"
}

const qtyDisplay = {
  minWidth: "40px",
  textAlign: "center",
  fontWeight: "600",
  fontSize: "1.1rem"
}

const itemTotal = {
  fontSize: "1.1rem",
  fontWeight: "700",
  color: "#667eea",
  minWidth: "80px",
  textAlign: "right"
}

const removeBtn = {
  width: "36px",
  height: "36px",
  border: "none",
  borderRadius: "8px",
  background: "#fee",
  color: "#d32f2f",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease"
}

const summary = {
  background: "#fff",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  padding: "32px",
  position: "sticky",
  top: "20px"
}

const summaryTitle = {
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#1a1a1a",
  margin: "0 0 24px 0"
}

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
  fontSize: "1rem"
}

const summaryTotal = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "24px",
  paddingTop: "24px",
  borderTop: "2px solid #f0f0f0",
  fontSize: "1.25rem",
  fontWeight: "700",
  color: "#1a1a1a"
}

const checkoutBtn = {
  width: "100%",
  padding: "16px",
  background: "linear-gradient(45deg, #667eea, #764ba2)",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontSize: "1.1rem",
  fontWeight: "600",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  marginTop: "24px",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)"
}

/* ================= COMPONENT ================= */

export default function Cart() {
  const { cart, add, decrease, remove, total } = useCart()
  const { currentTheme } = useTheme()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div style={container}>
        <motion.div
          style={emptyState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ShoppingBagIcon style={emptyIcon} />
          <h2 style={{ margin: "0 0 10px 0", color: "#666" }}>Your cart is empty</h2>
          <p style={{ margin: "0 0 20px 0", color: "#999" }}>Add some amazing products to get started!</p>
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
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={container}>
      <motion.div
        style={header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={title}>Your Shopping Cart</h1>
        <p style={{ color: "#666", margin: "0" }}>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
      </motion.div>

      <motion.div
        style={cartGrid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* CART ITEMS */}
        <div style={cartItems}>
          <AnimatePresence>
            {cart.map((item, index) => (
              <motion.div
                key={item.id}
                style={itemRow}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ backgroundColor: "#f9f9f9" }}
              >
                <img
                  src={item.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80"}
                  alt={item.name}
                  style={itemImage}
                />

                <div style={itemDetails}>
                  <h4 style={itemName}>{item.name}</h4>
                  <p style={itemPrice}>₹{item.price.toLocaleString()}</p>
                </div>

                <div style={qtyControls}>
                  <motion.button
                    style={qtyBtn}
                    onClick={() => decrease(item.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <MinusIcon style={{ width: 16, height: 16 }} />
                  </motion.button>

                  <span style={qtyDisplay}>{item.qty}</span>

                  <motion.button
                    style={qtyBtn}
                    onClick={() => add(item)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <PlusIcon style={{ width: 16, height: 16 }} />
                  </motion.button>
                </div>

                <div style={itemTotal}>
                  ₹{(item.price * item.qty).toLocaleString()}
                </div>

                <motion.button
                  style={removeBtn}
                  onClick={() => remove(item.id)}
                  whileHover={{ scale: 1.1, backgroundColor: "#fdd" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <TrashIcon style={{ width: 16, height: 16 }} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ORDER SUMMARY */}
        <motion.div
          style={summary}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 style={summaryTitle}>Order Summary</h3>

          <div style={summaryRow}>
            <span>Subtotal ({cart.length} items)</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          <div style={summaryRow}>
            <span>Shipping</span>
            <span style={{ color: "#4CAF50" }}>Free</span>
          </div>

          <div style={summaryRow}>
            <span>Tax</span>
            <span>₹{(total * 0.18).toFixed(0).toLocaleString()}</span>
          </div>

          <div style={summaryTotal}>
            <span>Total</span>
            <span>₹{(total + total * 0.18).toFixed(0).toLocaleString()}</span>
          </div>

          <motion.button
            style={checkoutBtn}
            onClick={() => navigate("/checkout")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Proceed to Checkout
            <ArrowRightIcon style={{ width: 20, height: 20 }} />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
