// tailwind.config.js
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      colors: {
        noir: { DEFAULT: '#080808', card: '#0d0d0d', input: '#111111', border: '#1c1c1c', hover: '#161616' },
        gold: { DEFAULT: '#c9a96e', light: '#d4ba85', dark: '#a88a52' },
        dim:  { 100: '#ffffff', 200: '#cccccc', 300: '#999999', 400: '#555555', 500: '#333333' }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Helvetica Neue', 'sans-serif'],
      }
    }
  }
}