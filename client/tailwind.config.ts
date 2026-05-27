import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Allow manual class toggle
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'bg-base': "var(--bg-base)",
        'bg-surface': "var(--bg-surface)",
        'bg-card': "var(--bg-card)",
        'bg-card-hover': "var(--bg-card-hover)",
        'glass-border': "var(--glass-border)",
        'glass-border-hover': "var(--glass-border-hover)",
        available: {
          DEFAULT: "var(--available)",
          glow: "var(--available-glow)",
          dim: "var(--available-dim)",
        },
        occupied: {
          DEFAULT: "var(--occupied)",
          glow: "var(--occupied-glow)",
          dim: "var(--occupied-dim)",
        },
        reserved: {
          DEFAULT: "var(--reserved)",
          glow: "var(--reserved-glow)",
          dim: "var(--reserved-dim)",
        },
        disabled: {
          DEFAULT: "var(--disabled)",
          dim: "var(--disabled-dim)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          glow: "var(--accent-glow)",
        },
        'text-primary': "var(--text-primary)",
        'text-secondary': "var(--text-secondary)",
        'text-muted': "var(--text-muted)",
      },
    },
  },
  plugins: [],
};
export default config;
