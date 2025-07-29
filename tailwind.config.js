// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        bakudai: ['Bakudai', 'sans-serif'], // 保持這行！
      },
    },
  },
  plugins: [
    
  ],
};