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
        action.loop = 2200 // THREE.LoopOnce
        action.timeScale = speed

        // AVOID .reset() entirely—use .time = 0
        action.time = 0
        action.play()

        const mixer = action.getMixer?.() || action.mixer

        if (!mixer) {
            console.warn('Mixer not found for action, resolving immediately')
            resolve()
            return
        }

        const onFinished = (e) => {
            if (e.action === action) {
                mixer.removeEventListener('finished', onFinished)
                resolve()
            }
        }
        mixer.addEventListener('finished', onFinished)
    })
}
