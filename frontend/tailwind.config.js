/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Poppins', 'sans-serif'], serif: ['Playfair Display', 'serif'] },
      colors: {
        teal: { dark: '#005461', mid: '#018790', light: '#00B7B5' }
      }
    },
  },
  plugins: [],
}
