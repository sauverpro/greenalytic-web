
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xm: "360px",
        sm: "375px",
        xsm: "500px",
        xmd: "600px",
        md: "768px",
        lg: "976px",
        mdl: "1240px",
        xl: "1440px",
      },
      colors: {
        primary: "#06513D",
        secondary: "#059669",
        second: "#007755",
        third: "#4ADE80",
        fourth: "#E1FCEE",
        foreground: "#1A1A1A",
        border: "#E2E8F0",
        dark: "#000000",
        light: "#ffffff",
        charts: {
          "1": "#007755",
          "2": "#0066CC",
          "3": "#FF6B6B",
          "4": "#8A2BE2",
          "5": "#FFB30F",
        },
        sidebar: {
          DEFAULT: "#00553E",
          foreground: "#FFFFFF",
          primary: "#4ADE80",
          border: "#006B4D",
          ring: "#4ADE80",
        },
        greanalytic: {
          DEFAULT: "#007755",
          light: "#4ADE80",
          dark: "#00553E",
          accent: "#FFB30F",
        },
        status: {
          success: "#22C55E",
          warning: "#FFB30F",
          danger: "#FF3B30",
          info: "#0066CC",
        },
        cards: {
          emission: "#FFE6E6",
          fuel: "#E6F7FF",
          distance: "#E0F7EA",
          status: "#F3E8FF",
        },
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
    },
  },
  plugins: [],
};
export default config;