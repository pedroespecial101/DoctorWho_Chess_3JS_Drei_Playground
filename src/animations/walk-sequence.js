/**
 * Walk Sequence Animation Definition
 * Uses the Master_start_walk–stop_2.glb model with walk_start, walk40frame, walk_stop animations
 */

/**
 * Helper to play an action and wait for it to complete
 * @param {THREE.AnimationAction} action - The animation action to play
 * @param {number} speed - Playback speed multiplier
 * @returns {Promise} Resolves when animation completes
 */
const playActionOnce = (action, speed = 1.0) => {
    return new Promise((resolve) => {
        if (!action) {
            console.warn('Action not found')
            resolve()
            return
        }

        // Configure for single play
        action.clampWhenFinished = true
        action.loop = 2200 // THREE.LoopOnce
        action.timeScale = speed
        action.reset()
        action.play()

        // Calculate duration based on clip length and speed
        const duration = (action.getClip().duration / speed) * 1000
        console.log(`Playing action: ${action.getClip().name}, Duration: ${duration.toFixed(0)}ms`)

        setTimeout(() => {
            resolve()
        }, duration)
    })
}

export default {
    name: 'Three Walk Loops',
    description: 'Walk start → 3x walk cycle → walk stop',
    glb: '/models/Master_start_walk–stop_2.glb',
    initialPosition: [0, 0, 0],
    scale: 1.5,

    /**
     * Available actions in this GLB for manual mode
     */
    actions: ['walk_start', 'walk40frame', 'stop_walking'],

    /**
     * Programmed sequence - plays walk_start, then 3 walk cycles, then walk_stop
     * @param {Object} actions - Object containing all animation actions from useAnimations
     * @param {number} speed - Current playback speed from store
     */
    sequence: async (actions, speed = 1.0) => {
        console.log('Starting walk sequence at speed:', speed)

        // Play walk start
        await playActionOnce(actions['walk_start'], speed)

        // Play 3 walk cycles
        for (let i = 0; i < 3; i++) {
            console.log(`Walk cycle ${i + 1}/3`)
            await playActionOnce(actions['walk40frame'], speed)
        }

        // Play stop walking
        await playActionOnce(actions['stop_walking'], speed)

        console.log('Walk sequence complete')
    },

    /**
     * Optional callback after model loads
     */
    onLoad: (model) => {
        console.log('Walk sequence model loaded:', model)
    }
}
