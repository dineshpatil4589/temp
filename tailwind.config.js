/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6366F1", // primary indigo
          light: "#A5B4FC",
          dark: "#4F46E5",
        },
        accent: "#F43F5E", // pink/red for SOS
      },
    },
  },
  plugins: [],
};
