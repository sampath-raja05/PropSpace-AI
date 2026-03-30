import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        primary: "hsl(var(--primary) / <alpha-value>)",
        "primary-foreground": "hsl(var(--primary-foreground) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        "accent-foreground": "hsl(var(--accent-foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        "card-foreground": "hsl(var(--card-foreground) / <alpha-value>)",
        success: "hsl(var(--success) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 24px 80px -32px rgba(5, 150, 105, 0.35)",
        glass: "0 18px 55px -28px rgba(15, 23, 42, 0.5)"
      },
      backdropBlur: {
        xs: "2px"
      },
      backgroundImage: {
        "hero-radial": "radial-gradient(circle at top left, rgba(16, 185, 129, 0.2), transparent 45%), radial-gradient(circle at top right, rgba(5, 150, 105, 0.14), transparent 35%), linear-gradient(180deg, rgba(255,255,255,0.74), rgba(255,255,255,0.34))",
        "hero-radial-dark": "radial-gradient(circle at top left, rgba(16, 185, 129, 0.24), transparent 45%), radial-gradient(circle at top right, rgba(4, 120, 87, 0.2), transparent 35%), linear-gradient(180deg, rgba(6,18,15,0.82), rgba(6,18,15,0.45))"
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseGlow: "pulseGlow 3.2s ease-in-out infinite",
        slideUp: "slideUp 400ms ease-out"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(16,185,129,0.08)" },
          "50%": { boxShadow: "0 0 0 14px rgba(16,185,129,0)" }
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
