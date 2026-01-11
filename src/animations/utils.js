/**
 * Animation Utilities
 */

/**
 * Helper to play an action and wait for it to complete
 * @param {THREE.AnimationAction} action - The animation action to play
 * @param {number} speed - Playback speed multiplier
 * @returns {Promise} Resolves when animation completes
 */
export const playActionOnce = (action, speed = 1.0) => {
    return new Promise((resolve) => {
        if (!action) {
            console.warn('Action not found')
            resolve()
            return
        }

        // Configure for single play
        action.clampWhenFinished = true
        action.loop = 2200 // THREE.LoopOnce (corresponds to THREE.LoopOnce in Three.js)
        action.timeScale = speed
        action.reset()
        action.play()

        // Calculate duration based on clip length and speed
        const duration = (action.getClip().duration / speed) * 1000

        setTimeout(() => {
            resolve()
        }, duration)
    })
}
