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
        primary: {
          DEFAULT: "#0F766E",
          50: "#E6F7F6",
          100: "#CCEFED",
          200: "#99DFDB",
          300: "#66CFC9",
          400: "#33BFB7",
          500: "#0F766E",
          600: "#0C5F58",
          700: "#094842",
          800: "#06302C",
          900: "#031816",
        },
        "deep-green": "#0F766E",
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
        sans: ["var(--font-outfit)", "sans-serif"],
        body: ["var(--font-outfit)", "sans-serif"],
        heading: ["var(--font-chewy)", "cursive"],
        chewy: ["var(--font-chewy)", "cursive"],
        outfit: ["var(--font-outfit)", "sans-serif"],
      },
    },
  },
  plugins: [],
}
