import { useState, useEffect, useRef } from "react"
import { useCart } from "../../core/services/cart.context"
import { useTheme } from "../../core/services/theme.context"
import { useNavigate } from "react-router-dom"
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"
import {
  ShoppingBagIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  SparklesIcon,
  HeartIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  GlobeAltIcon,
  FireIcon,
  ClockIcon,
  TagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  BoltIcon
} from "@heroicons/react/24/outline"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

export default function Home() {
  const { add } = useCart()
  const { currentTheme } = useTheme()
  const navigate = useNavigate()
  const [activeSlide, setActiveSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)

  // Refs for scroll animations
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const categoriesRef = useRef(null)
  const dealsRef = useRef(null)
  const testimonialsRef = useRef(null)

  const isHeroInView = useInView(heroRef, { once: true })
  const isStatsInView = useInView(statsRef, { once: true })
  const isCategoriesInView = useInView(categoriesRef, { once: true })
  const isDealsInView = useInView(dealsRef, { once: true })
  const isTestimonialsInView = useInView(testimonialsRef, { once: true })

  // Enhanced theme-dependent styles
  const styles = {
    // Hero Section
    hero: {
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 50%, ${currentTheme.accent} 100%)`,
    },

    heroContent: {
      position: "relative",
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      padding: "0 20px",
      textAlign: "center",
    },

    heroTitle: {
      fontSize: "clamp(3rem, 8vw, 5rem)",
      fontWeight: 900,
      marginBottom: "1.5rem",
      backgroundImage: "linear-gradient(45deg, #ffffff 0%, #f8f9ff 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textShadow: "0 0 40px rgba(255,255,255,0.3)",
      lineHeight: 1.1,
    },

    heroSubtitle: {
      fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
      opacity: 0.95,
      maxWidth: "600px",
      lineHeight: 1.6,
      fontWeight: 300,
      marginBottom: "2rem",
      color: "#ffffff",
    },

    heroButtons: {
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: "2rem",
    },

    primaryBtn: {
      padding: "1rem 2rem",
      fontSize: "1.1rem",
      fontWeight: 600,
      border: "none",
      borderRadius: "50px",
      background: "linear-gradient(45deg, #ffffff 0%, #f8f9ff 100%)",
      color: currentTheme.primary,
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      position: "relative",
      overflow: "hidden",
    },

    secondaryBtn: {
      padding: "1rem 2rem",
      fontSize: "1.1rem",
      fontWeight: 600,
      border: "2px solid rgba(255,255,255,0.3)",
      borderRadius: "50px",
      background: "transparent",
      color: "#ffffff",
      cursor: "pointer",
      transition: "all 0.3s ease",
      backdropFilter: "blur(10px)",
    },

    // Stats Section
    statsSection: {
      padding: "6rem 2rem",
      background: currentTheme.surface,
      position: "relative",
    },

    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
    },

    statCard: {
      background: currentTheme.background,
      padding: "2.5rem",
      borderRadius: "20px",
      boxShadow: `0 10px 30px ${currentTheme.shadow}`,
      border: `1px solid ${currentTheme.border}`,
      transition: "all 0.3s ease",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    },

    statIcon: {
      width: "4rem",
      height: "4rem",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1.5rem",
      fontSize: "2rem",
    },

    statNumber: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: currentTheme.primary,
      marginBottom: "0.5rem",
    },

    statLabel: {
      fontSize: "1.1rem",
      fontWeight: 500,
      color: currentTheme.textSecondary,
    },

    // Categories Section
    categoriesSection: {
      padding: "6rem 2rem",
      background: currentTheme.background,
    },

    categoriesHeader: {
      textAlign: "center",
      marginBottom: "4rem",
      maxWidth: "800px",
      margin: "0 auto 4rem",
    },

    categoriesTitle: {
      fontSize: "clamp(2rem, 4vw, 3rem)",
      fontWeight: 700,
      marginBottom: "1rem",
      color: currentTheme.text,
    },

    categoriesSubtitle: {
      fontSize: "1.2rem",
      color: currentTheme.textSecondary,
      lineHeight: 1.6,
    },

    categoriesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "2rem",
      maxWidth: "1400px",
      margin: "0 auto",
    },

    categoryCard: {
      background: currentTheme.surface,
      borderRadius: "24px",
      overflow: "hidden",
      cursor: "pointer",
      transition: "all 0.4s ease",
      border: `1px solid ${currentTheme.border}`,
      position: "relative",
      height: "280px",
    },

    categoryImage: {
      height: "180px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "4rem",
      position: "relative",
    },

    categoryContent: {
      padding: "1.5rem",
      textAlign: "center",
    },

    categoryTitle: {
      fontSize: "1.3rem",
      fontWeight: 600,
      marginBottom: "0.5rem",
      color: currentTheme.text,
    },

    categoryDesc: {
      fontSize: "0.95rem",
      color: currentTheme.textSecondary,
      lineHeight: 1.5,
    },

    // Deals Section
    dealsSection: {
      padding: "6rem 2rem",
      background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
      color: "#ffffff",
      position: "relative",
      overflow: "hidden",
    },

    dealsHeader: {
      textAlign: "center",
      marginBottom: "4rem",
      position: "relative",
      zIndex: 2,
    },

    dealsTitle: {
      fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
      fontWeight: 800,
      marginBottom: "1rem",
      textShadow: "0 4px 20px rgba(0,0,0,0.3)",
    },

    dealsSubtitle: {
      fontSize: "1.3rem",
      opacity: 0.9,
      maxWidth: "600px",
      margin: "0 auto",
      lineHeight: 1.6,
    },

    productsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "2rem",
      maxWidth: "1400px",
      margin: "0 auto",
      position: "relative",
      zIndex: 2,
    },

    productCard: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "20px",
      overflow: "hidden",
      transition: "all 0.4s ease",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      position: "relative",
    },

    productImage: {
      height: "220px",
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "4rem",
      position: "relative",
      overflow: "hidden",
    },

    productBadge: {
      position: "absolute",
      top: "1rem",
      right: "1rem",
      background: "#ff4757",
      color: "#ffffff",
      padding: "0.3rem 0.8rem",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },

    productContent: {
      padding: "1.5rem",
    },

    productTitle: {
      fontSize: "1.2rem",
      fontWeight: 600,
      marginBottom: "0.5rem",
      color: "#2d3748",
    },

    productRating: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "1rem",
    },

    stars: {
      display: "flex",
      gap: "0.2rem",
    },

    ratingText: {
      fontSize: "0.9rem",
      color: "#718096",
    },

    productPrice: {
      fontSize: "1.5rem",
      fontWeight: 700,
      color: currentTheme.primary,
      marginBottom: "1rem",
    },

    productActions: {
      display: "flex",
      gap: "0.5rem",
    },

    addToCartBtn: {
      flex: 1,
      padding: "0.8rem 1rem",
      border: "none",
      borderRadius: "8px",
      background: currentTheme.primary,
      color: "#ffffff",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
    },

    wishlistBtn: {
      padding: "0.8rem",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      background: "transparent",
      color: "#718096",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },

    // Testimonials Section
    testimonialsSection: {
      padding: "6rem 2rem",
      background: currentTheme.surface,
    },

    testimonialsHeader: {
      textAlign: "center",
      marginBottom: "4rem",
    },

    testimonialsTitle: {
      fontSize: "clamp(2rem, 4vw, 3rem)",
      fontWeight: 700,
      marginBottom: "1rem",
      color: currentTheme.text,
    },

    testimonialsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      gap: "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
    },

    testimonialCard: {
      background: currentTheme.background,
      padding: "2rem",
      borderRadius: "20px",
      boxShadow: `0 10px 30px ${currentTheme.shadow}`,
      border: `1px solid ${currentTheme.border}`,
      position: "relative",
    },

    testimonialQuote: {
      fontSize: "1.1rem",
      lineHeight: 1.6,
      color: currentTheme.text,
      marginBottom: "1.5rem",
      fontStyle: "italic",
    },

    testimonialAuthor: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },

    testimonialAvatar: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      background: currentTheme.primary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ffffff",
      fontWeight: 600,
      fontSize: "1.2rem",
    },

    testimonialInfo: {
      flex: 1,
    },

    testimonialName: {
      fontWeight: 600,
      color: currentTheme.text,
      marginBottom: "0.2rem",
    },

    testimonialRole: {
      fontSize: "0.9rem",
      color: currentTheme.textSecondary,
    },

    testimonialRating: {
      display: "flex",
      gap: "0.2rem",
      marginTop: "0.5rem",
    },

    // Features Section
    featuresSection: {
      padding: "6rem 2rem",
      background: currentTheme.background,
    },

    featuresGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
    },

    featureCard: {
      background: currentTheme.surface,
      padding: "2.5rem",
      borderRadius: "20px",
      textAlign: "center",
      transition: "all 0.3s ease",
      border: `1px solid ${currentTheme.border}`,
      boxShadow: `0 8px 25px ${currentTheme.shadow}`,
    },

    featureIcon: {
      width: "4rem",
      height: "4rem",
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1.5rem",
      color: "#ffffff",
    },

    featureTitle: {
      fontSize: "1.3rem",
      fontWeight: 600,
      marginBottom: "1rem",
      color: currentTheme.text,
    },

    featureDesc: {
      color: currentTheme.textSecondary,
      lineHeight: 1.6,
    },

    // CTA Section
    ctaSection: {
      padding: "6rem 2rem",
      background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
      color: "#ffffff",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    },

    ctaContent: {
      maxWidth: "800px",
      margin: "0 auto",
      position: "relative",
      zIndex: 2,
    },

    ctaTitle: {
      fontSize: "clamp(2rem, 5vw, 3rem)",
      fontWeight: 700,
      marginBottom: "1.5rem",
      textShadow: "0 4px 20px rgba(0,0,0,0.3)",
    },

    ctaText: {
      fontSize: "1.2rem",
      opacity: 0.9,
      marginBottom: "2.5rem",
      lineHeight: 1.6,
    },

    ctaButton: {
      padding: "1.2rem 3rem",
      fontSize: "1.2rem",
      fontWeight: 600,
      border: "none",
      borderRadius: "50px",
      background: "#ffffff",
      color: currentTheme.primary,
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
    },
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const floatVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

  // Sample data
  const categories = [
    {
      id: 1,
      name: "Electronics",
      description: "Latest gadgets and tech accessories",
      icon: "💻",
      gradient: "linear-gradient(135deg, #667eea, #764ba2)",
      itemCount: "2.5K+ Products"
    },
    {
      id: 2,
      name: "Fashion",
      description: "Trendy clothing and accessories",
      icon: "👕",
      gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
      itemCount: "5K+ Products"
    },
    {
      id: 3,
      name: "Home & Garden",
      description: "Everything for your home",
      icon: "🏠",
      gradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
      itemCount: "3.2K+ Products"
    },
    {
      id: 4,
      name: "Sports & Fitness",
      description: "Gear up for your active lifestyle",
      icon: "⚽",
      gradient: "linear-gradient(135deg, #43e97b, #38f9d7)",
      itemCount: "1.8K+ Products"
    },
  ]

  const stats = [
    {
      icon: ShoppingBagIcon,
      value: "50K+",
      label: "Products",
      color: currentTheme.primary,
      gradient: "linear-gradient(135deg, #667eea, #764ba2)",
    },
    {
      icon: UserGroupIcon,
      value: "100K+",
      label: "Happy Customers",
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981, #34d399)",
    },
    {
      icon: GlobeAltIcon,
      value: "50+",
      label: "Countries",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    },
    {
      icon: StarIcon,
      value: "4.9",
      label: "Average Rating",
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #ef4444, #f87171)",
    },
  ]

  const featuredProducts = [
    {
      id: 101,
      name: "Gaming Laptop Pro",
      price: 125000,
      originalPrice: 150000,
      icon: "💻",
      rating: 4.8,
      reviews: 234,
      badge: "HOT",
      discount: "17%"
    },
    {
      id: 102,
      name: "Wireless Headphones",
      price: 8500,
      originalPrice: 12000,
      icon: "🎧",
      rating: 4.9,
      reviews: 567,
      badge: "BESTSELLER",
      discount: "29%"
    },
    {
      id: 103,
      name: "Running Shoes Elite",
      price: 9200,
      originalPrice: 11000,
      icon: "👟",
      rating: 4.7,
      reviews: 189,
      badge: "NEW",
      discount: "16%"
    },
    {
      id: 104,
      name: "Smart Watch Ultra",
      price: 18500,
      originalPrice: 22000,
      icon: "⌚",
      rating: 4.6,
      reviews: 423,
      badge: "TRENDING",
      discount: "16%"
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Tech Enthusiast",
      text: "SmartMart revolutionized my shopping experience. The quality and speed of delivery exceeded my expectations! The user interface is incredibly intuitive.",
      rating: 5,
      avatar: "SJ",
      verified: true,
    },
    {
      name: "Mike Chen",
      role: "Business Owner",
      text: "As a business owner, I appreciate the reliability and customer service. SmartMart is my go-to platform for both personal and business purchases.",
      rating: 5,
      avatar: "MC",
      verified: true,
    },
    {
      name: "Emma Davis",
      role: "Fashion Blogger",
      text: "The fashion collection is incredible! Always trendy, always affordable. Love the user experience and the seamless checkout process.",
      rating: 5,
      avatar: "ED",
      verified: true,
    },
  ]

  const features = [
    {
      icon: TruckIcon,
      title: "Free Shipping",
      description: "Free delivery on orders over ₹999. Fast and secure shipping worldwide with real-time tracking.",
      color: "#10b981",
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure Payment",
      description: "100% secure payment processing with multiple payment options including UPI, cards, and wallets.",
      color: "#3b82f6",
    },
    {
      icon: SparklesIcon,
      title: "Quality Guarantee",
      description: "All products come with quality guarantee and easy 30-day return policy with hassle-free refunds.",
      color: "#f59e0b",
    },
    {
      icon: HeartIcon,
      title: "Customer Love",
      description: "Join millions of satisfied customers who trust SmartMart for their shopping needs.",
      color: "#ef4444",
    },
  ]

  const handleAddToCart = (product) => {
    add(product)
    // Add toast notification or animation here
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        style={{
          width: "1rem",
          height: "1rem",
          color: i < Math.floor(rating) ? "#fbbf24" : "#e5e7eb",
          fill: i < Math.floor(rating) ? "#fbbf24" : "none",
        }}
      />
    ))
  }

  return (
    <div>
      {/* Enhanced Hero Section */}
      <motion.section
        ref={heroRef}
        style={styles.hero}
        initial="hidden"
        animate={isHeroInView ? "visible" : "hidden"}
        variants={heroVariants}
      >
        {/* Animated Background Elements */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
        }}>
          <motion.div
            style={{
              position: "absolute",
              top: "10%",
              left: "5%",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
            }}
            {...floatVariants}
            transition={{ delay: 0 }}
          />
          <motion.div
            style={{
              position: "absolute",
              top: "20%",
              right: "8%",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
            }}
            {...floatVariants}
            transition={{ delay: 1 }}
          />
          <motion.div
            style={{
              position: "absolute",
              bottom: "15%",
              left: "10%",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)",
            }}
            {...floatVariants}
            transition={{ delay: 2 }}
          />
        </div>

        <div style={styles.heroContent}>
          <motion.h1
            style={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Discover Amazing
            <br />
            <span style={{ color: "#ffffff" }}>Products</span>
          </motion.h1>

          <motion.p
            style={styles.heroSubtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Shop millions of products with unbeatable prices, fast delivery,
            and exceptional customer service. Your satisfaction is our priority.
          </motion.p>

          <motion.div
            style={styles.heroButtons}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.button
              style={styles.primaryBtn}
              whileHover={{ scale: 1.05, boxShadow: "0 12px 35px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/products')}
            >
              <ShoppingBagIcon style={{ width: "1.2rem", height: "1.2rem" }} />
              Shop Now
            </motion.button>

            <motion.button
              style={styles.secondaryBtn}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/categories')}
            >
              <EyeIcon style={{ width: "1.2rem", height: "1.2rem" }} />
              Explore Categories
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Stats Section */}
      <motion.section
        ref={statsRef}
        style={styles.statsSection}
        initial="hidden"
        animate={isStatsInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div style={styles.statsGrid} variants={containerVariants}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              style={{
                ...styles.statCard,
                background: `linear-gradient(135deg, ${currentTheme.surface} 0%, rgba(255,255,255,0.1) 100%)`,
              }}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 20px 40px ${currentTheme.shadow}`,
                transition: { duration: 0.3 }
              }}
            >
              <motion.div
                style={{
                  ...styles.statIcon,
                  background: stat.gradient,
                }}
                {...pulseVariants}
              >
                <stat.icon style={{ width: "2rem", height: "2rem", color: "#ffffff" }} />
              </motion.div>
              <div style={styles.statNumber}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Enhanced Categories Section */}
      <motion.section
        ref={categoriesRef}
        style={styles.categoriesSection}
        initial="hidden"
        animate={isCategoriesInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div style={styles.categoriesHeader} variants={itemVariants}>
          <h2 style={styles.categoriesTitle}>Shop by Category</h2>
          <p style={styles.categoriesSubtitle}>
            Explore our wide range of categories and find exactly what you're looking for
          </p>
        </motion.div>

        <motion.div style={styles.categoriesGrid} variants={containerVariants}>
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              style={{
                ...styles.categoryCard,
                background: hoveredCategory === category.id
                  ? `linear-gradient(135deg, ${category.gradient} 0%, rgba(255,255,255,0.1) 100%)`
                  : currentTheme.surface,
              }}
              variants={itemVariants}
              onHoverStart={() => setHoveredCategory(category.id)}
              onHoverEnd={() => setHoveredCategory(null)}
              whileHover={{
                scale: 1.03,
                boxShadow: `0 20px 40px ${currentTheme.shadow}`,
                transition: { duration: 0.3 }
              }}
              onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
            >
              <motion.div
                style={{
                  ...styles.categoryImage,
                  background: category.gradient,
                }}
                animate={hoveredCategory === category.id ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span style={{ fontSize: "3rem", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}>
                  {category.icon}
                </span>
                <motion.div
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    right: "1rem",
                    background: "rgba(255,255,255,0.9)",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#2d3748",
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={hoveredCategory === category.id ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  {category.itemCount}
                </motion.div>
              </motion.div>

              <div style={styles.categoryContent}>
                <h3 style={styles.categoryTitle}>{category.name}</h3>
                <p style={styles.categoryDesc}>{category.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Enhanced Deals Section */}
      <motion.section
        ref={dealsRef}
        style={styles.dealsSection}
        initial="hidden"
        animate={isDealsInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Animated Background */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }} />

        <motion.div style={styles.dealsHeader} variants={itemVariants}>
          <h2 style={styles.dealsTitle}>
            🔥 Hot Deals
          </h2>
          <p style={styles.dealsSubtitle}>
            Limited time offers on premium products. Don't miss out on these amazing deals!
          </p>
        </motion.div>

        <motion.div style={styles.productsGrid} variants={containerVariants}>
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              style={styles.productCard}
              variants={itemVariants}
              onHoverStart={() => setHoveredProduct(product.id)}
              onHoverEnd={() => setHoveredProduct(null)}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                transition: { duration: 0.3 }
              }}
            >
              <div style={styles.productImage}>
                <motion.span
                  style={{ fontSize: "4rem", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
                  animate={hoveredProduct === product.id ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {product.icon}
                </motion.span>

                {product.badge && (
                  <motion.div
                    style={styles.productBadge}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {product.badge}
                  </motion.div>
                )}

                {product.discount && (
                  <motion.div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      background: "#ff4757",
                      color: "#ffffff",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "15px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    -{product.discount}
                  </motion.div>
                )}
              </div>

              <div style={styles.productContent}>
                <h3 style={styles.productTitle}>{product.name}</h3>

                <div style={styles.productRating}>
                  <div style={styles.stars}>
                    {renderStars(product.rating)}
                  </div>
                  <span style={styles.ratingText}>
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <span style={styles.productPrice}>₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span style={{
                      textDecoration: "line-through",
                      color: "#a0aec0",
                      fontSize: "0.9rem",
                    }}>
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div style={styles.productActions}>
                  <motion.button
                    style={styles.addToCartBtn}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCartIcon style={{ width: "1rem", height: "1rem" }} />
                    Add to Cart
                  </motion.button>

                  <motion.button
                    style={styles.wishlistBtn}
                    whileHover={{ scale: 1.05, backgroundColor: "#fef5e7" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <HeartIcon style={{ width: "1rem", height: "1rem" }} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Enhanced Testimonials Section */}
      <motion.section
        ref={testimonialsRef}
        style={styles.testimonialsSection}
        initial="hidden"
        animate={isTestimonialsInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div style={styles.testimonialsHeader} variants={itemVariants}>
          <h2 style={styles.testimonialsTitle}>What Our Customers Say</h2>
        </motion.div>

        <motion.div style={styles.testimonialsGrid} variants={containerVariants}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              style={styles.testimonialCard}
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                boxShadow: `0 20px 40px ${currentTheme.shadow}`,
                transition: { duration: 0.3 }
              }}
            >
              <div style={styles.testimonialQuote}>
                "{testimonial.text}"
              </div>

              <div style={styles.testimonialAuthor}>
                <div style={styles.testimonialAvatar}>
                  {testimonial.avatar}
                </div>
                <div style={styles.testimonialInfo}>
                  <div style={styles.testimonialName}>
                    {testimonial.name}
                    {testimonial.verified && (
                      <ShieldCheckIcon style={{
                        width: "1rem",
                        height: "1rem",
                        color: "#10b981",
                        marginLeft: "0.5rem",
                        display: "inline",
                      }} />
                    )}
                  </div>
                  <div style={styles.testimonialRole}>{testimonial.role}</div>
                  <div style={styles.testimonialRating}>
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Enhanced Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              style={styles.featureCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 20px 40px ${currentTheme.shadow}`,
                transition: { duration: 0.3 }
              }}
            >
              <motion.div
                style={{
                  ...styles.featureIcon,
                  background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}dd 100%)`,
                }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon style={{ width: "2rem", height: "2rem" }} />
              </motion.div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDesc}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section style={styles.ctaSection}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }} />

        <motion.div
          style={styles.ctaContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={styles.ctaTitle}>Ready to Start Shopping?</h2>
          <p style={styles.ctaText}>
            Join millions of satisfied customers and experience the best online shopping platform.
            Fast delivery, secure payments, and exceptional customer service await you.
          </p>
          <motion.button
            style={styles.ctaButton}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 12px 35px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
          >
            <BoltIcon style={{ width: "1.2rem", height: "1.2rem" }} />
            Get Started Today
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}