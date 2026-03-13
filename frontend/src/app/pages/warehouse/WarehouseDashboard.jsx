import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { warehouseApi } from "../../core/services/api"
import { BuildingStorefrontIcon, PlusIcon } from "@heroicons/react/24/outline"

export default function WarehouseDashboard() {
    const [warehouses, setWarehouses] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)

    useEffect(() => {
        loadWarehouses()
    }, [])

    const loadWarehouses = async () => {
        try {
            const { data } = await warehouseApi.getWarehouses()
            setWarehouses(data)
            setLoading(false)
        } catch (error) {
            console.error("Failed to load warehouses:", error)
            setLoading(false)
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const warehouse = {
            name: formData.get("name"),
            location: formData.get("location"),
            capacity: parseInt(formData.get("capacity"))
        }

        try {
            await warehouseApi.createWarehouse(warehouse)
            setShowCreate(false)
            loadWarehouses()
        } catch (error) {
            alert("Failed to create warehouse")
        }
    }

    if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Loading...</div>

    return (
        <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                <h1 style={{ fontSize: "3rem" }}>Warehouse Management</h1>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="btn-primary"
                >
                    <PlusIcon width={20} style={{ display: "inline", verticalAlign: "middle", marginRight: "5px" }} />
                    New Warehouse
                </button>
            </div>

            {showCreate && (
                <motion.div
                    className="glass-card"
                    style={{ padding: "30px", marginBottom: "30px" }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h3 style={{ marginBottom: "20px" }}>Create New Warehouse</h3>
                    <form onSubmit={handleCreate}>
                        <input
                            name="name"
                            placeholder="Warehouse Name"
                            required
                            style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "var(--text-main)" }}
                        />
                        <input
                            name="location"
                            placeholder="Location"
                            required
                            style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "var(--text-main)" }}
                        />
                        <input
                            name="capacity"
                            type="number"
                            placeholder="Capacity"
                            required
                            style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "var(--text-main)" }}
                        />
                        <button type="submit" className="btn-primary">Create Warehouse</button>
                    </form>
                </motion.div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {warehouses.map(warehouse => (
                    <motion.div
                        key={warehouse.id}
                        className="glass-card"
                        style={{ padding: "25px" }}
                        whileHover={{ y: -5 }}
                    >
                        <BuildingStorefrontIcon width={40} style={{ color: "var(--primary)", marginBottom: "15px" }} />
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>{warehouse.name}</h3>
                        <p style={{ color: "var(--text-muted)", marginBottom: "15px" }}>📍 {warehouse.location}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                            <div>
                                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Current Stock</div>
                                <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>{warehouse.currentStock}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Capacity</div>
                                <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>{warehouse.capacity}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
