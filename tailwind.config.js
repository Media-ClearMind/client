/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'custom-blue': '#1e40af' // 원하는 색상 추가
            }
        },
        plugins: []
    }
}
