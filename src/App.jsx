import { useEffect, useState, useCallback } from 'react'
import { Player } from './components/Player'
import { Controls } from './components/Controls'
import { useAnimationRegistry } from './hooks/useAnimationRegistry'
import { useAnimationStore } from './store/animationStore'
import * as THREE from 'three'

/**
 * Main Application Component
 */
function App() {
    const { registry, loading, error } = useAnimationRegistry()
    const { setAnimations, current, speed, setPlayingAction } = useAnimationStore()
    const [modelActions, setModelActions] = useState(null)
    const [availableActions, setAvailableActions] = useState([])

    // Initialize animation registry in store
    useEffect(() => {
        if (registry.length > 0) {
            setAnimations(registry)
            console.log('Loaded animation definitions:', registry.map(a => a.name))
        }
    }, [registry, setAnimations])

    // Handle when model actions become available
    const handleActionsReady = useCallback((actions, names) => {
        setModelActions(actions)
        setAvailableActions(names)
        console.log('Model actions ready:', names)
    }, [])

    /**
     * Play a single action once
     */
    const playActionOnce = useCallback((actionName) => {
        if (!modelActions || !modelActions[actionName]) {
            console.warn(`Action "${actionName}" not found`)
            return
        }

        const action = modelActions[actionName]

        // Stop all other actions
        Object.values(modelActions).forEach(a => {
            if (a && a !== action) {
                a.fadeOut(0.2)
            }
        })

        // Configure and play
        action.reset()
        action.clampWhenFinished = true
        action.loop = THREE.LoopOnce
        action.timeScale = speed
        action.fadeIn(0.2)
        action.play()

        setPlayingAction(actionName)

        // Clear playing state after animation completes
        const duration = (action.getClip().duration / speed) * 1000
        setTimeout(() => {
            setPlayingAction(null)
        }, duration + 200)
    }, [modelActions, speed, setPlayingAction])

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
            await animDef.sequence(modelActions, speed)
            console.log('Sequence complete')
        } catch (err) {
            console.error('Sequence error:', err)
        }
    }, [modelActions, speed])

    /**
     * Play a single action in manual mode
     */
    const handlePlayAction = useCallback((actionName) => {
        playActionOnce(actionName)
    }, [playActionOnce])

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
