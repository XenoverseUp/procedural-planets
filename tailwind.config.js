/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sud: ["Sud", "sans-serif"],
      },
    },
  },
  plugins: [
    require("tailwindcss-radix")(),
    require("@xpd/tailwind-3dtransforms"),
  ],
};
