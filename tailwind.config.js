/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#effdf3',
          100: '#d8f8e0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        },
        field: '#f6fbf4',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(20, 83, 45, 0.12)',
      },
    },
  },
  plugins: [],
};
