import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg:      "#0b0d12",
        panel:   "#11141c",
        border:  "#1d2230",
        muted:   "#6b7280",
        fg:      "#e6e8ee",
        accent:  "#7c5cff",
        success: "#10b981",
        warn:    "#f59e0b",
        danger:  "#ef4444",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
