import { useEffect, useState, useCallback } from 'react'
import { Player } from './components/Player'
import { Controls } from './components/Controls'
import { useAnimationRegistry } from './hooks/useAnimationRegistry'
import { useAnimationStore } from './store/animationStore'

/**
 * Main Application Component
 */
function App() {
    const { registry, loading, error } = useAnimationRegistry()
    const { setAnimations, current, setCurrent, speed } = useAnimationStore()
    const [modelActions, setModelActions] = useState(null)
    const [availableActions, setAvailableActions] = useState([])
    const [scene, setScene] = useState(null)
    const [groupRef, setGroupRef] = useState(null)

    // Initialize animation registry in store
    useEffect(() => {
        if (registry.length > 0) {
            setAnimations(registry)

            // Set default animation on load
            if (!current) {
                const debugAnim = registry.find(a => a.name === 'Debug 5x Walk')
                if (debugAnim) {
                    setCurrent(debugAnim)
                } else {
                    setCurrent(registry[0])
                }
            }

            console.log('Loaded animation definitions:', registry.map(a => a.name))
        }
    }, [registry, setAnimations, setCurrent, current])


    // Handle when model actions become available
    const handleActionsReady = useCallback((actions, names, scene, groupRef) => {
        setModelActions(actions)
        setAvailableActions(names)
        setScene(scene)
        setGroupRef(groupRef)
        console.log('Model actions ready:', names)
    }, [])

    /**
     * Play the programmed sequence from the animation definition
     */
    const handlePlaySequence = useCallback(async (animDef) => {
        if (!modelActions) {
            console.warn('Model actions not ready')
            return
        }

        if (!animDef.sequence) {
            console.warn('No sequence defined for this animation')
            return
        }

        console.log('Starting sequence:', animDef.name)

        try {
            // Pass scene and groupRef to sequence callback
            await animDef.sequence(modelActions, speed, scene, groupRef)
            console.log('Sequence complete')
        } catch (err) {
            console.error('Sequence error:', err)
        }
    }, [modelActions, speed, scene, groupRef])

    /**
     * Play a single action in manual mode
     */
    const handlePlayAction = useCallback((actionName) => {
        useAnimationStore.getState().setActiveAction(actionName)
    }, [])

    if (loading) {
        return (
            <div className="app-container">
                <div className="header">
                    <h1>Doctor Who Chess - Animation Playground</h1>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    color: 'var(--text-secondary)'
                }}>
                    Loading animations...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="app-container">
                <div className="header">
                    <h1>Doctor Who Chess - Animation Playground</h1>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    color: '#ff6b6b'
                }}>
                    Error loading animations: {error}
                </div>
            </div>
        )
    }

    return (
        <div className="app-container">
            <div className="header">
                <h1>Doctor Who Chess - Animation Playground</h1>
            </div>
            <div className="main-content">
                <Player onActionsReady={handleActionsReady} />
                <Controls
                    onPlaySequence={handlePlaySequence}
                    onPlayAction={handlePlayAction}
                    availableActions={availableActions}
                />
            </div>
        </div>
    )
}

export default App
