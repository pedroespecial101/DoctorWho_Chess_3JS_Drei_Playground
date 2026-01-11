/**
 * Debug Walk Sequence
 * Simply plays 5 walk40frame loops in a row.
 */
import { playActionOnce } from './utils'

export default {
    name: 'Debug 5x Walk',
    description: 'Simply 5 walk40frame cycles in a row for debugging',
    glb: '/models/Master_start_walk–stop_2.glb',
    initialPosition: [0, 0, 0],
    scale: 1.5,
    actions: ['walk40frame'],

    sequence: async (actions, speed = 1.0) => {
        console.log('Debug 5x walk start')

        const action = actions['walk40frame']
        if (!action) {
            console.error('Action "walk40frame" not found')
            return
        }

        // Just loop and play - no manual position hacking needed if root motion works!
        for (let i = 0; i < 5; i++) {
            console.log(`Walk ${i + 1}/5`)
            await playActionOnce(action, speed)
            // NO reset—motion accumulates!
        }

        console.log('Complete')
    }
}
