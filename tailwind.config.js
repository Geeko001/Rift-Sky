/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#08080A',
        primary: '#00F5FF',
        secondary: '#A056FF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px 5px rgba(160, 86, 255, 0.3) inset' },
          '50%': { opacity: 0.8, boxShadow: '0 0 10px 0px rgba(160, 86, 255, 0.1) inset' },
        }
      }
    },
  },
  plugins: [],
}
