// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Keep this as 'class'
  theme: {
    extend: {
      colors: {
        // Map Tailwind's semantic color names to your CSS variables
        "bg-default": "var(--color-bg-default)",
        "text-default": "var(--color-text-default)",
        "bg-card": "var(--color-bg-card)",
        "text-heading": "var(--color-text-heading)",
        "primary-main": "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "text-secondary": "var(--color-text-secondary)",
        "border-color-light": "var(--color-border-light)", // For borders
      },
      boxShadow: {
        "custom-light": "0 4px 6px rgba(0, 0, 0, 0.1)",
        "custom-dark": "0 10px 15px rgba(0, 0, 0, 0.3)", // Still useful for specific dark shadows
      },
    },
  },
  plugins: [],
};
