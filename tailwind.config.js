/** @type {import('tailwindcss').Config} */
// Colors and fonts copied from the Resort Booking site theme (cream, forest green, terracotta).
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fdf7f1",
        ink: "#1c140c",
        soft: "#6b6157",
        line: "#e9e4de",
        sage: { 100: "#dceedc", 200: "#bad7ba" },
        brand: {
          50: "#eef6ee",
          100: "#dceedc",
          500: "#2f6a33",
          600: "#1b451e", // primary forest green
          700: "#0e3111",
        },
        terra: { 100: "#ffe4d4", 500: "#cc7455", 600: "#b5603f" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { xl: "0.625rem", "2xl": "1rem" },
    },
  },
  plugins: [],
};
