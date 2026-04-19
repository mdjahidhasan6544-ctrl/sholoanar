/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09090b",
        bronze: "#b8935f",
        smoke: "#d1c7b7"
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        halo: "0 20px 80px rgba(0, 0, 0, 0.45)"
      }
    }
  },
  plugins: []
};
