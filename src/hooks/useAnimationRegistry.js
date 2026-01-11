import { useState, useEffect } from 'react'

/**
 * Hook to dynamically load all animation definition files from /src/animations/
 * Uses Vite's import.meta.glob for automatic discovery
 */
export const useAnimationRegistry = () => {
    const [registry, setRegistry] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadAnimations = async () => {
            try {
                // Dynamically import all .js files from animations folder
                const modules = import.meta.glob('../animations/*.js', { eager: true })

                const animList = Object.entries(modules).map(([path, module]) => {
                    // Extract filename for debugging
                    const filename = path.split('/').pop()
                    return {
                        ...module.default,
                        _filename: filename,
                        _path: path
                    }
                })

                setRegistry(animList)
                setLoading(false)
            } catch (err) {
                console.error('Failed to load animation registry:', err)
                setError(err.message)
                setLoading(false)
            }
        }

        loadAnimations()
    }, [])

    return { registry, loading, error }
}
