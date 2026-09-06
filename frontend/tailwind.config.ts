import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F8FC",
        surface: "#FFFFFF",
        border: "#E7EAF0",
        primary: {
          DEFAULT: "#3157E8",
          hover: "#2545BE",
          light: "#EEF2FF",
          dark: "#172554",
        },
        text: {
          main: "#152033",
          muted: "#667085",
        },
        success: {
          DEFAULT: "#16A36A",
          light: "#EAF8F1",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FFF4DC",
        },
        danger: {
          DEFAULT: "#E5484D",
          light: "#FDF2F2",
        },
      },
      borderRadius: {
        card: "18px",
        button: "10px",
        input: "10px",
      },
      boxShadow: {
        card: "0 4px 16px rgba(31, 41, 55, 0.04)",
        cardHover: "0 8px 24px rgba(31, 41, 55, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
