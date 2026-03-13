import { useEffect, useState } from "react"
import api from "../../core/services/api"

/* ================= COMPONENT ================= */

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders")   // ✅ JWT-based
        setOrders(res.data || [])
      } catch (err) {
        setError("Failed to load orders. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return <p style={info}>Loading your orders...</p>
  }

  if (error) {
    return <p style={errorText}>{error}</p>
  }

  if (orders.length === 0) {
    return <p style={info}>You haven’t placed any orders yet.</p>
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: 20 }}>My Orders</h2>

      {orders.map(order => (
        <div key={order.id} style={card}>
          <div>
            <strong>Order #{order.id}</strong>
            <p style={{ color: "#555", marginTop: 4 }}>
              Status: {order.status || "Processing"}
            </p>
          </div>

          <h3 style={{ color: "#2E7D32" }}>
            ₹{order.totalAmount}
          </h3>
        </div>
      ))}
    </div>
  )
}

/* ================= STYLES ================= */

const card = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#fff",
  padding: 16,
  borderRadius: 10,
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  marginBottom: 14,
}

const info = {
  padding: 40,
  textAlign: "center",
  color: "#555",
  fontSize: 16,
}

const errorText = {
  padding: 40,
  textAlign: "center",
  color: "#d32f2f",
  fontSize: 16,
}
