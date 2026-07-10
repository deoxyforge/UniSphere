/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Allow manual class-based dark mode (default will be dark theme for premium feel)
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A0E1A',      // Premium deep dark blue background
          card: '#131B2E',      // Sleek glassmorphic card base
          cardLight: '#1E2942', // Slightly lighter card hover state
          border: '#223254',    // Muted blue border color
          accent: '#7C3AED',    // Glowing violet/purple accent
          accentLight: '#A78BFA',
          emerald: '#10B981',   // Accent success/approve color
          emeraldLight: '#34D399',
          crimson: '#EF4444',   // Cancel/warning color
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-glow': 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 60%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
