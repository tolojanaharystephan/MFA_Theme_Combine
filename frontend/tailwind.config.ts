import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0f766e",
          foreground: "#f8fafc"
        },
        command: {
          ink: "#111827",
          graphite: "#1f2937",
          steel: "#475569",
          field: "#f3f7f5",
          alert: "#b91c1c",
          amber: "#b7791f",
          cyan: "#0e7490"
        }
      },
      boxShadow: {
        tactical: "0 20px 50px rgba(15, 23, 42, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;

