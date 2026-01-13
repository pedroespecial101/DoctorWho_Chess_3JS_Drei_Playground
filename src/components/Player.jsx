import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, useAnimations, Environment } from '@react-three/drei'
import { Grid } from './Grid'
import { useAnimationStore } from '../store/animationStore'

const defaultModel = '/models/Master_start_walk–stop_2.glb'
useGLTF.preload(defaultModel, true) // Enable draco

/**
 * Simple hook to track previous value
 */
function usePrevious(value) {
    const ref = useRef()
    useEffect(() => {
        ref.current = value
    }, [value])
    return ref.current
}

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
    const { activeAction, speed, speedMap, current } = useAnimationStore()
    const previousName = usePrevious(activeAction.name)

    // Handle reactive Transitions
    useEffect(() => {
        const { name, speedOverride } = activeAction

        if (name && actions[name]) {
            console.log(`Transitioning: ${previousName} -> ${name}`)

            if (previousName && actions[previousName]) {
                actions[previousName].fadeOut(0.2)
            }

            const nextAction = actions[name]

            // Calculate effective speed for this action
            // Priority: 1. speedOverride (from call), 2. speedMap (from config), 3. global configSpeed, 4. global UI speed
            const actionTargetSpeed = speedOverride || speedMap[name] || current?.configSpeed || 1.0
            const effectiveSpeed = speed * actionTargetSpeed

            nextAction.reset()
            nextAction.stop()
            nextAction.setEffectiveTimeScale(effectiveSpeed)
            nextAction.fadeIn(0.2)
            nextAction.play()
        }
    }, [activeAction, actions, previousName, speed, speedMap, current?.configSpeed])

    // Update speeds of ALL playing animations if global speed or specific maps change
    useEffect(() => {
        if (actions) {
            Object.keys(actions).forEach(name => {
                const action = actions[name]
                if (action && action.isRunning()) {
                    const actionTargetSpeed = speedMap[name] || current?.configSpeed || 1.0
                    action.setEffectiveTimeScale(speed * actionTargetSpeed)
                }
            })
        }
    }, [speed, speedMap, actions, current?.configSpeed])

    // Notify when actions are ready
    useEffect(() => {
        if (actions && Object.keys(actions).length > 0) {
            console.log('Animation actions initialized:', names)
            onActionsReady?.(actions, names, scene, groupRef)
        }
    }, [actions, names, scene, groupRef, onActionsReady])

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

    const handleActionsReady = (actions, names, scene, groupRef) => {
        setModelActions(actions)
        onActionsReady?.(actions, names, scene, groupRef)
    }


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
