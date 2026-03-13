import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [cursorVariant, setCursorVariant] = useState("default")

    useEffect(() => {
        const mouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            })
        }

        window.addEventListener("mousemove", mouseMove)

        return () => {
            window.removeEventListener("mousemove", mouseMove)
        }
    }, [])

    const variants = {
        default: {
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            backgroundColor: "rgba(255, 255, 255, 1)",
            mixBlendMode: "difference"
        },
        text: {
            height: 150,
            width: 150,
            x: mousePosition.x - 75,
            y: mousePosition.y - 75,
            backgroundColor: "rgba(255, 255, 255, 1)",
            mixBlendMode: "difference"
        }
    }

    return (
        <motion.div
            className="custom-cursor"
            variants={variants}
            animate={cursorVariant}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                height: 32,
                width: 32,
                borderRadius: "50%",
                pointerEvents: "none",
                zIndex: 9999
            }}
        />
    )
}
