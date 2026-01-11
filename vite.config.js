import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true
    },
    // Enable glob imports for dynamic animation loading
    optimizeDeps: {
        include: ['three', '@react-three/fiber', '@react-three/drei']
    }
})
