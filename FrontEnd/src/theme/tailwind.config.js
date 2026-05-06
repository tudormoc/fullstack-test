/** @type {import('tailwindcss').Config} */

// Tailwind config aligned with the Ant Design theme tokens
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  important: true,
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        'primary-light': '#818cf8',
        secondary: '#6b7280',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b'
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};
