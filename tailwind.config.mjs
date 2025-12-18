/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6FC3FF",
        "primary-dark": "#5FB3EF",
        "bg-dark": "var(--bg-dark)",
        "bg-darker": "var(--bg-darker)",
        "bg-light": "var(--bg-light)",
        "bg-lighter": "var(--bg-lighter)",
        "text-contrast": "var(--text-accent)",
        "text-muted": "var(--text-muted)",
        "card-bg": "var(--card-bg)",
      },
      backgroundColor: {
        main: "var(--background)",
        lighter: "var(--background-lighter)",
        contrast: "var(--card-bg)",
      },
      textColor: {
        main: "var(--text)",
        secondary: "var(--text-secondary)",
        contrast: "var(--text-accent)",
        muted: "var(--text-muted)",
      },
      borderColor: {
        main: "var(--border)",
        contrast: "var(--border)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
}
