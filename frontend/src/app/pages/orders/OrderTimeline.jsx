import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { timelineApi } from "../../core/services/api"
import Timeline from "../../shared/components/Timeline"
import { ArrowLeftIcon, CalendarIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"

export default function OrderTimeline() {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const [timeline, setTimeline] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadTimeline()
    }, [orderId])

    const loadTimeline = async () => {
        try {
            const { data } = await timelineApi.getOrderTimeline(orderId)
            setTimeline(data)
            setLoading(false)
        } catch (error) {
            console.error("Failed to load timeline:", error)
            setLoading(false)
        }
    }

    if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Loading your order updates...</div>

    return (
        <div style={{ padding: "60px 20px", maxWidth: "1000px", margin: "0 auto" }}>
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => navigate(-1)}
                style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "none",
                    color: "var(--text-main)",
                    padding: "10px 20px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    marginBottom: "30px",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}
            >
                <ArrowLeftIcon width={18} />
                Back to Orders
            </motion.button>

            <div style={{ marginBottom: "50px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
                    <div>
                        <h1 style={{ fontSize: "3.5rem", marginBottom: "10px", fontWeight: 800 }}>Track Order</h1>
                        <p style={{ color: "var(--primary)", fontSize: "1.2rem", fontWeight: 500 }}>Ref ID: #SM-{orderId.padStart(6, '0')}</p>
                    </div>
                    <div style={{ display: "flex", gap: "30px" }}>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "4px" }}>
                                <CalendarIcon width={14} style={{ display: "inline", marginRight: "4px" }} />
                                Order Date
                            </div>
                            <div style={{ fontWeight: 600 }}>{timeline.length > 0 ? new Date(timeline[timeline.length - 1].timestamp).toLocaleDateString() : 'N/A'}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "4px" }}>
                                <ShoppingCartIcon width={14} style={{ display: "inline", marginRight: "4px" }} />
                                Items
                            </div>
                            <div style={{ fontWeight: 600 }}>Standard Delivery</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: "50px", borderRadius: "24px" }}>
                {timeline.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>We're preparing your order details. Check back soon!</p>
                    </div>
                ) : (
                    <Timeline events={timeline} />
                )}
            </div>
        </div>
    )
}
