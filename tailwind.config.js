/** @type {import('tailwindcss').Config} */
export default {
    content: ['./components/**/*.{js,vue,ts}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}', './app.vue', './error.vue'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12'
                }
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.8s ease-out',
                'fade-in-delayed': 'fade-in-delayed 1.2s ease-out',
                'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
                gradient: 'gradient 4s ease infinite',
                shimmer: 'shimmer 2s ease-in-out infinite',
                float: 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
                'stagger-in': 'stagger-in 0.6s ease-out',
                'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
                flicker: 'flicker 1.5s ease-in-out infinite',
                'slide-in-left': 'slide-in-left 0.8s ease-out',
                'slide-in-right': 'slide-in-right 0.8s ease-out'
            }
        }
    },
    plugins: []
};
