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

    // Map of per-action speed overrides
    speedMap: {},

    // Currently active action data (name and speed override)
    activeAction: { name: null, speedOverride: null },

    // Actions
    setAnimations: (animations) => set({ animations }),

    setCurrent: (animation) => set({ current: animation, activeAction: { name: null, speedOverride: null }, speedMap: {} }),

    toggleManualMode: () => set((state) => ({ isManualMode: !state.isManualMode })),

    setSpeed: (speed) => set({ speed: Math.max(0.1, Math.min(2.0, speed)) }),

    setActionSpeed: (name, speed) => set((state) => ({
        speedMap: { ...state.speedMap, [name]: speed }
    })),

    setPlayingAction: (actionName) => set({ playingAction: actionName }),

    setActiveAction: (name, speedOverride = null) => set({
        activeAction: { name, speedOverride },
        playingAction: name
    }),

    // Get current animation by name
    getAnimationByName: (name) => {
        const state = get()
        return state.animations.find(anim => anim.name === name)
    }
}))
