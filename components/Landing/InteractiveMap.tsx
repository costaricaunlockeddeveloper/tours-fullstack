"use client";
import React, { Suspense, useState, useCallback, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Html } from "@react-three/drei";
import { Mesh } from "three";

import { ApiService, MapPin } from "@/services/api-service";

function Model() {
    const { scene } = useGLTF("/prueba.glb");

    // Setup materials without shadows for better GPU performance
    useEffect(() => {
        scene.traverse((child) => {
            if ((child as Mesh).isMesh) {
                // Shadows removed to reduce GPU pressure
            }
        });

        return () => {
            // Dispose geometries and materials on unmount
            scene.traverse((child) => {
                if ((child as Mesh).isMesh) {
                    const mesh = child as Mesh;
                    mesh.geometry?.dispose();
                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach((m) => m.dispose());
                    } else {
                        mesh.material?.dispose();
                    }
                }
            });
        };
    }, [scene]);

    return (
        <primitive object={scene} />
    );
}

// Helper component to detect WebGL context loss from inside the Canvas
function ContextLossDetector({ onContextLost }: { onContextLost: () => void }) {
    const { gl } = useThree();

    useEffect(() => {
        const canvas = gl.domElement;
        const handleLost = (e: Event) => {
            e.preventDefault();
            console.warn("WebGL context lost");
            onContextLost();
        };
        canvas.addEventListener("webglcontextlost", handleLost);
        return () => {
            canvas.removeEventListener("webglcontextlost", handleLost);
        };
    }, [gl, onContextLost]);

    return null;
}

export function InteractiveMap() {
    const [pins, setPins] = React.useState<MapPin[]>([]);
    const [contextLost, setContextLost] = useState(false);

    const handleContextLost = useCallback(() => {
        setContextLost(true);
    }, []);

    const handleReload = useCallback(() => {
        setContextLost(false);
    }, []);

    React.useEffect(() => {
        const fetchPins = async () => {
            try {
                const data = await ApiService.getMapPins();
                setPins(data);
            } catch (error) {
                console.error("Failed to load map pins:", error);
            }
        };
        fetchPins();
    }, []);

    // If context was lost, show a recovery overlay
    if (contextLost) {
        return (
            <div className="h-[600px] w-full bg-gray-100 relative flex items-center justify-center">
                <div className="text-center p-8">
                    <p className="text-lg text-gray-600 mb-4">
                        The 3D map lost its GPU connection.
                    </p>
                    <button
                        onClick={handleReload}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Reload Map
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[600px] w-full bg-gray-100 relative">
            <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 80000, 80000], fov: 50, near: 1000, far: 1000000 }}
                gl={{
                    powerPreference: "default",
                    failIfMajorPerformanceCaveat: false,
                    antialias: false,
                }}
            >
                <ContextLossDetector onContextLost={handleContextLost} />

                <Suspense fallback={null}>
                    {/* Lightweight lighting — no HDR environment map */}
                    <ambientLight intensity={0.6} />
                    <hemisphereLight args={["#b1e1ff", "#b97a20", 0.8]} />
                    <directionalLight position={[10000, 10000, 10000]} intensity={1} />

                    <Center>
                        <Model />
                    </Center>

                    {pins.map((pin) => (
                        <group key={pin.id} position={pin.position}>
                            {/* Pin Icon Construction */}
                            <group position={[0, 500, 0]}>
                                {/* Pin Head */}
                                <mesh position={[0, 1000, 0]}>
                                    <sphereGeometry args={[600, 16, 16]} />
                                    <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
                                </mesh>
                                {/* Pin Point (Cone) */}
                                <mesh position={[0, 500, 0]}>
                                    <coneGeometry args={[200, 1200, 16]} />
                                    <meshStandardMaterial color="#cc0000" />
                                </mesh>
                            </group>

                            <Html distanceFactor={50000} position={[0, 2500, 0]} style={{ pointerEvents: 'none' }}>
                                <div className="p-[3px] rounded-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 shadow-2xl transform -translate-x-1/2 -translate-y-full">
                                    <div className="bg-white/95 text-black px-4 py-2 rounded-[9px] text-lg font-bold backdrop-blur-sm whitespace-nowrap">
                                        {pin.label}
                                    </div>
                                </div>
                            </Html>
                        </group>
                    ))}
                </Suspense>
                <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enableZoom={true} enablePan={true} />
            </Canvas>
            <div className="absolute bottom-4 left-4 rounded bg-white/80 p-2 text-sm text-black backdrop-blur">
                Mouse: Girar/Acercar/Alejar
            </div>
        </div>
    );
}
