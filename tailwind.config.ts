import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        scale: {
          "0%": { transform: "scale(0.8)" },
          "100%": { transform: "scale(1)" },
        },
        "bounce-ball": {
          "0%": { transform: "translate(0%, -20%)" },
          "5%": { transform: "translate(10%, -55%)" },
          "10%": { transform: "translate(20%, -40%)" },
          "15%": { transform: "translate(30%, -75%)" },
          "20%": { transform: "translate(40%, -60%)" },
          "25%": { transform: "translate(50%, -95%)" },
          "30%": { transform: "translate(60%, -80%)" },
          "35%": { transform: "translate(70%, -115%)" },
          "40%": { transform: "translate(80%, -100%)" },
          "50%": { transform: "translate(80%, -20%)" },
          "55%": { transform: "translate(70%, -55%)" },
          "60%": { transform: "translate(60%, -40%)" },
          "65%": { transform: "translate(50%, -75%)" },
          "70%": { transform: "translate(40%, -60%)" },
          "75%": { transform: "translate(30%, -95%)" },
          "80%": { transform: "translate(20%, -80%)" },
          "85%": { transform: "translate(10%, -115%)" },
          "90%": { transform: "translate(0%, -100%)" },
          "100%": { transform: "translate(0%, -20%)" },
        },
        "bar-1": {
          "0%, 40%": { transform: "scaleY(20%)" },
          "50%, 90%": { transform: "scaleY(100%)" },
          "100%": { transform: "scaleY(20%)" },
        },
        "bar-2": {
          "0%, 40%": { transform: "scaleY(40%)" },
          "50%, 90%": { transform: "scaleY(80%)" },
          "100%": { transform: "scaleY(40%)" },
        },
        "bar-3": {
          "0%, 100%": { transform: "scaleY(60%)" },
        },
        "bar-4": {
          "0%, 40%": { transform: "scaleY(80%)" },
          "50%, 90%": { transform: "scaleY(40%)" },
          "100%": { transform: "scaleY(80%)" },
        },
        "bar-5": {
          "0%, 40%": { transform: "scaleY(100%)" },
          "50%, 90%": { transform: "scaleY(20%)" },
          "100%": { transform: "scaleY(100%)" },
        },
      },
      animation: {
        scale: "scale 0.5s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-ball": "bounce-ball 4s infinite",
        "bar-1": "bar-1 4s infinite",
        "bar-2": "bar-2 4s infinite",
        "bar-3": "bar-3 4s infinite",
        "bar-4": "bar-4 4s infinite",
        "bar-5": "bar-5 4s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
