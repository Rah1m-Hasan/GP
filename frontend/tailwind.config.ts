import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: { extend: { colors: {
    ink: "var(--foreground)", brand: "var(--primary)", mint: "var(--accent)", line: "var(--border)",
    background: "var(--background)", foreground: "var(--foreground)", card: "var(--card)",
    "card-foreground": "var(--card-foreground)", popover: "var(--popover)", "popover-foreground": "var(--popover-foreground)",
    muted: "var(--muted)", "muted-foreground": "var(--muted-foreground)", kanban: "var(--kanban)", secondary: "var(--secondary)", "secondary-foreground": "var(--secondary-foreground)",
    accent: "var(--accent)", "accent-foreground": "var(--accent-foreground)", border: "var(--border)", input: "var(--input)", ring: "var(--ring)",
    destructive: "var(--destructive)", "destructive-surface": "var(--destructive-surface)", success: "var(--success)", "success-surface": "var(--success-surface)", warning: "var(--warning)", "warning-surface": "var(--warning-surface)", info: "var(--info)", sidebar: "var(--sidebar)",
  }, boxShadow: { lift: "var(--shadow-lift)" } } }, plugins: []
};
export default config;
