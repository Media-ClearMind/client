import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            { find: '@', replacement: '/src' },
            { find: 'node_modules', replacement: '/node_modules' }
        ]
    },
    server: {
        port: 5173, // 개발 서버 포트
        host: true, // 외부 네트워크에서 접근 가능
        strictPort: false // 포트가 이미 사용 중일 경우 다른 포트로 대체
    }
})
