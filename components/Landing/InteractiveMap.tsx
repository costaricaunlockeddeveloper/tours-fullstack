"use client";
import React, { Suspense, useState, useCallback, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Html } from "@react-three/drei";
import { Mesh, Vector3, Raycaster, Box3 } from "three";
import { ApiService, Place } from "@/services/api-service";

// Coordenadas límites para el mapeo (Costa Rica)
const LNG_MIN = -84.01845893372125;
const LNG_MAX = -81.92028806117499;
const LAT_MAX = 9.448904954935871;
const LAT_MIN = 8.057571343207774;

function Model({ setBounds, sceneRef }: any) {
    const { scene } = useGLTF("/prueba.glb");
    useEffect(() => {
        if (scene) {
            sceneRef.current = scene;

            // Calculamos el box solo considerando los Meshes para evitar que luces o cámaras afecten el tamaño
            const box = new Box3();
            scene.traverse((obj) => {
                if ((obj as Mesh).isMesh) {
                    box.expandByObject(obj);
                }
            });

            const center = new Vector3();
            box.getCenter(center);
            const size = new Vector3();
            box.getSize(size);

            console.log("Model Bounds Calculated:", {
                min: box.min,
                max: box.max,
                center: center,
                size: size
            });

            setBounds({
                minX: box.min.x, maxX: box.max.x,
                minZ: box.min.z, maxZ: box.max.z,
                maxY: box.max.y, minY: box.min.y,
                width: size.x,
                depth: size.z,
                centerX: center.x,
                centerZ: center.z,
                centerY: center.y
            });
        }
    }, [scene, setBounds, sceneRef]);
    return <primitive object={scene} />;
}

export function InteractiveMap() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [mappedPins, setMappedPins] = useState<any[]>([]);
    const [modelBounds, setModelBounds] = useState<any>(null);
    const sceneRef = useRef<any>(null);

    // 1. Cargar destinos registrados
    useEffect(() => {
        const load = async () => {
            try {
                const data = await ApiService.getPlaces();
                const filtered = data.filter(p => p.coordinates?.lat && p.coordinates?.lng);
                console.log("Loaded places with coordinates:", filtered.length);
                setPlaces(filtered);
            } catch (e) {
                console.error("Error loading destinations:", e);
            }
        }; load();
    }, []);

    // 2. Mapear coordenadas (Lógica de sincronización corregida)
    useEffect(() => {
        if (!modelBounds || !sceneRef.current || places.length === 0) return;

        console.log("Mapping pins with bounds:", modelBounds);

        const results = places.map(place => {
            const { lat, lng } = place.coordinates!;

            // Normalización de coordenadas GPS a porcentajes (0-1) dentro del área de la caja
            const xPercent = (lng - LNG_MIN) / (LNG_MAX - LNG_MIN);
            const zPercent = (LAT_MAX - lat) / (LAT_MAX - LAT_MIN);

            // Coordenadas en el espacio local del modelo (antes de centrar)
            const x3D_target = modelBounds.minX + (xPercent * modelBounds.width);
            const z3D_target = modelBounds.minZ + (zPercent * modelBounds.depth);

            // Raycast desde arriba para encontrar la "tierra" (Y)
            // Elevamos el origen lo suficiente para estar por encima de cualquier montaña
            const origin = new Vector3(x3D_target, modelBounds.maxY + 50000, z3D_target);
            const direction = new Vector3(0, -1, 0);
            const raycaster = new Raycaster(origin, direction);

            // Precisión del raycaster para terrenos complejos
            raycaster.params.Mesh = { threshold: 10 };
            const intersects = raycaster.intersectObject(sceneRef.current, true);

            if (intersects.length > 0) {
                const hit = intersects[0].point;

                // La posición final debe compensar el desplazamiento del componente <Center />
                // <Center /> mueve el objeto a (0,0,0) restando su `center` calculado.
                const finalPosition: [number, number, number] = [
                    hit.x - modelBounds.centerX,
                    hit.y - modelBounds.centerY,
                    hit.z - modelBounds.centerZ
                ];

                console.log(`Pin mapped: ${place.name}`, {
                    gps: { lat, lng },
                    percents: { x: xPercent, z: zPercent },
                    worldHit: hit,
                    centeredPos: finalPosition
                });

                return {
                    id: place.id || place.name,
                    label: place.name,
                    position: finalPosition
                };
            } else {
                console.warn(`No intersection found for ${place.name} at`, { x3D_target, z3D_target });
            }
            return null;
        }).filter(p => p !== null);

        setMappedPins(results);
    }, [modelBounds, places]);

    return (
        <div className="h-[600px] w-full bg-gray-100 relative">
            <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 80000, 80000], fov: 50, near: 1000, far: 2000000 }}
                gl={{ antialias: true }}
            >
                <Suspense fallback={null}>
                    {/* Estética original: Iluminación suave */}
                    <ambientLight intensity={0.6} />
                    <hemisphereLight args={["#b1e1ff", "#b97a20", 0.8]} />
                    <directionalLight position={[10000, 10000, 10000]} intensity={1} />

                    <Center>
                        <Model setBounds={setModelBounds} sceneRef={sceneRef} />
                    </Center>

                    {/* Los pines Renderizados FUERA del Center porque ya tenemos sus coordenadas mundiales centradas */}
                    {mappedPins.map((pin) => (
                        <group key={pin.id} position={pin.position}>
                            <group position={[0, 500, 0]}>
                                <mesh position={[0, 1000, 0]}>
                                    <sphereGeometry args={[600, 16, 16]} />
                                    <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
                                </mesh>
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
