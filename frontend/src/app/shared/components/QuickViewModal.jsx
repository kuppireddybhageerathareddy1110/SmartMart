import { motion, AnimatePresence } from "framer-motion"
import { XMarkIcon, ShoppingBagIcon, StarIcon, CheckBadgeIcon } from "@heroicons/react/24/outline"
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid"

export default function QuickViewModal({ product, isOpen, onClose, onAdd }) {
    if (!isOpen || !product) return null

    return (
        <AnimatePresence>
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px"
            }}>
                {/* BACKDROP */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(8px)"
                    }}
                />

                {/* MODAL CONTENT */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="glass-panel"
                    style={{
                        position: 'relative',
                        width: "100%",
                        maxWidth: "900px",
                        background: "var(--surface)",
                        borderRadius: "24px",
                        overflow: "hidden",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    }}
                >
                    {/* IMAGE SECTION */}
                    <div style={{ position: "relative", height: "500px", background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{ width: "90%", height: "90%", objectFit: "contain", mixBlendMode: "multiply" }}
                        />
                        <div style={{ position: "absolute", top: 20, left: 20, background: "white", padding: "6px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold", opacity: 0.8 }}>
                            {product.category}
                        </div>
                    </div>

                    {/* DETAILS SECTION */}
                    <div style={{ padding: "40px", display: "flex", flexDirection: "column" }}>
                        <button
                            onClick={onClose}
                            style={{ position: "absolute", top: 20, right: 20, background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                        >
                            <XMarkIcon width={28} />
                        </button>

                        <h2 style={{ fontSize: "2rem", marginBottom: "10px", lineHeight: 1.2 }}>{product.name}</h2>

                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "20px" }}>
                            <div style={{ display: "flex", color: "#fbbf24" }}>
                                {[1, 2, 3, 4, 5].map(i => <StarIconSolid key={i} width={16} />)}
                            </div>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>(128 reviews)</span>
                        </div>

                        <div style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--primary)", marginBottom: "24px" }}>
                            ₹{product.price.toLocaleString()}
                        </div>

                        <p style={{ color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "30px", fontSize: "1.1rem" }}>
                            {product.description}. Experience premium quality and exceptional durability with this top-rated product from SmartMart.
                        </p>

                        <div style={{ marginTop: "auto" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "20px", color: "#10b981", fontSize: "0.9rem", fontWeight: 500 }}>
                                <CheckBadgeIcon width={20} />
                                In Stock & Ready to Ship
                            </div>

                            <div style={{ display: "flex", gap: "16px" }}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => { onAdd(product); onClose(); }}
                                    style={{
                                        flex: 1,
                                        background: "var(--primary)",
                                        color: "white",
                                        border: "none",
                                        padding: "16px",
                                        borderRadius: "12px",
                                        fontSize: "1.1rem",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px"
                                    }}
                                >
                                    <ShoppingBagIcon width={24} /> Add to Cart
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .glass-panel {
            grid-template-columns: 1fr !important;
            max-height: 90vh;
            overflow-y: auto !important;
          }
        }
      `}</style>
        </AnimatePresence>
    )
}
