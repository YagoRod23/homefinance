/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E86AB',
        success: '#52b788',
        danger: '#d62828',
        warning: '#f77f00',
        light: '#f5f5f5',
      },
    },
  },
  plugins: [],
}
