/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        PrimaryColor: "#f2f2f2", // Light Gray
        SecondaryColor: "#cccccc", // Mid Gray
        DarkColor: "#7f7f7f", // Darker Gray
        ExtraDarkColor: "#1a1a1a", // Near Black
      },
    },
  },
  plugins: [],
};
