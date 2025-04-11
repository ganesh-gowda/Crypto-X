/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'crypto-purple': '#886AFF',
        'crypto-dark': '#181A20',
        'crypto-light': '#F8F9FA',
        'crypto-accent': '#00C087',
        'crypto-warning': '#FF6B6B',
      },
      fontFamily: {
        'days': ['"Days One"', 'sans-serif'],
        'manrope': ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'hover': '0 10px 15px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}

