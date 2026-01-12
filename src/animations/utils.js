/**
 * Play a single action once returning a promise that resolves when it finishes.
 * critically, this does NOT reset the action, allowing root motion to accumulate.
 * 
 * @param {THREE.AnimationAction} action 
 * @param {number} speed 
 * @returns {Promise<void>}
 */
export const playActionOnce = (action, speed = 1.0) => {
  return new Promise((resolve) => {
    action.reset = false;  // PRESERVE root motion!
    action.timeScale = speed;
    action.clampWhenFinished = true;
    action.loop = 2200; // THREE.LoopOnce. Using literal to avoid import dependency if not available

    // In some versions of three, LoopOnce is the default or accessible via constants.
    // If you have THREE imported, use THREE.LoopOnce.
    if (typeof action.setLoop === 'function') {
      // action.setLoop(1, 1); // LoopOnce
    }

    action.play();

    const onFinish = () => {
      action.removeEventListener('finished', onFinish);
      // Resolve first so caller can read final bone positions
      resolve();
      // Note: caller should call action.stop() if they want to reset for next cycle
      // we don't call it here to allow root motion capture
    };
    action.addEventListener('finished', onFinish);
  });
};
