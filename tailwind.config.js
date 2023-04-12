/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "terradroids": "url('/src/assets/bg.png')",
        "terradroids-full": "url('/src/assets/bg_full.png')"
      },
    },
    plugins: [],
  }
}
