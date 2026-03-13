import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer style={wrapper}>
      <div style={container}>
        {/* BRAND */}
        <div>
          <h3 style={logo}>SmartMart</h3>
          <p style={tagline}>
            Smart shopping. Better living.
          </p>
        </div>

        {/* LINKS */}
        <div style={links}>
          <Link to="/" style={link}>Home</Link>
          <Link to="/products" style={link}>Products</Link>
          <Link to="/cart" style={link}>Cart</Link>
          <Link to="/login" style={link}>Login</Link>
        </div>

        {/* INFO */}
        <div style={info}>
          <p>Privacy Policy</p>
          <p>Terms & Conditions</p>
          <p>Support</p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div style={bottom}>
        © {new Date().getFullYear()} SmartMart. All rights reserved.
      </div>
    </footer>
  )
}

/* ================= STYLES ================= */

const wrapper = {
  marginTop: 80,
  background: "linear-gradient(to right, #111, #1c1c1c)",
  color: "#ccc",
}

const container = {
  maxWidth: 1200,
  margin: "auto",
  padding: "40px 20px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 30,
}

const logo = {
  color: "#4CAF50",
  marginBottom: 10,
  fontSize: 22,
}

const tagline = {
  fontSize: 14,
  color: "#aaa",
}

const links = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
}

const link = {
  color: "#ccc",
  textDecoration: "none",
  fontSize: 14,
}

const info = {
  fontSize: 14,
  lineHeight: 1.8,
  color: "#aaa",
}

const bottom = {
  borderTop: "1px solid #333",
  padding: 15,
  textAlign: "center",
  fontSize: 13,
  color: "#888",
}
