/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep cosmic navy blues
        navy: {
          950: '#030712',
          900: '#060d1f',
          800: '#0a1631',
          700: '#0f2048',
          600: '#162a5c',
          500: '#1e3a8a',
          400: '#2d4fa3',
          300: '#3b64bc',
          200: '#6b8ed4',
          100: '#a7bde8',
        },
        // Deep purples
        cosmic: {
          950: '#0d0618',
          900: '#180b2e',
          800: '#261246',
          700: '#37195e',
          600: '#4a2278',
          500: '#6d28d9',
          400: '#8b5cf6',
          300: '#a78bfa',
          200: '#c4b5fd',
          100: '#ede9fe',
        },
        // Gold accents
        gold: {
          950: '#1c1202',
          900: '#382406',
          800: '#5c3a0a',
          700: '#854d0e',
          600: '#b45309',
          500: '#d97706',
          400: '#f59e0b',
          300: '#fbbf24',
          200: '#fcd34d',
          100: '#fef3c7',
          50:  '#fffbeb',
        },
        // Starlight whites
        starlight: {
          DEFAULT: '#e8eaf6',
          muted: '#9ea3c0',
          dim: '#5c6080',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'cosmic-gradient':
          'linear-gradient(135deg, #030712 0%, #0d0618 40%, #060d1f 70%, #030712 100%)',
        'nebula-gradient':
          'radial-gradient(ellipse at 20% 50%, rgba(109,40,217,0.15) 0%, transparent 60%), ' +
          'radial-gradient(ellipse at 80% 20%, rgba(30,58,138,0.2) 0%, transparent 50%)',
        'gold-shimmer':
          'linear-gradient(90deg, #d97706, #fbbf24, #f59e0b)',
        'card-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        'cosmic': '0 0 30px rgba(109,40,217,0.3), 0 0 60px rgba(30,58,138,0.2)',
        'gold-glow': '0 0 20px rgba(251,191,36,0.4), 0 0 40px rgba(217,119,6,0.2)',
        'star': '0 0 6px rgba(251,191,36,0.8)',
        'card': '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      borderColor: {
        'glass': 'rgba(255,255,255,0.08)',
        'gold-subtle': 'rgba(251,191,36,0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.3, transform: 'scale(0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
