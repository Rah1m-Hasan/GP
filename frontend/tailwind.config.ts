import type { Config } from "tailwindcss";
const config: Config = { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "#17212b", brand: "#186a68", mint: "#e0f3ee", line: "#dfe7e5" }, boxShadow: { lift: "0 12px 30px rgba(23,33,43,.08)" } } }, plugins: [] };
export default config;
