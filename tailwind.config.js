/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        buddha: '#E8E8E8',
        vajra: '#4A7BA7',
        ratna: '#C9A227',
        padma: '#B85450',
        karma: '#5A8B5A',
        gold: {
          DEFAULT: '#C9A227',
          light: '#E5D68A',
          dark: '#8B6914',
        },
      dark: {
        DEFAULT: '#1A1612',
        lighter: '#2A2520',
        darker: '#0D0B09',
      },
      stone: {
        950: '#0c0a09',
      },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
