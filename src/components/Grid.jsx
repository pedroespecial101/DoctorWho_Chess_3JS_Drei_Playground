import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * 8x8 Chessboard Grid Component
 * Renders a wireframe grid at y=0 for chess piece positioning
 */
export function Grid({ size = 8, squareSize = 1, color = '#2a2a3a', highlightColor = '#00b4d8' }) {
    const { lineGeometry, gridLines } = useMemo(() => {
        const totalSize = size * squareSize
        const halfSize = totalSize / 2
        const lines = []

        // Create grid lines
        for (let i = 0; i <= size; i++) {
            const pos = -halfSize + i * squareSize

            // Horizontal lines (along X)
            lines.push(new THREE.Vector3(-halfSize, 0, pos))
            lines.push(new THREE.Vector3(halfSize, 0, pos))

            // Vertical lines (along Z)
            lines.push(new THREE.Vector3(pos, 0, -halfSize))
            lines.push(new THREE.Vector3(pos, 0, halfSize))
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(lines)

        return {
            lineGeometry: geometry,
            gridLines: lines
        }
    }, [size, squareSize])

    // Create checkerboard pattern
    const squares = useMemo(() => {
        const totalSize = size * squareSize
        const halfSize = totalSize / 2
        const squareList = []

        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const isLight = (row + col) % 2 === 0
                squareList.push({
                    position: [
                        -halfSize + col * squareSize + squareSize / 2,
                        -0.01, // Slightly below grid lines
                        -halfSize + row * squareSize + squareSize / 2
                    ],
                    isLight
                })
            }
        }

        return squareList
    }, [size, squareSize])

    return (
        <group>
            {/* Checkerboard squares */}
            {squares.map((square, index) => (
                <mesh
                    key={index}
                    position={square.position}
                    rotation={[-Math.PI / 2, 0, 0]}
                >
                    <planeGeometry args={[squareSize * 0.98, squareSize * 0.98]} />
                    <meshStandardMaterial
                        color={square.isLight ? '#1a1a25' : '#0f0f15'}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            ))}

            {/* Grid lines */}
            <lineSegments geometry={lineGeometry}>
                <lineBasicMaterial color={color} linewidth={1} />
            </lineSegments>

            {/* Center marker */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.1, 0.15, 16]} />
                <meshBasicMaterial color={highlightColor} />
            </mesh>
        </group>
    )
}

export default Grid
