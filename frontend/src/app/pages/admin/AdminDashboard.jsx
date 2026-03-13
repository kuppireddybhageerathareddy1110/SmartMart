import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { adminApi, productsApi } from "../../core/services/api"
import api from "../../core/services/api"
import {
    UsersIcon, ShoppingBagIcon, CurrencyDollarIcon,
    ChartBarIcon, PencilIcon, TrashIcon, PlusIcon,
    UserPlusIcon, XMarkIcon, CheckCircleIcon
} from "@heroicons/react/24/outline"

const ROLES = ["USER", "SHOPKEEPER", "DELIVERY_AGENT", "WAREHOUSE_OWNER", "ADMIN"]
const ROLE_COLORS = {
    ADMIN: "#d63031",
    SHOPKEEPER: "#6c5ce7",
    DELIVERY_AGENT: "#0984e3",
    WAREHOUSE_OWNER: "#00b894",
    USER: "#636e72"
}
const CATEGORIES = ["Electronics", "Fashion", "Home & Garden", "Sports & Fitness", "Books", "Beauty", "Groceries", "Toys", "Health", "Outdoor", "Automotive", "Baby", "Music", "Office", "Pet Supplies"]

const modalInput = {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    fontSize: "1rem",
    marginBottom: "12px",
    outline: "none"
}

