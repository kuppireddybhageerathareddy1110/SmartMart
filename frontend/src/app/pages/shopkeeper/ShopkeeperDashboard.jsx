import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { shopkeeperApi } from "../../core/services/api"
import { ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline"

export default function ShopkeeperDashboard() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = async () => {
        try {
            const { data } = await shopkeeperApi.getPendingOrders()
            setOrders(data)
            setLoading(false)
        } catch (error) {
            console.error("Failed to load orders:", error)
            setLoading(false)
        }
    }

    const handleFulfill = async (orderId, status) => {
        try {
            await shopkeeperApi.fulfillOrder(orderId, status)
            loadOrders()
            alert(`Order ${status}!`)
        } catch (error) {
            alert("Failed to update order")
        }
    }

    if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Loading...</div>

    return (
        <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "40px" }}>Shopkeeper Dashboard</h1>

            <div style={{ display: "grid", gap: "20px" }}>
                {orders.length === 0 ? (
                    <div className="glass-card" style={{ padding: "60px", textAlign: "center" }}>
                        <CheckCircleIcon width={60} style={{ margin: "0 auto 20px", color: "var(--primary)" }} />
                        <h3 style={{ fontSize: "1.5rem" }}>All caught up!</h3>
                        <p style={{ color: "var(--text-muted)" }}>No pending orders to process</p>
                    </div>
                ) : (
                    orders.map(order => (
                        <motion.div
                            key={order.id}
                            className="glass-card"
                            style={{ padding: "25px" }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                                <div>
                                    <h3 style={{ fontSize: "1.3rem", marginBottom: "5px" }}>Order #{order.id}</h3>
                                    <p style={{ color: "var(--text-muted)" }}>
                                        <ClockIcon width={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "5px" }} />
                                        {new Date(order.orderDate).toLocaleString()}
                                    </p>
                                </div>
                                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary)" }}>
                                    ₹{order.totalAmount.toLocaleString()}
                                </div>
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <strong>Status:</strong> <span style={{ color: "#fdcb6e" }}>{order.status}</span>
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    onClick={() => handleFulfill(order.id, "PROCESSING")}
                                    className="btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    Mark Processing
                                </button>
                                <button
                                    onClick={() => handleFulfill(order.id, "PACKED")}
                                    className="btn-primary"
                                    style={{ flex: 1, background: "#00b894" }}
                                >
                                    Mark Packed
                                </button>
                                <button
                                    onClick={() => handleFulfill(order.id, "SHIPPED")}
                                    className="btn-primary"
                                    style={{ flex: 1, background: "#0984e3" }}
                                >
                                    Mark Shipped
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}
