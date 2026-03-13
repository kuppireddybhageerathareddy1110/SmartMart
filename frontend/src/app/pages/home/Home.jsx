import { useState, useRef, Suspense, lazy } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  ShoppingBagIcon, SparklesIcon, TruckIcon, ShieldCheckIcon,
  ArrowRightIcon, StarIcon, BoltIcon,
  ComputerDesktopIcon, DevicePhoneMobileIcon, HomeIcon,
  BeakerIcon, MusicalNoteIcon, BriefcaseIcon, SunIcon, VariableIcon
} from "@heroicons/react/24/outline"

import ThreeHero from "./ThreeHero"

export default function Home() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })

  // Parallax Effects
  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, 200])
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const saleScale = useTransform(scrollYProgress, [0.1, 0.4], [0.8, 1])

  return (
    <div ref={containerRef} style={{ overflow: "hidden" }}>

      {/* HER0 SECTION */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "0 20px"
      }}>
        {/* 3D Background */}
        {/* 3D Background */}
        <ThreeHero />

        <motion.div
          style={{ y: yHero, opacity: opacityHero, zIndex: 2, textAlign: "center", maxWidth: "900px" }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              background: "linear-gradient(90deg, #6c5ce7, #fd79a8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 800,
              letterSpacing: "4px",
              marginBottom: "20px",
              display: "inline-block"
            }}
          >
            FUTURE OF SHOPPING
          </motion.div>

          <h1 style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            lineHeight: 1,
            marginBottom: "30px",
            letterSpacing: "-2px"
          }}>
            Experience the <br />
            <span style={{ color: "var(--primary)" }}>Impossible.</span>
          </h1>

          <p style={{ fontSize: "1.2rem", color: "var(--text-muted)", marginBottom: "50px", maxWidth: "600px", margin: "0 auto 50px auto" }}>
            Discover a curated collection of premium products delivered with warp-speed logistics and secured by quantum-grade encryption.
          </p>

          <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
            <motion.button
              className="btn-primary"
              style={{ padding: "16px 40px", fontSize: "1.2rem", borderRadius: "50px" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/products")}
            >
              Shop Now
            </motion.button>
            <motion.button
              className="glass-panel"
              style={{ padding: "16px 40px", fontSize: "1.2rem", borderRadius: "50px", cursor: "pointer", fontWeight: 600, color: "var(--text-main)" }}
              whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.9)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
            >
              Join Us
            </motion.button>
          </div>
        </motion.div>

        {/* Floating Elements 3D */}
        <FloatingElement top="15%" left="5%" delay={0} icon={<ShoppingBagIcon width={40} />} />
        <FloatingElement top="25%" right="10%" delay={1} icon={<SparklesIcon width={40} />} />
        <FloatingElement bottom="20%" left="15%" delay={2} icon={<BoltIcon width={40} />} />
      </section>

      {/* FEATURES SCROLL */}
      <section style={{ padding: "100px 20px" }}>
        <div className="container">
          <div className="grid">
            <FeatureCard
              title="Instant Delivery"
              desc="Get your products delivered in under 24 hours."
              icon={<TruckIcon width={32} />}
            />
            <FeatureCard
              title="Secure & Safe"
              desc="Bank-grade encryption for all transactions."
              icon={<ShieldCheckIcon width={32} />}
            />
            <FeatureCard
              title="Premium Quality"
              desc="Hand-picked items verified by experts."
              icon={<StarIcon width={32} />}
            />
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section style={{ padding: "50px 20px 100px" }}>
        <div className="container">
          <motion.h2
            style={{ fontSize: "3rem", textAlign: "center", marginBottom: "50px" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Shop by Category
          </motion.h2>

          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px" }}>
            {[
              { name: "Groceries", icon: <ShoppingBagIcon width={60} />, color: "#00b894" },
              { name: "Electronics", icon: <ComputerDesktopIcon width={60} />, color: "#0984e3" },
              { name: "Fashion", icon: <SparklesIcon width={60} />, color: "#e84393" },
              { name: "Toys", icon: <VariableIcon width={60} />, color: "#fdcb6e" },
              { name: "Beauty", icon: <StarIcon width={60} />, color: "#6c5ce7" },
              { name: "Home", icon: <HomeIcon width={60} />, color: "#00cec9" },
              { name: "Music", icon: <MusicalNoteIcon width={60} />, color: "#d63031" },
              { name: "Office", icon: <BriefcaseIcon width={60} />, color: "#636e72" }
            ].map((cat, i) => (
              <CategoryCard key={cat.name} category={cat} index={i} onClick={() => navigate(`/products?category=${cat.name === 'Home' ? 'Home & Garden' : cat.name}`)} />
            ))}
          </div>
        </div>
      </section>

      {/* BIG SALE BANNER */}
      <motion.section
        style={{ scale: saleScale, padding: "100px 20px" }}
      >
        <div className="glass-card" style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
          padding: "80px 20px",
          background: "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)",
          color: "white"
        }}>
          <h2 style={{ fontSize: "4rem", marginBottom: "20px" }}>50% OFF</h2>
          <p style={{ fontSize: "1.5rem", marginBottom: "40px", opacity: 0.9 }}>On all electronics this weekend. Don't miss out.</p>
          <motion.button
            style={{
              background: "white",
              color: "#6c5ce7",
              padding: "20px 60px",
              fontSize: "1.5rem",
              borderRadius: "12px",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer"
            }}
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate("/products")}
          >
            Grab Deal <ArrowRightIcon width={24} style={{ display: "inline", verticalAlign: "middle" }} />
          </motion.button>
        </div>
      </motion.section>

    </div>
  )
}

function FloatingElement({ top, left, right, bottom, delay, icon }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        top, left, right, bottom,
        zIndex: 1,
      }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0]
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    >
      <div className="glass-panel" style={{
        padding: "20px",
        borderRadius: "20px",
        color: "var(--primary)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.1)"
      }}>
        {icon}
      </div>
    </motion.div>
  )
}

function FeatureCard({ title, desc, icon }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      className="glass-card"
      style={{ textAlign: "center", padding: "40px 20px" }}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -10 }}
    >
      <div style={{
        width: "80px",
        height: "80px",
        background: "var(--bg-gradient)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
        color: "var(--primary)"
      }}>
        {icon}
      </div>
      <h3 style={{ marginBottom: "10px" }}>{title}</h3>
      <p style={{ color: "var(--text-muted)" }}>{desc}</p>
    </motion.div>
  )
}

function CategoryCard({ category, index, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      className="glass-card"
      style={{
        width: "160px",
        height: "160px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        background: "rgba(255, 255, 255, 0.05)"
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.1, background: "rgba(255, 255, 255, 0.1)" }}
      whileTap={{ scale: 0.95 }}
    >
      <div style={{ marginBottom: "10px", color: category.color || "var(--primary)" }}>{category.icon}</div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>{category.name}</h3>
    </motion.div>
  )
}
