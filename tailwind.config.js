// tailwind.config.js

import { defineConfig } from 'tailwindcss'

export default defineConfig({
  darkMode: 'class',
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slideFadeIn: 'slideFadeIn 0.4s ease forwards',
      },
    },
  },
  plugins: [],
})
