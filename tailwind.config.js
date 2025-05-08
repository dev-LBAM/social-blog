// tailwind.config.js

import { defineConfig } from 'tailwindcss'

export default defineConfig({
  darkMode: 'class', 
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xl2': '1450px',
      },
    },
  },
  plugins: [],
})
