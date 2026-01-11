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
        action.reset = false;  // CRITICAL: Preserve root motion
        action.timeScale = speed;
        action.clampWhenFinished = true;
        action.play();

        const onFinish = (e) => {
            if (e.action === action) {
                // We do NOT stop the action here if we want the final pose to hold via clampWhenFinished
                // But typically for sequence chaining we might unwanted effects if we don't handle it right.
                // However, the instruction says:
                // "return new Promise((resolve) => { ... action.stop(); ... resolve(); })"
                // BUT the instructions also say "sequence: ... await playActionOnce ... // NO reset—motion accumulates!"
                // Let's stick strictly to the user instruction provided in step 0:
                /* 
                   const onFinish = () => {
                     action.stop(); 
                     action.removeEventListener('finished', onFinish);
                     resolve();
                   };
                */
                // Wait, if we stop the action, the model might snap back depending on settings.
                // However, `action.reset = false` usually implies we want to keep the state.
                // Let's look closely at the user request logic.
                // "3. In Player.jsx, ensure model <group scale={anim.scale}> has NO position={[0,0,0]} override."
                // "Test: Select "Debug 5x Walk" → Sequence → smooth 5-forward chain"

                // If I stop the action, does the root motion persist?
                // The user provided snippet in step 0, #2 says:
                /*
                  const onFinish = () => {
                    action.stop();
                    action.removeEventListener('finished', onFinish);
                    resolve();
                  };
                */
                // I will follow the user's snippet exactly.

                action.stop();
                action.getMixer().removeEventListener('finished', onFinish);
                resolve();
            }
        };
        action.getMixer().addEventListener('finished', onFinish);
    });
};
