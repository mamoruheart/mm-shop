/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  darkMode: 'class', // or 'media' or 'class',
  
  content: [],
  theme: {
    extend: {
      fontFamily: {
        'archivo-black': ['Archivo Black', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors:{
        'scolor': "#f47e20",
        'fcolor': "#212121"
      }
    },
  },
  plugins: [],
}

