/**
 * Simple 3x Walk Loop - Root Motion Test
 * Tests root-baked walking animation with 3 smooth cycles (no start/stop)
 */
import { playActionOnce } from './utils'

export default {
    name: 'Simple 3x Walk Loop',
    description: 'Pure 3x walking_RootBaked cycles. Tests root motion accumulation.',
    glb: '/models/Master_start_walk_stop_root-animation_110126.glb',  // Your transformed GLB
    initialPosition: [0, 0, 0],
    scale: 1.5,
    actions: ['walking_RootBaked'],  // Exact name from your GLB

    sequence: async (actions, speed = 1.0) => {
        console.log('=== Simple 3x Walk Root Motion Test ===')
        console.log('GLB:', this.glb)
        console.log('Actions:', Object.keys(actions))

        // 3 smooth walk loops (root motion accumulates)
        for (let i = 0; i < 3; i++) {
            console.log(`Walk loop ${i + 1}/3...`)
            await playActionOnce(actions['walking_RootBaked'], speed)
        }

        console.log('✓ 3x walk complete - check model displacement!')
        const rootPos = actions['walking_RootBaked']?.getRoot()?.position
        console.log('Final root position:', rootPos)
    }
}
