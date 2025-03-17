/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aarc': {
          'bg': '#2D2D2D',
          'primary': '#A5E547',
          'text': '#C3C3C3',
          'button-text': '#003300',
          'border': '#3D3D3D',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'aarc': '4px 8px 8px 4px #0000001A',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '24px 24px',
      },
    },
  },
  plugins: [],
}