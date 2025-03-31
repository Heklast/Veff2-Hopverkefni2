/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        fontFamily: {
          heading: 'var(--font-heading)',
          body: 'var(--font-body)',
        },
        colors: {
          porcelain: '#fdfdfc',
          charcoal: '#2f2f2f',
          blush: '#f9e7e7',
          skysoft: '#e4f0f5',
          clay: '#d1bfa7',
        },
      },
    },
    plugins: [],
  };