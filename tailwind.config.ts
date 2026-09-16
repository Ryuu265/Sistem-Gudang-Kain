import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bgBase: "#1A1B1F",
        bgSurface: "#232428",
        bgElevated: "#2A2B30",
        bgInput: "#2E2F35",
        borderColor: "#33343A",
        primary: {
          DEFAULT: "#6C5CE7",
          hover: "#7D6FF0",
          soft: "rgba(108, 92, 231, 0.15)",
        },
        textPrimary: "#FFFFFF",
        textSecondary: "#9A9BA3",
        textMuted: "#6B6C75",
        success: "#2ECC71",
        danger: "#FF5C5C",
        warning: "#FF8A3D",
        info: "#4A9BFF",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
