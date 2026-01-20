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
        'crypto-purple-light': '#A78BFA',
        'crypto-purple-dark': '#6D4AFF',
        'crypto-dark': '#0D0D12',
        'crypto-dark-secondary': '#16161D',
        'crypto-dark-tertiary': '#1E1E28',
        'crypto-light': '#F8F9FA',
        'crypto-accent': '#00D68F',
        'crypto-accent-light': '#00FFB2',
        'crypto-warning': '#FF6B6B',
        'crypto-warning-light': '#FF8F8F',
        'crypto-blue': '#3B82F6',
        'crypto-cyan': '#22D3EE',
        'crypto-gold': '#F59E0B',
      },
      fontFamily: {
        'days': ['"Days One"', 'sans-serif'],
        'manrope': ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 8px 40px rgba(136, 106, 255, 0.25)',
        'glow': '0 0 40px rgba(136, 106, 255, 0.3)',
        'glow-accent': '0 0 40px rgba(0, 214, 143, 0.3)',
        'inner-glow': 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0D0D12 0%, #1a1a2e 50%, #16213e 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'purple-gradient': 'linear-gradient(135deg, #886AFF 0%, #6D4AFF 100%)',
        'accent-gradient': 'linear-gradient(135deg, #00D68F 0%, #00FFB2 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(136, 106, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(136, 106, 255, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}

