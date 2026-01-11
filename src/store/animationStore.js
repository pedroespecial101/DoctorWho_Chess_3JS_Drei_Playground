import { create } from 'zustand'

/**
 * Global animation state store
 * Manages animation registry, current selection, playback mode, and speed
 */
export const useAnimationStore = create((set, get) => ({
    // Registry of all loaded animation definitions
    animations: [],

    // Currently selected animation definition
    current: null,

    // Manual mode shows individual action buttons
    isManualMode: false,

    // Animation playback speed (0.1 - 2.0)
    speed: 1.0,

    // Currently playing action name (for UI highlighting)
    playingAction: null,

    // Actions
    setAnimations: (animations) => set({ animations }),

    setCurrent: (animation) => set({ current: animation }),

    toggleManualMode: () => set((state) => ({ isManualMode: !state.isManualMode })),

    setSpeed: (speed) => set({ speed: Math.max(0.1, Math.min(2.0, speed)) }),

    setPlayingAction: (actionName) => set({ playingAction: actionName }),

    // Get current animation by name
    getAnimationByName: (name) => {
        const state = get()
        return state.animations.find(anim => anim.name === name)
    }
}))
