/**
 * Robot In-Place Animation Sequence
 * 
 * Flow: Walk Start -> 4x Walk loops -> Walk Stop -> Settle into Idle
 */
import { playAction } from './utils'

const config = {
    name: 'Robot In-Place Test',
    description: 'Sequence: Start -> 4x Walk -> Stop -> Idle. Includes smooth per-action speeds.',
    glb: '/models/robot_inPlace.glb',
    initialPosition: [0, 0, 0],
    scale: 1.0,
    actions: [
        'robot_warrior_idle_inPlace',
        'robot_start_walking_inPlace',
        'robot_walking_inPlace',
        'robot_stop_walking_inPlace'
    ],

    sequence: async (actions, speed = 1.0) => {
        console.log('=== Robot In-Place Sequence Started ===')

        try {
            // 1. Walk Start (Fixed speed)
            if (actions['robot_start_walking_inPlace']) {
                await playAction(actions['robot_start_walking_inPlace'], 0.8)
            }

            // 2. Walk for 4 cycles (Slower walk speed)
            if (actions['robot_walking_inPlace']) {
                console.log('Starting 4x Walk cycles...')
                for (let i = 0; i < 4; i++) {
                    console.log(` Walk cycle ${i + 1}/4`)
                    await playAction(actions['robot_walking_inPlace'], 0.6)
                }
            }

            // 3. Walk Stop (Fixed speed)
            if (actions['robot_stop_walking_inPlace']) {
                await playAction(actions['robot_stop_walking_inPlace'], 0.8)
            }

            // 4. Settle into Idle
            if (actions['robot_warrior_idle_inPlace']) {
                await playAction(actions['robot_warrior_idle_inPlace'], 1.0)
            }

            console.log('✓ Robot sequence complete!')
        } catch (err) {
            console.error('Sequence interrupted:', err)
        }
    }
}

export default config
