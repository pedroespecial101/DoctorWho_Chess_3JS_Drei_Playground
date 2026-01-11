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
    action.play();

    const onFinish = () => {
      action.stop();
      action.removeEventListener('finished', onFinish);
      resolve();
    };
    action.addEventListener('finished', onFinish);
  });
};
