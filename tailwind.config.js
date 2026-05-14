/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', "monospace"],
        sans: ['"IBM Plex Sans"', "sans-serif"],
      },
      keyframes: {
        contextIn: {
          "0%": { opacity: "0", transform: "translateY(-6px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        nodeIn: {
          "0%": { opacity: "0", transform: "translateX(-4px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "context-in": "contextIn 0.12s ease-out forwards",
        "node-in": "nodeIn 0.15s ease-out forwards",
        "slide-right": "slideRight 0.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};
