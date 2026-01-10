import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        tierra: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e9ddd1',
          300: '#d9c5b0',
          400: '#c5a888',
          500: '#b8936f',
          600: '#a8825e',
          700: '#8c6b4f',
          800: '#745943',
          900: '#5f4a38',
        },
        esmeralda: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
    },
  },
  plugins: [],
};
export default config;
