import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        primary: "#0A0A0A",
        accent: "#F5F5F5",
        line: "#262626",
        htk: {
          black: "#050505",
          panel: "#080808",
          card: "#0D0D0D",
          elevated: "#111111",
          muted: "#A3A3A3",
          red: "#E11D2E",
          crimson: "#B91C1C"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        premium: "0 24px 80px rgba(0, 0, 0, 0.42)"
      },
      animation: {
        fadeUp: "fadeUp 650ms ease-out both"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
