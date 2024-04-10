/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{html,js}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#424769",
        hover: "#7077A1",
        light: "#365486",
        sea: "#DCF2F1",
      }
    },
  },
  plugins: [],
}

