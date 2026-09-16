import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F4F4EB",
        primary: "#1A4331",
        action: "#7C2D3A",
        clinical: "#2E7D32",
        alert: "#B8860B",
        borderDark: "#000000",
      },
      fontFamily: {
        serif: ["Merriweather", "PT Serif", "Georgia", "serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      fontSize: {
        base: ["16px", "24px"],
        lg: ["18px", "26px"],
        xl: ["20px", "28px"],
        "2xl": ["24px", "32px"],
        "3xl": ["30px", "38px"],
      },
    },
  },
  plugins: [],
};

export default config;
