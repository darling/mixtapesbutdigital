import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Sunset-Demi", "serif"],
        sans: ["Rubik", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
