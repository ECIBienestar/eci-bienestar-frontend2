/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Work Sans"',
          "system-ui",
          "Avenir",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        // Main colors app
        "app-primary": "#990000",

        // Health module colors
        "health-primary": "#00BCFF",
        "health-primary-dark": "#0078B4",
        "health-medicine-primary": "#10B981",
        "health-medicine-dark": "#0D9488",
        "health-psychology-primary": "#EFB100",
        "health-psychology-dark": "#B38400",

        // Recreation Rooms module colors
        "recreation-primary": "#0E7029",
        "recreation-primary-light": "#2DA14D",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
