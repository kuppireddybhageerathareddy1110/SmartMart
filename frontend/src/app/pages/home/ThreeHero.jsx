import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei"
import { useRef, useState } from "react"

function AnimatedSphere() {
    const mesh = useRef(null)

    useFrame((state) => {
        if (mesh.current) {
            // Subtle rotation
            mesh.current.rotation.x = state.clock.getElapsedTime() * 0.2
            mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3
        }
    })

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <Sphere ref={mesh} visible args={[1, 100, 200]} scale={2}>
                <MeshDistortMaterial
                    color="#6c5ce7"
                    attach="material"
                    distort={0.4}
                    speed={1.5}
                    roughness={0.2}
                    metalness={0.9}
                />
            </Sphere>
        </Float>
    )
}

function SecondarySphere({ position, color, scale }) {
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <Sphere position={position} scale={scale}>
                <MeshDistortMaterial
                    color={color}
                    distort={0.3}
                    speed={2}
                    roughness={0.4}
                />
            </Sphere>
        </Float>
    )
}

export default function ThreeHero() {
    return (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#fd79a8" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* Main Hero Object */}
                <group position={[2, 0, 0]}>
                    <AnimatedSphere />
                </group>

                {/* Floating Accents */}
                <SecondarySphere position={[-3, 2, -2]} color="#00cec9" scale={0.5} />
                <SecondarySphere position={[-2, -2, 0]} color="#fd79a8" scale={0.3} />

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    )
}
