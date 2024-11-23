import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
    plugins: [
        react(),
        svgr({
            exportAsDefault: true // ReactComponent를 named export로 설정
        })
    ],
    resolve: {
        alias: [
            { find: '@', replacement: '/src' },
            { find: 'node_modules', replacement: '/node_modules' }
        ]
    },
    server: {
        port: 5173,
        host: true,
        strictPort: false
    }
})
