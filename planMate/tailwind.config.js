/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,tsx,jsx,ts}"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
        semiboldpaperlogy: ["semibold-Paperlogy", "sans-serif"],
        mediumpaperlogy: ["medium-Paperlogy", "sans-serif"],
        scdream: ["SCDream", "sans-serif"],
      },
      colors: {
        main: "#1344FF",
        sub: "#E8EDFF",
        mainDark: "oklch(0.42 0.27 264.75)"
      },
    },
  },
  plugins: [],
};
