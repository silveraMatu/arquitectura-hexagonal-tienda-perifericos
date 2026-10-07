/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#1A1625',
        'bg-secondary': '#211C2E',
        'bg-tertiary': '#271F38',
        'surface-card': '#C8B8DB',
        'surface-dark': '#2E2540',
        'surface-mid': '#352B4A',
        'accent': '#9B59F0',
        'accent-dim': '#7A3FCC',
        'text-primary': '#E8DFF0',
        'text-secondary': '#B8A8D0',
        'text-muted': '#7A6A90',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(155, 89, 240, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(155, 89, 240, 0.6)' },
        },
      },
      backgroundImage: {
        'orchid-gradient': 'linear-gradient(135deg, #9B59F0 0%, #7A3FCC 100%)',
        'surface-gradient': 'linear-gradient(180deg, rgba(46,37,64,0) 0%, rgba(26,22,37,0.95) 100%)',
        'card-gradient': 'linear-gradient(135deg, #2E2540 0%, #211C2E 100%)',
      },
    },
  },
  plugins: [],
};