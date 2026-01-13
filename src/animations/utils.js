import { useAnimationStore } from '../store/animationStore'

/**
 * Play an animation action with smooth transition by updating the global store.
 * This triggers the reactive transition logic in the Player component.
 * 
 * @param {THREE.AnimationAction} action The action to play
 * @param {number} speed Playback speed
 * @returns {Promise<void>} Resolves when the animation duration has passed
 */
export const playAction = (action, speed = 1.0) => {
  return new Promise((resolve) => {
    if (!action) {
      resolve();
      return;
    }

    const actionName = action.getClip().name;
    console.log(`[Sequence] Triggering: ${actionName} at speed: ${speed}`);

    const state = useAnimationStore.getState();
    const current = state.current;

    // Calculate speed logic (mirrors AnimatedModel)
    const actionTargetSpeed = speed || state.speedMap[actionName] || current?.configSpeed || 1.0;
    const effectiveSpeedForTiming = state.speed * actionTargetSpeed;

    // Update store (triggers visual change)
    state.setActiveAction(actionName, speed);

    // Wait for duration
    const totalDuration = (action.getClip().duration / effectiveSpeedForTiming) * 1000;
    setTimeout(resolve, totalDuration);
  });
};

/**
 * Legacy wrapper
 */
export const playActionOnce = (action, speed = 1.0) => {
  return playAction(action, speed);
};
