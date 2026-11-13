import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#FDFAF4",
          100: "#F8F1E4",
          200: "#F1E5D2",
          300: "#E7D5BA",
          400: "#D8BC97",
        },
        jungle: {
          50: "#EEF4EF",
          100: "#DCE8DF",
          200: "#BCD4C2",
          300: "#8FB49B",
          400: "#5E8F70",
          500: "#3F7055",
          600: "#2F5A43",
          700: "#274B39",
          800: "#1E3B2D",
          900: "#172E24",
          950: "#0D1C15",
        },
        sunset: {
          50: "#FFF3EC",
          100: "#FFE4D5",
          200: "#FDC9AE",
          300: "#F9A77E",
          400: "#F18353",
          500: "#E86F3C",
          600: "#D4572A",
          700: "#AF4120",
          800: "#8C361F",
          900: "#712F1E",
        },
        ink: "#1B2A23",
        shell: "#FBF6EC",
      },
      fontFamily: {
        sans: ["Inter Variable", "Inter", "system-ui", "sans-serif"],
        display: ["Fraunces Variable", "Fraunces", "Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      boxShadow: {
        soft: "0 18px 50px -24px rgba(27, 42, 35, 0.28)",
        card: "0 26px 70px -34px rgba(27, 42, 35, 0.38)",
        sticker: "0 10px 30px -12px rgba(27, 42, 35, 0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(22px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-9px) rotate(-1deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        wag: {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "50%": { transform: "rotate(8deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        float: "float 7s ease-in-out infinite",
        marquee: "marquee 36s linear infinite",
        wag: "wag 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
