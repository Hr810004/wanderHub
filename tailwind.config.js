/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",  "./views/**/*.ejs",],
  theme: {
    extend: {
      fontFamily: {
        condensed: ['Plus Jakarta Sans', 'serif'],
      },
    },
  },
  plugins: [],
}

