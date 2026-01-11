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
        console.log('Starting debug walk sequence at speed:', speed)

        for (let i = 0; i < 5; i++) {
            console.log(`Debug walk cycle ${i + 1}/5`)
            await playActionOnce(actions['walk40frame'], speed)
        }

        console.log('Debug walk sequence complete')
    }
}
