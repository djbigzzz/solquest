/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'solana-purple': '#9945FF',
        'solana-green': '#14F195',
        'dark-bg': '#121212',
        'card-bg': '#1E1E1E',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'quest-card': '0 4px 14px 0 rgba(153, 69, 255, 0.1)',
        'quest-card-hover': '0 8px 20px 0 rgba(153, 69, 255, 0.2)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'achievement': 'achievementPopup 3.5s ease-in-out forwards',
        'combo': 'comboEffect 5s ease-in-out forwards',
        'points': 'pointsEarned 1.5s ease-out forwards',
        'streak': 'streakPulse 0.5s ease-in-out',
        'progress': 'progressFill 0.8s ease-out forwards',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(153, 69, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(153, 69, 255, 0.8), 0 0 30px rgba(20, 241, 149, 0.6)' },
        },
        achievementPopup: {
          '0%': { opacity: 0, transform: 'translate(-50%, -70%) scale(0.8)' },
          '10%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1.1)' },
          '20%': { transform: 'translate(-50%, -50%) scale(1)' },
          '80%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
          '100%': { opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' },
        },
        comboEffect: {
          '0%': { opacity: 0, transform: 'scale(0.8) translateY(-10px)' },
          '10%': { opacity: 1, transform: 'scale(1.1) translateY(0)' },
          '20%': { transform: 'scale(1) translateY(0)' },
          '70%': { opacity: 1, transform: 'scale(1) translateY(0)' },
          '100%': { opacity: 0, transform: 'scale(0.9) translateY(-5px)' },
        },
        pointsEarned: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '20%': { opacity: 1, transform: 'translateY(-5px)' },
          '80%': { opacity: 1, transform: 'translateY(-5px)' },
          '100%': { opacity: 0, transform: 'translateY(-15px)' },
        },
        streakPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
      },
    },
  },
  plugins: [],
}
