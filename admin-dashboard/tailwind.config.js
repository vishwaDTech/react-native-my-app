/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3A86FF",
        secondary: "#8338EC",
        accent: "#FF006E",
        dark: "#0F172A",
        light: "#F8FAFC",
      }
    },
  },
  plugins: [],
}
