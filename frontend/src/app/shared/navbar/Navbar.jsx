import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useCart } from "../../core/services/cart.context"
import { useTheme } from "../../core/services/theme.context"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingBagIcon,
  HeartIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
  CpuChipIcon
} from "@heroicons/react/24/outline"
import { UserCircleIcon } from "@heroicons/react/24/solid"
import Magnetic from "../components/Magnetic"
import { getUserRole } from "../../core/utils/auth"

export default function Navbar() {
  const { cart, wishlist } = useCart()
  const { theme, setTheme, currentTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const isLoggedIn = !!localStorage.getItem("token")
  const userRole = getUserRole()

  // Style definitions
  const nav = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: currentTheme.glass,
    backdropFilter: "blur(20px)",
    borderBottom: `1px solid ${currentTheme.border}`,
    transition: "all 0.3s ease",
    height: "80px",
    display: "flex",
    alignItems: "center"
  }

  const navScrolled = {
    background: currentTheme.surface,
    boxShadow: currentTheme.shadow,
    height: "70px"
  }

  const logoBox = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    padding: "10px 20px",
    borderRadius: "12px",
    transition: "all 0.3s ease"
  }

  const logoContainer = {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  }

  const logo = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff",
    backgroundImage: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  }

  const tagline = {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "1px"
  }

  const desktopNav = {
    display: "flex",
    alignItems: "center",
    gap: "30px"
  }

  const navLink = {
    color: currentTheme.textSecondary,
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "16px",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center"
  }

  const activeLink = {
    ...navLink,
    color: currentTheme.primary,
    background: `${currentTheme.primary}20`
  }

  const dropdownContainer = {
    position: "relative"
  }

  const searchButton = {
    background: "transparent",
    border: `1px solid ${currentTheme.border}`,
    color: currentTheme.textSecondary,
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease"
  }

  const rightSection = {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  }

  const themeToggleContainer = {
    display: "flex",
    background: currentTheme.surface,
    border: `1px solid ${currentTheme.border}`,
    borderRadius: "20px",
    padding: "2px",
    gap: "2px"
  }

  const themeToggleButton = {
    padding: "6px",
    border: "none",
    borderRadius: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease"
  }

  const iconButton = {
    position: "relative",
    background: "transparent",
    border: "none",
    color: currentTheme.textSecondary,
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease"
  }

  const badge = {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    background: currentTheme.primary,
    color: "#fff",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "bold"
  }

  const userMenuContainer = {
    position: "relative"
  }

  const userButton = {
    display: "flex",
    alignItems: "center",
    background: "transparent",
    border: `1px solid ${currentTheme.border}`,
    color: currentTheme.textSecondary,
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease"
  }

  const userDropdown = {
    position: "absolute",
    top: "100%",
    right: 0,
    background: currentTheme.surface,
    border: `1px solid ${currentTheme.border}`,
    borderRadius: "12px",
    boxShadow: currentTheme.shadow,
    minWidth: "200px",
    zIndex: 1000,
    marginTop: "8px"
  }

  const dropdownItem = {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    color: currentTheme.text,
    textDecoration: "none",
    transition: "all 0.3s ease",
    cursor: "pointer",
    border: "none",
    background: "transparent",
    width: "100%",
    textAlign: "left"
  }

  const dropdownDivider = {
    height: "1px",
    background: currentTheme.border,
    marginTop: "4px",
    marginBottom: "4px"
  }

  const loginButton = {
    background: currentTheme.primary,
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s ease"
  }

  const mobileMenuButton = {
    display: "none",
    background: "transparent",
    border: `1px solid ${currentTheme.border}`,
    color: currentTheme.textSecondary,
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease"
  }

  const searchOverlay = {
    position: "fixed",
    top: "80px",
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(8px)",
    zIndex: 999,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: "50px"
  }

  const searchContainer = {
    background: currentTheme.surface,
    border: `1px solid ${currentTheme.border}`,
    borderRadius: "16px",
    boxShadow: currentTheme.shadow,
    width: "100%",
    maxWidth: "600px",
    marginLeft: "20px",
    marginRight: "20px"
  }

  const searchInputContainer = {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    gap: "12px"
  }

  const searchInput = {
    flex: 1,
    border: "none",
    background: "transparent",
    color: currentTheme.text,
    fontSize: "18px",
    outline: "none"
  }

  const searchCloseButton = {
    background: "transparent",
    border: "none",
    color: currentTheme.textSecondary,
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    transition: "all 0.3s ease"
  }

  const searchSuggestions = {
    borderTop: `1px solid ${currentTheme.border}`,
    maxHeight: "300px",
    overflowY: "auto"
  }

  const suggestionItem = {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    color: currentTheme.text,
    cursor: "pointer",
    transition: "all 0.3s ease",
    borderBottom: `1px solid ${currentTheme.border}`
  }

  const mobileMenu = {
    position: "fixed",
    top: "80px",
    right: 0,
    bottom: 0,
    background: currentTheme.surface,
    borderLeft: `1px solid ${currentTheme.border}`,
    boxShadow: currentTheme.shadow,
    width: "300px",
    zIndex: 999
  }

  const mobileMenuContent = {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  }

  const mobileMenuItem = {
    color: currentTheme.text,
    textDecoration: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    fontWeight: "500"
  }

  const mobileLogoutButton = {
    background: "transparent",
    border: `1px solid ${currentTheme.border}`,
    color: currentTheme.textSecondary,
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s ease"
  }

  const mobileLoginButton = {
    background: currentTheme.primary,
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s ease"
  }

  const responsiveStyles = `
    @media (max-width: 768px) {
      .desktop-nav {
        display: none !important;
      }
      .right-section {
        gap: 8px !important;
      }
      .mobile-menu-button {
        display: flex !important;
      }
    }
  `

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
    setIsUserMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const categories = [
    { name: "Electronics", icon: "💻", count: "2.5K+" },
    { name: "Fashion", icon: "👕", count: "5K+" },
    { name: "Books", icon: "📚", count: "10K+" },
    { name: "Home & Garden", icon: "🏠", count: "3K+" },
  ]

  const features = [
    { icon: TruckIcon, title: "Free Shipping", desc: "On orders over ₹999" },
    { icon: ShieldCheckIcon, title: "Secure Payment", desc: "100% protected" },
    { icon: SparklesIcon, title: "Quality Guarantee", desc: "30-day returns" },
  ]

  return (
    <>
      <motion.nav
        style={{
          ...nav,
          ...(isScrolled ? navScrolled : {})
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "0 40px"
        }}>
          {/* LOGO */}
          <motion.div
            style={logoBox}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
          >
            <div style={logoContainer}>
              <ShoppingBagIcon style={{ width: 32, height: 32, color: "#fff" }} />
              <div>
                <span style={logo}>SmartMart</span>
                <span style={tagline}>shop smart • live better</span>
              </div>
            </div>
          </motion.div>

          {/* DESKTOP NAVIGATION */}
          <div style={desktopNav} className="desktop-nav">
            {/* HOME LINK */}
            <Magnetic>
              <Link to="/" style={isActive("/") ? activeLink : navLink}>
                Home
              </Link>
            </Magnetic>

            {/* PRODUCTS WITH MEGA MENU */}
            <Magnetic>
              <div style={dropdownContainer}>
                <Link
                  to="/products"
                  style={isActive("/products") ? activeLink : navLink}
                >
                  Products
                  <ChevronDownIcon style={{ width: 16, height: 16, marginLeft: 4 }} />
                </Link>
              </div>
            </Magnetic>

            {/* SEARCH BUTTON */}
            <Magnetic>
              <motion.button
                style={searchButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <MagnifyingGlassIcon style={{ width: 20, height: 20 }} />
              </motion.button>
            </Magnetic>
          </div>

          {/* RIGHT SIDE */}
          <div style={rightSection} className="right-section">
            {/* THEME TOGGLE */}
            <div style={themeToggleContainer}>
              <motion.button
                style={{
                  ...themeToggleButton,
                  background: theme === 'light' ? currentTheme.primary : 'transparent',
                  color: theme === 'light' ? '#fff' : currentTheme.textSecondary
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme('light')}
                title="Light Theme"
              >
                <SunIcon style={{ width: 18, height: 18 }} />
              </motion.button>

              <motion.button
                style={{
                  ...themeToggleButton,
                  background: theme === 'dark' ? currentTheme.primary : 'transparent',
                  color: theme === 'dark' ? '#fff' : currentTheme.textSecondary
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme('dark')}
                title="Dark Theme"
              >
                <MoonIcon style={{ width: 18, height: 18 }} />
              </motion.button>

              <motion.button
                style={{
                  ...themeToggleButton,
                  background: theme === 'coffee' ? currentTheme.primary : 'transparent',
                  color: theme === 'coffee' ? '#fff' : currentTheme.textSecondary
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme('coffee')}
                title="Coffee Theme"
              >
                <CpuChipIcon style={{ width: 18, height: 18 }} />
              </motion.button>
            </div>

            {/* CART */}
            <motion.button
              style={iconButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/cart")}
            >
              <ShoppingCartIcon style={{ width: 24, height: 24 }} />
              {cart.length > 0 && (
                <motion.span
                  style={badge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {cart.length}
                </motion.span>
              )}
            </motion.button>

            {/* WISHLIST */}
            <motion.button
              style={iconButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/wishlist")}
            >
              <HeartIcon style={{ width: 24, height: 24 }} />
              {wishlist.length > 0 && (
                <motion.span
                  style={badge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {wishlist.length}
                </motion.span>
              )}
            </motion.button>

            {/* USER MENU */}
            {isLoggedIn ? (
              <div style={userMenuContainer}>
                <motion.button
                  style={userButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <UserCircleIcon style={{ width: 32, height: 32 }} />
                  <ChevronDownIcon style={{ width: 16, height: 16, marginLeft: 4 }} />
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      style={userDropdown}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link to="/orders" style={dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                        <ShoppingBagIcon style={{ width: 18, height: 18, marginRight: 10 }} />
                        My Orders
                      </Link>

                      {/* Role-based portal links */}
                      {userRole === "ADMIN" && (
                        <Link to="/admin/dashboard" style={dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                          <ShieldCheckIcon style={{ width: 18, height: 18, marginRight: 10 }} />
                          Admin Dashboard
                        </Link>
                      )}

                      {userRole === "SHOPKEEPER" && (
                        <Link to="/shopkeeper" style={dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                          <ShoppingBagIcon style={{ width: 18, height: 18, marginRight: 10 }} />
                          Shopkeeper Portal
                        </Link>
                      )}

                      {userRole === "DELIVERY_AGENT" && (
                        <Link to="/delivery" style={dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                          <TruckIcon style={{ width: 18, height: 18, marginRight: 10 }} />
                          Delivery Portal
                        </Link>
                      )}

                      {userRole === "WAREHOUSE_OWNER" && (
                        <Link to="/warehouse" style={dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                          <CpuChipIcon style={{ width: 18, height: 18, marginRight: 10 }} />
                          Warehouse Portal
                        </Link>
                      )}

                      <div style={dropdownDivider} />
                      <button style={dropdownItem} onClick={logout}>
                        <UserIcon style={{ width: 18, height: 18, marginRight: 10 }} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                style={loginButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
              >
                Login
              </motion.button>
            )}

            {/* MOBILE MENU BUTTON */}
            <motion.button
              style={{ ...mobileMenuButton }}
              className="mobile-menu-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon style={{ width: 24, height: 24 }} />
              ) : (
                <Bars3Icon style={{ width: 24, height: 24 }} />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* SEARCH OVERLAY */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            style={searchOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              style={searchContainer}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={searchInputContainer}>
                <MagnifyingGlassIcon style={{ width: 24, height: 24, color: "#666" }} />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={searchInput}
                  autoFocus
                />
                <button
                  style={searchCloseButton}
                  onClick={() => setIsSearchOpen(false)}
                >
                  <XMarkIcon style={{ width: 20, height: 20 }} />
                </button>
              </div>

              {/* SEARCH SUGGESTIONS */}
              {searchQuery && (
                <motion.div
                  style={searchSuggestions}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div style={suggestionItem} onClick={() => navigate("/products")}>
                    <MagnifyingGlassIcon style={{ width: 16, height: 16, marginRight: 10 }} />
                    Search for "{searchQuery}"
                  </div>
                  <div style={suggestionItem} onClick={() => navigate("/products")}>
                    <StarIcon style={{ width: 16, height: 16, marginRight: 10 }} />
                    Popular: Wireless Headphones
                  </div>
                  <div style={suggestionItem} onClick={() => navigate("/products")}>
                    <StarIcon style={{ width: 16, height: 16, marginRight: 10 }} />
                    Popular: Gaming Laptop
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            style={mobileMenu}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div style={mobileMenuContent}>
              <Link to="/" style={mobileMenuItem} onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" style={mobileMenuItem} onClick={() => setIsMobileMenuOpen(false)}>
                Products
              </Link>
              <Link to="/cart" style={mobileMenuItem} onClick={() => setIsMobileMenuOpen(false)}>
                Cart ({cart.length})
              </Link>
              <Link to="/wishlist" style={mobileMenuItem} onClick={() => setIsMobileMenuOpen(false)}>
                Wishlist ({wishlist.length})
              </Link>

              {isLoggedIn ? (
                <>
                  <Link to="/orders" style={mobileMenuItem} onClick={() => setIsMobileMenuOpen(false)}>
                    My Orders
                  </Link>
                  <button style={mobileLogoutButton} onClick={logout}>
                    Logout
                  </button>
                </>
              ) : (
                <button
                  style={mobileLoginButton}
                  onClick={() => {
                    navigate("/login")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{responsiveStyles}</style>

      {/* THEME STYLES */}
      <style>
        {`
          :root {
            --theme-primary: ${currentTheme.primary};
            --theme-secondary: ${currentTheme.secondary};
            --theme-background: ${currentTheme.background};
            --theme-surface: ${currentTheme.surface};
            --theme-text: ${currentTheme.text};
            --theme-text-secondary: ${currentTheme.textSecondary};
            --theme-border: ${currentTheme.border};
            --theme-shadow: ${currentTheme.shadow};
            --theme-glass: ${currentTheme.glass};
            --theme-accent: ${currentTheme.accent};
          }

          * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
          }

          body {
            background: var(--theme-background);
            color: var(--theme-text);
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}
      </style>
    </>
  )
}
