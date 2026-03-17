import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: "var(--color-forest)",
        gold: "var(--color-gold)",
        cream: "var(--color-cream)",
        ink: "var(--color-ink)",
        moss: "#0F2A21"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "serif"]
      },
      boxShadow: {
        "gold-glow": "0 10px 30px rgba(201, 168, 76, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
