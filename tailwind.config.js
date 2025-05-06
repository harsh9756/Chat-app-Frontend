/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
      screens: {
        'sm': {'min': '200px', 'max': '767px'}, 
      },
    }
  },
  plugins: [],
}