const tab = (active) => ({
    padding: "10px 20px",
    borderRadius: "12px",
    background: active ? "var(--primary)" : "rgba(255,255,255,0.05)",
    color: active ? "#fff" : "var(--text-muted)",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    marginRight: "10px"
})

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [users, setUsers] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("users")

    // Modals
    const [showProductModal, setShowProductModal] = useState(false)
    const [showUserModal, setShowUserModal] = useState(false)
    const [toast, setToast] = useState(null)

    const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", category: "", imageUrl: "" })
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "USER" })

    useEffect(() => {
        loadAll()
    }, [])

    const showToast = (msg, type = "success") => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const loadAll = async () => {
        try {
            const [dashRes, usersRes, productsRes] = await Promise.all([
                adminApi.getDashboard(),
                adminApi.getAllUsers(),
                productsApi.getAll()
            ])
            setStats(dashRes.data)
            setUsers(usersRes.data)
            setProducts(productsRes.data)
        } catch (e) {
            console.error("Load error:", e)
        } finally {
            setLoading(false)
        }
    }

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminApi.updateUserRole(userId, newRole)
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
            showToast(`Role updated to ${newRole}`)
        } catch { showToast("Failed to update role", "error") }
    }

    const handleDeleteUser = async (userId) => {
        if (!confirm("Delete this user?")) return
        try {
            await adminApi.deleteUser(userId)
            setUsers(prev => prev.filter(u => u.id !== userId))
            showToast("User deleted")
            loadAll() // refresh stats
        } catch { showToast("Failed to delete user", "error") }
    }

    const handleAddProduct = async (e) => {
        e.preventDefault()
        try {
            await productsApi.create({ ...newProduct, price: parseFloat(newProduct.price) })
            setShowProductModal(false)
            setNewProduct({ name: "", description: "", price: "", category: "", imageUrl: "" })
            showToast("Product added successfully!")
            loadAll()
        } catch { showToast("Failed to add product", "error") }
    }

    const handleDeleteProduct = async (productId) => {
        if (!confirm("Delete this product?")) return
        try {
            await productsApi.delete(productId)
            setProducts(prev => prev.filter(p => p.id !== productId))
            showToast("Product deleted")
            loadAll()
        } catch { showToast("Failed to delete product", "error") }
    }

    const handleAddUser = async (e) => {
        e.preventDefault()
        try {
            await api.post("/admin/users", newUser)
            setShowUserModal(false)
            setNewUser({ name: "", email: "", password: "", role: "USER" })
            showToast(`${newUser.role} created successfully!`)
            loadAll()
        } catch (err) {
            showToast(err?.response?.data?.detail || "Failed to create user", "error")
        }
    }

    if (loading) return (
        <div style={{ padding: "100px", textAlign: "center" }}>
            <div style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>Loading dashboard...</div>
        </div>
    )

    return (
        <div style={{ padding: "40px 20px", maxWidth: "1400px", margin: "0 auto" }}>
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        style={{
                            position: "fixed", top: 80, right: 30, zIndex: 9999,
                            padding: "14px 24px", borderRadius: 12,
                            background: toast.type === "success" ? "#00b894" : "#d63031",
                            color: "#fff", fontWeight: "bold", boxShadow: "0 8px 30px rgba(0,0,0,0.3)"
                        }}
                    >
                        {toast.type === "success" ? "✅ " : "❌ "}{toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            <h1 style={{ fontSize: "2.5rem", marginBottom: "40px" }}>⚡ Admin Dashboard</h1>

            {/* Stats Grid */}
            {stats && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "50px" }}>
                    <StatCard icon={<UsersIcon width={32} />} label="Total Users" value={stats.totalUsers} color="#6c5ce7" />
                    <StatCard icon={<ShoppingBagIcon width={32} />} label="Total Products" value={stats.totalProducts} color="#00b894" />
                    <StatCard icon={<ChartBarIcon width={32} />} label="Total Orders" value={stats.totalOrders} color="#0984e3" />
                    <StatCard icon={<CurrencyDollarIcon width={32} />} label="Revenue" value={`₹${stats.totalRevenue?.toLocaleString()}`} color="#fdcb6e" />
                </div>
            )}

            {/* Tabs */}
            <div style={{ marginBottom: "30px" }}>
                <button style={tab(activeTab === "users")} onClick={() => setActiveTab("users")}>👥 Users</button>
                <button style={tab(activeTab === "products")} onClick={() => setActiveTab("products")}>📦 Products</button>
            </div>

            {/* ── USERS TAB ── */}
            {activeTab === "users" && (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <h2 style={{ fontSize: "1.8rem", margin: 0 }}>User Management</h2>
                        <motion.button
                            className="btn-primary"
                            onClick={() => setShowUserModal(true)}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            style={{ display: "flex", alignItems: "center", gap: 8 }}
                        >
                            <UserPlusIcon width={20} /> Add User
                        </motion.button>
                    </div>

                    <div className="glass-card" style={{ padding: "20px", overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
                                    {["Name", "Email", "Role", "Actions"].map(h => (
                                        <th key={h} style={{ padding: "15px", textAlign: "left", color: "var(--text-muted)", fontSize: "0.85rem", letterSpacing: "0.05em" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        <td style={{ padding: "15px", fontWeight: "600" }}>{user.name}</td>
                                        <td style={{ padding: "15px", color: "var(--text-muted)" }}>{user.email}</td>
                                        <td style={{ padding: "15px" }}>
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                style={{
                                                    padding: "6px 12px", borderRadius: "8px",
                                                    background: ROLE_COLORS[user.role] || "#636e72",
                                                    border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer"
                                                }}
                                            >
                                                {ROLES.map(r => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
                                            </select>
                                        </td>
                                        <td style={{ padding: "15px" }}>
                                            <motion.button
                                                onClick={() => handleDeleteUser(user.id)}
                                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                style={{ background: "#d63031", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}
                                            >
                                                <TrashIcon width={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Delete
                                            </motion.button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No users found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* ── PRODUCTS TAB ── */}
            {activeTab === "products" && (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <h2 style={{ fontSize: "1.8rem", margin: 0 }}>Product Management</h2>
                        <motion.button
                            className="btn-primary"
                            onClick={() => setShowProductModal(true)}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            style={{ display: "flex", alignItems: "center", gap: 8 }}
                        >
                            <PlusIcon width={20} /> Add Product
                        </motion.button>
                    </div>

                    <div className="glass-card" style={{ padding: "20px", overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
                                    {["Image", "Name", "Category", "Price", "Actions"].map(h => (
                                        <th key={h} style={{ padding: "15px", textAlign: "left", color: "var(--text-muted)", fontSize: "0.85rem" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        <td style={{ padding: "15px" }}>
                                            <img src={p.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80"}
                                                alt={p.name} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }} />
                                        </td>
                                        <td style={{ padding: "15px", fontWeight: "600", maxWidth: 200 }}>{p.name}</td>
                                        <td style={{ padding: "15px" }}>
                                            <span style={{ padding: "4px 10px", background: "rgba(255,255,255,0.1)", borderRadius: 20, fontSize: "0.8rem" }}>
                                                {p.category || "General"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "15px", color: "var(--primary)", fontWeight: "bold" }}>₹{p.price?.toLocaleString()}</td>
                                        <td style={{ padding: "15px" }}>
                                            <motion.button
                                                onClick={() => handleDeleteProduct(p.id)}
                                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                style={{ background: "#d63031", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}
                                            >
                                                <TrashIcon width={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Delete
                                            </motion.button>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No products found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* ── ADD PRODUCT MODAL ── */}
            <Modal show={showProductModal} onClose={() => setShowProductModal(false)} title="➕ Add New Product">
                <form onSubmit={handleAddProduct}>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Product Name *</label>
                    <input required placeholder="e.g. Sony WH-1000XM5" value={newProduct.name}
                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} style={modalInput} />

                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Price (₹) *</label>
                    <input required type="number" placeholder="e.g. 29990" value={newProduct.price}
                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} style={modalInput} />

                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Category</label>
                    <select value={newProduct.category}
                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                        style={{ ...modalInput, cursor: "pointer" }}>
                        <option value="">Select category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Image URL</label>
                    <input placeholder="https://images.unsplash.com/..." value={newProduct.imageUrl}
                        onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })} style={modalInput} />

                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Description</label>
                    <textarea placeholder="Describe the product..." value={newProduct.description}
                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                        style={{ ...modalInput, height: 90, resize: "none" }} />

                    <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1, padding: 12 }}>Add Product</button>
                        <button type="button" onClick={() => setShowProductModal(false)}
                            style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: 12, cursor: "pointer" }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── ADD USER MODAL ── */}
            <Modal show={showUserModal} onClose={() => setShowUserModal(false)} title="👤 Create New User">
                <form onSubmit={handleAddUser}>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Full Name *</label>
                    <input required placeholder="e.g. John Doe" value={newUser.name}
                        onChange={e => setNewUser({ ...newUser, name: e.target.value })} style={modalInput} />

                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Email *</label>
                    <input required type="email" placeholder="e.g. john@smartmart.com" value={newUser.email}
                        onChange={e => setNewUser({ ...newUser, email: e.target.value })} style={modalInput} />

                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Password *</label>
                    <input required type="password" placeholder="Min 6 characters" value={newUser.password}
                        onChange={e => setNewUser({ ...newUser, password: e.target.value })} style={modalInput} />

                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Role *</label>
                    <select value={newUser.role}
                        onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                        style={{ ...modalInput, cursor: "pointer" }}>
                        {ROLES.map(r => (
                            <option key={r} value={r} style={{ background: "#1a1a2e" }}>{r.replace(/_/g, " ")}</option>
                        ))}
                    </select>

                    <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1, padding: 12 }}>Create User</button>
                        <button type="button" onClick={() => setShowUserModal(false)}
                            style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: 12, cursor: "pointer" }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

function StatCard({ icon, label, value, color }) {
    return (
        <motion.div className="glass-card" style={{ padding: "30px", textAlign: "center" }} whileHover={{ y: -5 }}>
            <div style={{ color, marginBottom: "15px", display: "flex", justifyContent: "center" }}>{icon}</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "5px" }}>{value}</div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>{label}</div>
        </motion.div>
    )
}

function Modal({ show, onClose, title, children }) {
    if (!show) return null
    return (
        <AnimatePresence>
            <div style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center",
                justifyContent: "center", zIndex: 2000, padding: 20
            }} onClick={onClose}>
                <motion.div
                    className="glass-card"
                    onClick={e => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{ padding: "40px", maxWidth: "500px", width: "100%" }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 25 }}>
                        <h2 style={{ margin: 0, fontSize: "1.4rem" }}>{title}</h2>
                        <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                            <XMarkIcon width={24} />
                        </button>
                    </div>
                    {children}
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
