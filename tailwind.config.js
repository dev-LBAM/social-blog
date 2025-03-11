// tailwind.config.js

import { defineConfig } from 'tailwindcss'

export default defineConfig({
  darkMode: 'class', // Ou 'media', dependendo da sua preferência
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}", // Ajuste conforme o seu projeto
  ],
  theme: {
    extend: {
      colors: {
      },
    },
  },
  plugins: [],
})
