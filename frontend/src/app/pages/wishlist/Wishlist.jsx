import { useCart } from "../../core/services/cart.context"

/* ================= STYLES ================= */

const container = {
  maxWidth: 900,
  margin: "40px auto",
  padding: 20,
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 24,
}

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  textAlign: "center",
  position: "relative",
}

const image = {
  height: 160,
  width: "100%",
  objectFit: "cover",
  borderRadius: 10,
  marginBottom: 12,
}

const price = { color: "#555", marginBottom: 10 }

const btn = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "none",
  color: "#fff",
  cursor: "pointer",
  marginBottom: 8,
}

const addBtn = {
  ...btn,
  background: "#4CAF50",
}

const removeBtn = {
  ...btn,
  background: "#f44336",
}

const empty = {
  textAlign: "center",
  marginTop: 80,
  color: "#555",
}

/* ================= COMPONENT ================= */

export default function Wishlist() {
  const { wishlist, toggleWishlist, add, isInWishlist } = useCart()

  if (wishlist.length === 0) {
    return (
      <div style={empty}>
        <h2>Your wishlist is empty 💖</h2>
        <p>Add some products to your wishlist to keep track of items you love.</p>
      </div>
    )
  }

  return (
    <div style={container}>
      <h2 style={{ marginBottom: 20 }}>My Wishlist</h2>

      <div style={grid}>
        {wishlist.map(p => (
          <div key={p.id} style={card}>
            <img
              src={p.imageUrl || "https://via.placeholder.com/200"}
              alt={p.name}
              style={image}
            />

            <h3>{p.name}</h3>
            <p style={price}>₹{p.price}</p>

            <button
              style={addBtn}
              onClick={() => add(p)}
            >
              Add to Cart
            </button>

            <button
              style={removeBtn}
              onClick={() => toggleWishlist(p)}
            >
              Remove from Wishlist
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}