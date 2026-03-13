import { useEffect, useMemo, useState, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import api from "../../core/services/api"
import { useCart } from "../../core/services/cart.context"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ShoppingBagIcon,
  HeartIcon,
  EyeIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline"
import QuickViewModal from "../../shared/components/QuickViewModal"
import { getUserRole } from "../../core/utils/auth"
import { productsApi } from "../../core/services/api"

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [addedId, setAddedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("name")

  const [priceRange, setPriceRange] = useState([0, 100000])
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  const [editingPrice, setEditingPrice] = useState(null) // product object
  const [newPrice, setNewPrice] = useState("")
  const userRole = getUserRole()

  const { add, toggleWishlist, isInWishlist } = useCart()

  // Handle category selection with URL update
  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    if (category === "ALL") {
      setSearchParams({})
    } else {
      setSearchParams({ category })
    }
  }

  // Initialize category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam))
    }
  }, [searchParams])

  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const res = await productsApi.getAll()
        setProducts(res.data || [])
        setOffline(false)
      } catch (err) {
        console.warn("Backend unreachable – showing demo products")
        setOffline(true)
        // Fallback sample products so the page is never blank
        setProducts([
          { id: "1", name: "MacBook Pro 16\"", price: 199900, category: "Electronics", description: "M3 Pro chip, 18GB RAM", imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=400" },
          { id: "2", name: "iPhone 15 Pro Max", price: 159900, category: "Electronics", description: "A17 Pro titanium design", imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400" },
          { id: "3", name: "Sony WH-1000XM5", price: 29990, category: "Electronics", description: "Industry-leading noise cancellation", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
          { id: "4", name: "Nike Air Max 270", price: 12995, category: "Fashion", description: "Max Air unit for all-day comfort", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
          { id: "5", name: "Dyson V15 Detect", price: 52900, category: "Home & Garden", description: "Laser detect vacuum technology", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
          { id: "6", name: "Garmin Forerunner 265", price: 44990, category: "Sports & Fitness", description: "AMOLED running smartwatch", imageUrl: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400" },
          { id: "7", name: "Atomic Habits", price: 499, category: "Books", description: "James Clear bestseller", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400" },
          { id: "8", name: "L'Oreal Revitalift Serum", price: 1299, category: "Beauty", description: "1.5% Vitamin C brightening serum", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400" },
          { id: "9", name: "Organic Olive Oil 500ml", price: 850, category: "Groceries", description: "Cold pressed extra virgin", imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400" },
          { id: "10", name: "LEGO Technic Bugatti", price: 24999, category: "Toys", description: "905-piece collector set", imageUrl: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400" },
          { id: "11", name: "Omron Blood Pressure Monitor", price: 2999, category: "Health", description: "Clinically validated with memory", imageUrl: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=400" },
          { id: "12", name: "Coleman 4-Person Tent", price: 8999, category: "Outdoor", description: "WeatherTec waterproof camping tent", imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400" },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const handlePriceUpdate = async (e) => {
    e.preventDefault()
    if (!editingPrice || !newPrice) return

    try {
      await productsApi.update(editingPrice.id, {
        ...editingPrice,
        price: parseFloat(newPrice)
      })

      // Update local state
      setProducts(prev => prev.map(p =>
        p.id === editingPrice.id ? { ...p, price: parseFloat(newPrice) } : p
      ))

      setEditingPrice(null)
      setNewPrice("")
      alert("Price updated successfully!")
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update price")
    }
  }

  const categories = useMemo(() => {
    const allCategories = ["ALL", "Electronics", "Fashion", "Home & Garden", "Sports & Fitness", "Books", "Beauty", "Automotive", "Groceries", "Toys", "Health", "Pet Supplies", "Office", "Baby", "Music", "Outdoor"]
    return allCategories
  }, [])

  const filtered = useMemo(() => {
    let filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "ALL" || p.category === selectedCategory) &&
      p.price >= priceRange[0] && p.price <= priceRange[1]
    )

    // Sort products
    filteredProducts.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filteredProducts
  }, [products, search, selectedCategory, sortBy, priceRange])

  const handleAdd = (product) => {
    add(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 800)
  }

  /* ================= STATES ================= */

  if (loading) {
    return <p className="text-center" style={{ padding: 40 }}>Loading products…</p>
  }

  if (error) {
    return <p className="text-center" style={{ padding: 40, color: "var(--danger)" }}>{error}</p>
  }

  return (
    <div className="container">
      {/* HEADER */}
      <motion.div
        className="text-center"
        style={{ marginBottom: 40 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: 10 }}>Discover Amazing Products</h1>
        <p style={{ color: "var(--text-muted)" }}>Find the perfect items for your lifestyle</p>
      </motion.div>

      {/* OFFLINE BANNER */}
      {offline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: 24, padding: "12px 20px", borderRadius: 12,
            background: "rgba(253,203,110,0.15)", border: "1px solid #fdcb6e",
            color: "#fdcb6e", display: "flex", alignItems: "center", gap: 10, fontSize: "0.9rem"
          }}
        >
          ⚠️ <strong>Showing demo products</strong> – Backend is offline. Start the server to see live data.
        </motion.div>
      )}

      {/* SEARCH BAR */}
      <motion.div
        style={{ display: "flex", gap: 20, marginBottom: 30, alignItems: "center", flexWrap: "wrap" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div style={{ flex: 1, minWidth: 300, position: "relative" }}>
          <MagnifyingGlassIcon style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 20, color: "#666" }} />
          <input
            placeholder="Search for products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 48 }}
          />
          {search && (
            <XMarkIcon
              onClick={() => setSearch("")}
              style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 20, cursor: "pointer", color: "#666" }}
            />
          )}
        </div>
        <motion.button
          className="btn-glass"
          onClick={() => setShowFilters(!showFilters)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <AdjustmentsHorizontalIcon style={{ width: 20 }} />
          Filters
        </motion.button>
      </motion.div>

      {/* FILTERS PANEL */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="glass-panel"
            style={{ padding: 24, marginBottom: 30, overflow: "hidden" }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {/* CATEGORY CHIPS */}
            <div style={{ marginBottom: 24 }}>
              <h3>Categories</h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
                {categories.map(cat => (
                  <motion.button
                    key={cat}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 20,
                      border: "1px solid",
                      background: selectedCategory === cat ? "var(--primary)" : "rgba(255,255,255,0.2)",
                      color: selectedCategory === cat ? "#fff" : "var(--text-main)",
                      borderColor: selectedCategory === cat ? "var(--primary)" : "rgba(255,255,255,0.4)"
                    }}
                    onClick={() => handleCategorySelect(cat)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* SORT & PRICE */}
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              <div>
                <h3 style={{ marginBottom: 12 }}>Sort By</h3>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{ width: 200 }}
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>
              <div>
                <h3 style={{ marginBottom: 12 }}>Price Range</h3>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                    style={{ width: 100 }}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    style={{ width: 100 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESULTS COUNT */}
      <motion.p
        className="text-center"
        style={{ marginBottom: 20, color: "var(--text-muted)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
      </motion.p>

      {/* EMPTY AFTER FILTER */}
      {filtered.length === 0 && (
        <motion.div
          className="text-center"
          style={{ padding: 60 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ShoppingBagIcon style={{ width: 64, color: "var(--text-light)", margin: "0 auto 20px" }} />
          <h3>No products match your search</h3>
          <p>Try adjusting your filters or search terms</p>
        </motion.div>
      )}

      {/* GRID */}
      <motion.div
        className="grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginTop: 20 }}
      >
        <AnimatePresence>
          {filtered.map((p, index) => (
            <ProductCard
              key={p.id}
              product={p}
              index={index}
              userRole={userRole}
              isInWishlist={isInWishlist}
              toggleWishlist={toggleWishlist}
              handleAdd={handleAdd}
              addedId={addedId}
              onQuickView={() => setQuickViewProduct(p)}
              onEditPrice={() => {
                setEditingPrice(p)
                setNewPrice(p.price)
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAdd={handleAdd}
      />

      {/* PRICE EDIT MODAL */}
      <AnimatePresence>
        {editingPrice && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 2000, padding: 20
          }}>
            <motion.div
              className="glass-panel"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ padding: 40, maxWidth: 400, width: "100%" }}
            >
              <h2 style={{ marginBottom: 20 }}>Update Price</h2>
              <p style={{ marginBottom: 20, color: "var(--text-muted)" }}>Editing: {editingPrice.name}</p>
              <form onSubmit={handlePriceUpdate}>
                <div style={{ marginBottom: 25 }}>
                  <label style={{ display: "block", marginBottom: 8 }}>Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    style={{ width: "100%" }}
                    autoFocus
                  />
                </div>
                <div style={{ display: "flex", gap: 15 }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Update</button>
                  <button
                    type="button"
                    className="btn-glass"
                    onClick={() => setEditingPrice(null)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProductCard({
  product: p, index, userRole, isInWishlist, toggleWishlist,
  handleAdd, addedId, onQuickView, onEditPrice
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  // Smooth spring physics for 3D tilt
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 20 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 20 })

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct * 200)
    y.set(yPct * 200)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className="glass-card"
      style={{
        perspective: 1000,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d" // Essential for 3D effect
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      layout
    >
      <div style={{ position: "relative", height: 200, marginBottom: 16, overflow: "hidden", borderRadius: 12, transform: "translateZ(20px)" }}>
        <img
          src={p.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"}
          alt={p.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
          style={{
            position: "absolute", top: 10, right: 10,
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.8)", backdropFilter: "blur(4px)",
            color: isInWishlist(p.id) ? "#ff4757" : "#333",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            border: "none", zIndex: 10
          }}
          title="Add to Wishlist"
        >
          <HeartIcon style={{ width: 20 }} />
        </button>

        {/* QUICK VIEW BTN */}
        <button
          onClick={(e) => { e.stopPropagation(); onQuickView(); }}
          style={{
            position: "absolute", top: 56, right: 10,
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.8)", backdropFilter: "blur(4px)",
            color: "#333",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            border: "none", zIndex: 10
          }}
          title="Quick View"
        >
          <EyeIcon style={{ width: 20 }} />
        </button>

        {/* EDIT PRICE BTN (Visible to ADMIN, USER, SHOPKEEPER) */}
        {(userRole === "ADMIN" || userRole === "USER" || userRole === "SHOPKEEPER") && (
          <button
            onClick={(e) => { e.stopPropagation(); onEditPrice(); }}
            style={{
              position: "absolute", top: 102, right: 10,
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(255,255,255,0.8)", backdropFilter: "blur(4px)",
              color: "var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              border: "none", zIndex: 10
            }}
            title="Edit Price"
          >
            <PencilSquareIcon style={{ width: 20 }} />
          </button>
        )}
      </div>

      <div style={{ transform: "translateZ(30px)" }}>
        <h3 style={{
          fontSize: "1.0rem",
          marginBottom: 8,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          height: "2.4em", // Fixed height for 2 lines
          lineHeight: "1.2em"
        }}>{p.name}</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--primary)" }}>₹{p.price.toLocaleString()}</span>
          <span style={{ fontSize: "0.8rem", padding: "4px 8px", background: "rgba(0,0,0,0.05)", borderRadius: 10 }}>{p.category}</span>
        </div>
      </div>

      <motion.button
        className="btn-primary"
        style={{ width: "100%", background: addedId === p.id ? "var(--secondary)" : "var(--primary)", transform: "translateZ(40px)" }}
        onClick={() => handleAdd(p)}
        whileTap={{ scale: 0.95 }}
      >
        {addedId === p.id ? "✓ Added" : "Add to Cart"}
      </motion.button>
    </motion.div>
  )
}
