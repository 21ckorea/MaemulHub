/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#7c3aed',
          foreground: '#ffffff',
          soft: '#ede9fe',
          hover: '#6d28d9'
        }
      },
      boxShadow: {
        card: '0 4px 14px 0 rgba(0,0,0,0.06)'
      },
      borderRadius: {
        xl: '14px'
      }
    }
  },
  plugins: []
};
