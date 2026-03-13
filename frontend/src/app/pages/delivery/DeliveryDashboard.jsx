import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { deliveryApi } from "../../core/services/api"
import { TruckIcon, MapPinIcon } from "@heroicons/react/24/outline"

export default function DeliveryDashboard() {
    const [deliveries, setDeliveries] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDeliveries()
    }, [])

    const loadDeliveries = async () => {
        try {
            const { data } = await deliveryApi.getAssignedDeliveries()
            setDeliveries(data)
            setLoading(false)
        } catch (error) {
            console.error("Failed to load deliveries:", error)
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (deliveryId, status, location) => {
        try {
            await deliveryApi.updateDeliveryStatus(deliveryId, status, location)
            loadDeliveries()
            alert(`Delivery ${status}!`)
        } catch (error) {
            alert("Failed to update delivery")
        }
    }

    if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Loading...</div>

    return (
        <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "40px" }}>
                <TruckIcon width={50} style={{ display: "inline", verticalAlign: "middle", marginRight: "15px" }} />
                My Deliveries
            </h1>

            <div style={{ display: "grid", gap: "20px" }}>
                {deliveries.map(delivery => (
                    <motion.div
                        key={delivery.id}
                        className="glass-card"
                        style={{ padding: "25px" }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                            <div>
                                <h3 style={{ fontSize: "1.3rem" }}>Delivery #{delivery.id}</h3>
                                <p style={{ color: "var(--text-muted)" }}>Order #{delivery.orderId}</p>
                            </div>
                            <div style={{
                                padding: "8px 16px",
                                borderRadius: "20px",
                                background: delivery.status === "DELIVERED" ? "#00b894" : "#fdcb6e",
                                fontSize: "0.9rem",
                                fontWeight: "bold"
                            }}>
                                {delivery.status.replace(/_/g, " ")}
                            </div>
                        </div>

                        {delivery.currentLocation && (
                            <p style={{ marginBottom: "15px", color: "var(--text-muted)" }}>
                                <MapPinIcon width={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "5px" }} />
                                {delivery.currentLocation}
                            </p>
                        )}

                        <div style={{ display: "flex", gap: "10px" }}>
                            {delivery.status === "ASSIGNED" && (
                                <button
                                    onClick={() => handleStatusUpdate(delivery.id, "PICKED_UP", "Warehouse")}
                                    className="btn-primary"
                                >
                                    Mark Picked Up
                                </button>
                            )}
                            {delivery.status === "PICKED_UP" && (
                                <button
                                    onClick={() => handleStatusUpdate(delivery.id, "IN_TRANSIT", "On the way")}
                                    className="btn-primary"
                                    style={{ background: "#0984e3" }}
                                >
                                    Mark In Transit
                                </button>
                            )}
                            {delivery.status === "IN_TRANSIT" && (
                                <button
                                    onClick={() => handleStatusUpdate(delivery.id, "DELIVERED", "Customer location")}
                                    className="btn-primary"
                                    style={{ background: "#00b894" }}
                                >
                                    Mark Delivered
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
