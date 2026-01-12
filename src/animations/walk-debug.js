/**
 * Debug Walk Sequence
 * Simply plays 5 walk40frame loops in a row.
 */
import { playActionOnce } from './utils'

export default {
    name: 'Debug 5x Walk',
    description: 'Simply 5 walking_RootBaked cycles in a row for debugging',
    glb: '/models/Master_start_walk_stop_root-animation_110126.glb',
    initialPosition: [0, 0, 0],
    scale: 1.5,
    actions: ['walking_RootBaked'],

    sequence: async (actions, speed = 1.0, scene, groupRef) => {
        console.log('Starting debug walk sequence at speed:', speed)

        // Find the root bone to extract motion
        const rootBone = scene.getObjectByName('root')
        if (!rootBone) {
            console.error('Root bone not found in scene!')
        }

        for (let i = 0; i < 5; i++) {
            console.log(`Debug walk cycle ${i + 1}/5`)
            const action = actions['walking_RootBaked']
            if (action) {
                // Play the action
                await playActionOnce(action, speed)

                // Transfer root bone displacement to group position
                if (rootBone && groupRef.current) {
                    console.log('Applying root motion. Bone Z:', rootBone.position.z)
                    groupRef.current.position.z += rootBone.position.z
                    groupRef.current.position.x += rootBone.position.x

                    // Reset bone position so next cycle starts at local 0
                    rootBone.position.set(0, 0, 0)
                    action.stop()
                }
            } else {
                console.error('Action walking_RootBaked not found! Available:', Object.keys(actions))
                break
            }
        }

        console.log('Debug walk sequence complete')
    }
}
