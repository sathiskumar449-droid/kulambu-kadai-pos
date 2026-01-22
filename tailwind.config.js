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
        primary: {
          50: '#fef3e2',
          100: '#fde7c5',
          200: '#fbcf8b',
          300: '#f9b751',
          400: '#f79f17',
          500: '#f58700',
          600: '#c46d00',
          700: '#935200',
          800: '#623700',
          900: '#311c00',
        }
      }
    },
  },
  plugins: [],
}
