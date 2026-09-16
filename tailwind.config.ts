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
        clinical: {
          paper: '#FDF8F9',   // Blush Off-White (Fundo principal)
          ink: '#2A111A',     // Ameixa Profundo (Textos principais e bordas)
          action: '#801A3D',  // Rosa Carmim (Botões primários vitais)
          surface: '#D46C85', // Rosa Velho Médio (Ações secundárias/tags)
          alert: '#B54D22',   // Terracota Quente (Alertas críticos de estoque)
          success: '#4A7059', // Verde Sálvia (Status de sucesso/concluído)
        },
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
