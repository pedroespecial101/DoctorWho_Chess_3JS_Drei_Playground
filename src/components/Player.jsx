import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, useAnimations, Environment } from '@react-three/drei'
import { Grid } from './Grid'
import { useAnimationStore } from '../store/animationStore'

const defaultModel = '/models/Master_start_walk–stop_2.glb'
useGLTF.preload(defaultModel, true) // Enable draco

/**
 * Animated Model Component
 * Loads a GLB and wires up animations via useAnimations hook
 */
function AnimatedModel({
    url,
    scale = 1,
    position = [0, 0, 0],
    onActionsReady,
    onLoad
}) {
    const groupRef = useRef()
    const { scene, animations } = useGLTF(url)
    const { actions, names } = useAnimations(animations, groupRef)

    // Notify when actions are ready
    useEffect(() => {
        if (actions && Object.keys(actions).length > 0) {
            console.log('Animation actions initialized:', names)
            onActionsReady?.(actions, names)
        }
    }, [actions, names, onActionsReady])

    // Notify when model is loaded/changed
    useEffect(() => {
        if (scene && onLoad) {
            onLoad(scene)
        }
    }, [scene, onLoad])

    return (
        <group ref={groupRef} position={position} scale={scale}>
            <primitive object={scene} />
        </group>
    )
}

/**
 * Loading Fallback Component
 */
function LoadingFallback() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#00b4d8" wireframe />
        </mesh>
    )
}

/**
 * Player Component
 * Main 3D canvas with model loading, animations, and controls
 */
export function Player({ onActionsReady }) {
    const { current, speed } = useAnimationStore()
    const [modelActions, setModelActions] = useState(null)

    const handleActionsReady = (actions, names) => {
        setModelActions(actions)
        onActionsReady?.(actions, names)
    }

    // Apply speed to all actions when speed changes
    useEffect(() => {
        if (modelActions) {
            Object.values(modelActions).forEach(action => {
                if (action) {
                    action.timeScale = speed
                }
            })
        }
    }, [speed, modelActions])

    return (
        <div className="canvas-container">
            <Canvas
                camera={{ position: [5, 5, 5], fov: 50 }}
                shadows
                gl={{ antialias: true }}
            >
                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                <directionalLight position={[-5, 5, -5]} intensity={0.3} />

                {/* Environment for reflections */}
                <Environment preset="city" />

                {/* Grid */}
                <Grid size={8} squareSize={1} />

                {/* Animated Model */}
                {current && (
                    <Suspense fallback={<LoadingFallback />}>
                        <AnimatedModel
                            url={current.glb}
                            scale={current.scale || 1}
                            position={current.initialPosition || [0, 0, 0]}
                            onActionsReady={handleActionsReady}
                            onLoad={current.onLoad}
                        />
                    </Suspense>
                )}

                {/* Camera Controls */}
                <OrbitControls
                    makeDefault
                    minDistance={2}
                    maxDistance={20}
                    target={[0, 1, 0]}
                />

                {/* Ground plane for shadows */}
                <mesh
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, -0.02, 0]}
                    receiveShadow
                >
                    <planeGeometry args={[20, 20]} />
                    <shadowMaterial opacity={0.3} />
                </mesh>
            </Canvas>
        </div>
    )
}

export default Player
