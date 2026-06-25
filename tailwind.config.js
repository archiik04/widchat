/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F8F4EE",
        intellyYellow: "#F7D85D",
        intellyPink: "#F3B8D6",
        intellyBlue: "#BFD6FF",
        intellyGreen: "#B7C88C",
        intellyBlack: "#141414",
        background: "#F8F4EE",
        primary: "#141414",
        secondary: "#7C7C7C",
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(20, 20, 20, 0.02), 0 2px 8px -1px rgba(20, 20, 20, 0.01)',
        'premium': '0 10px 30px -5px rgba(20, 20, 20, 0.03), 0 4px 12px -2px rgba(20, 20, 20, 0.02)',
      },
      fontFamily: {
        sans: ['"Outfit"', '"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
