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
        'gradient-light-start': '#ffffff',
        'gradient-light-end': '#a1c4fd',
        'gradient-dark-start': '#2e2e2e',
        'gradient-dark-end': '#434343',

      },
    },
  },
  plugins: [],
})
