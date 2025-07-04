/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'aastu-blue': '#1e40af',
        'aastu-green': '#059669',
        'aastu-gold': '#d97706',
      },
    },
  },
  plugins: [],
};