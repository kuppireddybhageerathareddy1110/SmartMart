import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../core/services/api"
import { useToast } from "../../core/services/toast.context"
import Spinner from "../../shared/spinner/Spinner"

/* ── Dummy credentials shown on login screen ── */
const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@smartmart.com", password: "admin123", color: "#d63031", emoji: "👑" },
  { role: "Shopkeeper", email: "shopkeeper@smartmart.com", password: "shop123", color: "#6c5ce7", emoji: "🏪" },
  { role: "Delivery Agent", email: "delivery@smartmart.com", password: "delivery123", color: "#0984e3", emoji: "🚚" },
  { role: "Warehouse", email: "warehouse@smartmart.com", password: "warehouse123", color: "#00b894", emoji: "🏭" },
  { role: "User", email: "user@smartmart.com", password: "user123", color: "#636e72", emoji: "👤" },
]

const INITIAL_LOGIN_FORM = { email: "", password: "" }
const INITIAL_REGISTER_FORM = { name: "", email: "", password: "", confirmPassword: "" }

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState(INITIAL_LOGIN_FORM)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const fillDemo = (account) => {
    setForm({ email: account.email, password: account.password })
    setIsLogin(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email.trim() || !validateEmail(form.email)) { showError("Enter a valid email address"); return }

    if (isLogin) {
      if (!form.password.trim()) { showError("Password is required"); return }
    } else {
      if (!form.name?.trim()) { showError("Name is required"); return }
      if (!form.password.trim() || form.password.length < 6) { showError("Password must be at least 6 characters"); return }
      if (form.password !== form.confirmPassword) { showError("Passwords do not match"); return }
    }

    try {
      setLoading(true)
      const endpoint = isLogin ? "/auth/login" : "/auth/register"
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }

      const res = await api.post(endpoint, payload)
      localStorage.setItem("token", res.data.token)
      showSuccess(`${isLogin ? "Login" : "Registration"} successful! Welcome to SmartMart.`)
      navigate("/")
    } catch (err) {
      if (!err.response) {
        showError("Server unreachable. Please check your connection.")
      } else {
        showError(err.response.data?.detail || err.response.data?.message || `${isLogin ? "Login" : "Registration"} failed`)
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setForm(isLogin ? INITIAL_REGISTER_FORM : INITIAL_LOGIN_FORM)
  }

  return (
    <div style={page}>
      <div style={{ width: "100%", maxWidth: 900, display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }}>

        {/* ── Demo Credentials Panel ── */}
        <div style={credPanel}>
          <h3 style={{ marginBottom: 16, fontSize: "1.1rem", color: "#fff", textAlign: "center" }}>🔑 Demo Login Credentials</h3>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 16 }}>
            Click any card to auto-fill
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                onClick={() => fillDemo(acc)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "rgba(255,255,255,0.06)", border: `1px solid ${acc.color}44`,
                  borderRadius: 12, padding: "10px 14px", cursor: "pointer",
                  textAlign: "left", transition: "all 0.2s ease", color: "#fff"
                }}
                onMouseEnter={e => e.currentTarget.style.background = `${acc.color}22`}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              >
                <span style={{ fontSize: "1.3rem" }}>{acc.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "0.85rem", color: acc.color }}>{acc.role}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>{acc.email}</div>
                </div>
                <div style={{
                  background: `${acc.color}22`, color: acc.color,
                  padding: "3px 8px", borderRadius: 6, fontSize: "0.7rem", fontFamily: "monospace"
                }}>
                  {acc.password}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Login / Register Form ── */}
        <form style={card} onSubmit={handleSubmit}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: "2rem", marginBottom: 8 }}>🛒</div>
            <h2 style={{ margin: 0, color: "#fff", fontSize: "1.5rem" }}>
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>SmartMart</p>
          </div>

          {loading && (
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <Spinner size="small" />
              <p style={{ marginTop: 10, color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
                {isLogin ? "Logging you in..." : "Creating your account..."}
              </p>
            </div>
          )}

          {!isLogin && (
            <>
              <label style={label}>Full Name</label>
              <input name="name" type="text" placeholder="John Doe" value={form.name || ""}
                onChange={handleChange} style={input} disabled={loading} />
            </>
          )}

          <label style={label}>Email</label>
          <input name="email" type="email" placeholder="you@example.com" value={form.email}
            onChange={handleChange} style={input} disabled={loading} />

          <label style={label}>Password</label>
          <input name="password" type="password" placeholder={isLogin ? "Your password" : "Create a password"}
            value={form.password} onChange={handleChange} style={input} disabled={loading} />

          {!isLogin && (
            <>
              <label style={label}>Confirm Password</label>
              <input name="confirmPassword" type="password" placeholder="Confirm your password"
                value={form.confirmPassword || ""} onChange={handleChange} style={input} disabled={loading} />
            </>
          )}

          <button type="submit" style={{ ...btn, opacity: loading ? 0.6 : 1 }} disabled={loading}>
            {loading ? (isLogin ? "Logging in..." : "Creating account...") : (isLogin ? "Login" : "Create Account")}
          </button>

          <p style={{ marginTop: 20, fontSize: 14, textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span style={link} onClick={toggleMode}>
              {isLogin ? "Sign up" : "Sign in"}
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

/* ── Styles ── */

const page = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
  background: "var(--bg-main, #0a0a1a)",
}

const credPanel = {
  width: 300,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 20,
  padding: 24,
  backdropFilter: "blur(20px)",
}

const card = {
  width: 360,
  padding: 36,
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  borderRadius: 20,
  boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
  border: "1px solid rgba(255,255,255,0.1)",
}

const label = {
  display: "block",
  textAlign: "left",
  fontSize: 12,
  marginBottom: 6,
  color: "rgba(255,255,255,0.5)",
  textTransform: "uppercase",
  letterSpacing: "0.07em"
}

const input = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: 14,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box"
}

const btn = {
  width: "100%",
  padding: "13px",
  background: "linear-gradient(135deg, #6c5ce7, #a29bfe)",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontSize: 15,
  fontWeight: "bold",
  cursor: "pointer",
  letterSpacing: "0.02em"
}

const link = {
  color: "#a29bfe",
  cursor: "pointer",
  fontWeight: "bold",
  textDecoration: "underline"
}
