import { motion } from "framer-motion"
import {
    CheckCircleIcon,
    TruckIcon,
    ShoppingBagIcon,
    HomeIcon,
    ClockIcon,
    MapPinIcon
} from "@heroicons/react/24/solid"

const STAGES = [
    { key: "ORDERED", label: "Ordered", icon: ShoppingBagIcon },
    { key: "PROCESSING", label: "Processing", icon: ClockIcon },
    { key: "SHIPPED", label: "Shipped", icon: TruckIcon },
    { key: "DELIVERED", label: "Delivered", icon: HomeIcon },
]

export default function Timeline({ events }) {
    // Get latest status to determine progress
    const latestStatus = events.length > 0 ? events[0].status : "ORDERED"

    // Determine the current index for horizontal progress
    const currentStageIndex = STAGES.findIndex(s =>
        latestStatus.includes(s.key) || (latestStatus === "PENDING" && s.key === "ORDERED")
    )

    const getStatusIcon = (status) => {
        if (status.includes("ORDERED") || status === "PENDING") return <ShoppingBagIcon width={18} />
        if (status.includes("PROCESSING") || status.includes("PACKED")) return <ClockIcon width={18} />
        if (status.includes("SHIPPED") || status.includes("IN_TRANSIT")) return <TruckIcon width={18} />
        if (status.includes("DELIVERED")) return <HomeIcon width={18} />
        return <CheckCircleIcon width={18} />
    }

    return (
        <div>
            {/* Horizontal Milestone Tracker */}
            <div style={{ marginBottom: "60px", padding: "0 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                    {/* Progress Background Line */}
                    <div style={{
                        position: "absolute",
                        top: "20px",
                        left: "5%",
                        right: "5%",
                        height: "4px",
                        background: "rgba(255,255,255,0.1)",
                        zIndex: 0
                    }} />

                    {/* Active Progress Line */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 90}%` }}
                        style={{
                            position: "absolute",
                            top: "20px",
                            left: "5%",
                            height: "4px",
                            background: "var(--primary)",
                            boxShadow: "0 0 10px var(--primary)",
                            zIndex: 1
                        }}
                    />

                    {STAGES.map((stage, index) => {
                        const isCompleted = index <= currentStageIndex
                        const isCurrent = index === currentStageIndex
                        const Icon = stage.icon

                        return (
                            <div key={stage.key} style={{ zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", width: "80px" }}>
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{
                                        scale: isCurrent ? 1.2 : 1,
                                        background: isCompleted ? "var(--primary)" : "#2d3436"
                                    }}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: isCompleted ? "#fff" : "rgba(255,255,255,0.3)",
                                        border: isCurrent ? "3px solid #fff" : "none",
                                        boxShadow: isCurrent ? "0 0 20px var(--primary)" : "none"
                                    }}
                                >
                                    <Icon width={20} />
                                </motion.div>
                                <span style={{
                                    marginTop: "12px",
                                    fontSize: "0.85rem",
                                    fontWeight: isCurrent ? "bold" : "normal",
                                    color: isCompleted ? "var(--text-main)" : "var(--text-muted)",
                                    textAlign: "center"
                                }}>
                                    {stage.label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Vertical Detailed Timeline */}
            <div style={{ position: "relative", paddingLeft: "50px" }}>
                {/* Vertical Line */}
                <div style={{
                    position: "absolute",
                    left: "20px",
                    top: "10px",
                    bottom: "10px",
                    width: "2px",
                    background: "rgba(255,255,255,0.1)"
                }} />

                {events.map((event, index) => (
                    <motion.div
                        key={event.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            position: "relative",
                            marginBottom: "30px"
                        }}
                    >
                        {/* Status Icon Marker */}
                        <div style={{
                            position: "absolute",
                            left: "-45px",
                            top: "0",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background: index === 0 ? "var(--primary)" : "rgba(255,255,255,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            boxShadow: index === 0 ? "0 0 10px var(--primary)" : "none",
                            zIndex: 2
                        }}>
                            {getStatusIcon(event.status)}
                        </div>

                        {/* Content Card */}
                        <div className="glass-card" style={{
                            padding: "20px",
                            borderLeft: index === 0 ? "4px solid var(--primary)" : "none",
                            background: index === 0 ? "rgba(108, 92, 231, 0.1)" : "rgba(255,255,255,0.03)"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: index === 0 ? "var(--primary)" : "var(--text-main)" }}>
                                    {event.status.replace(/_/g, " ")}
                                </h4>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>
                                        {new Date(event.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                    </div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                        {new Date(event.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>

                            {event.description && (
                                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "10px", lineHeight: "1.5" }}>
                                    {event.description}
                                </p>
                            )}

                            {event.location && (
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    color: "var(--primary)",
                                    fontSize: "0.85rem",
                                    fontWeight: 500
                                }}>
                                    <MapPinIcon width={14} />
                                    {event.location}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
