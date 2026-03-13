import { useState } from "react"
import api from "../../core/services/api"

/* ================= CONSTANTS ================= */

const INITIAL_PRODUCT = {
  name: "",
  price: "",
  category: "",
  imageUrl: "",
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  background: "#f4f6f8",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const card = {
  width: 420,
  background: "#fff",
  padding: 30,
  borderRadius: 14,
  boxShadow: "0 14px 40px rgba(0,0,0,0.12)",
}

const title = {
  marginBottom: 20,
  textAlign: "center",
}

const input = (disabled) => ({
  width: "100%",
  padding: "10px 12px",
  marginBottom: 14,
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 14,
  background: disabled ? "#f2f2f2" : "#fff",
})

const btn = (loading) => ({
  width: "100%",
  padding: "12px",
  background: loading ? "#9E9E9E" : "#2E7D32",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontSize: 16,
  fontWeight: "bold",
  cursor: loading ? "not-allowed" : "pointer",
})

const messageStyle = (type) => ({
  marginTop: 15,
  textAlign: "center",
  fontWeight: "bold",
  color: type === "success" ? "#2E7D32" : "red",
})

/* ================= COMPONENT ================= */

export default function Admin() {
  const [product, setProduct] = useState(INITIAL_PRODUCT)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const validate = () => {
    if (!product.name.trim()) return "Product name is required"
    if (!product.category.trim()) return "Category is required"
    if (!product.price || Number(product.price) <= 0)
      return "Price must be greater than zero"
    return null
  }

  const submit = async () => {
    setError("")
    setMessage("")

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)

      await api.post("/products", {
        ...product,
        price: Number(product.price),
      })

      setMessage("Product added successfully")
      setProduct(INITIAL_PRODUCT)

      setTimeout(() => setMessage(""), 3000)
    } catch (err) {
      if (!err.response) {
        setError("Server not reachable. Check backend.")
      } else {
        setError(err.response.data?.message || "Failed to add product")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>Admin – Add Product</h2>

        <input
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          style={input(loading)}
          disabled={loading}
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          style={input(loading)}
          disabled={loading}
        />

        <input
          name="category"
          placeholder="Category (Electronics, Fashion...)"
          value={product.category}
          onChange={handleChange}
          style={input(loading)}
          disabled={loading}
        />

        <input
          name="imageUrl"
          placeholder="Image URL (optional)"
          value={product.imageUrl}
          onChange={handleChange}
          style={input(loading)}
          disabled={loading}
        />

        <button
          style={btn(loading)}
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>

        {message && <p style={messageStyle("success")}>{message}</p>}
        {error && <p style={messageStyle("error")}>{error}</p>}
      </div>
    </div>
  )
}
