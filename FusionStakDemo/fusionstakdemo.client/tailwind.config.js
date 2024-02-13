/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {spacing: {
      '1/2': '0.125rem', // Adjust this value as needed
    },},
  },
  plugins: [],
}

