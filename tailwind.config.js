/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f4ff',
          100: '#e9e3ff',
          200: '#d4c6ff',
          300: '#b59aff',
          400: '#9162ff',
          500: '#742dff',
          600: '#6610f2',
          700: '#5a0dd2',
          800: '#4a0fad',
          900: '#3f118a',
        },
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 