// tailwind.config.js

import { defineConfig } from 'tailwindcss'

export default defineConfig({
  darkMode: 'class', // Ou 'media', dependendo da sua preferência
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}", // Ajuste conforme o seu projeto
  ],
  theme: {
    extend: {
      opacity: {
        '10': '0.1',
        '20': '0.2',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '80': '0.8',
        '90': '0.9',
      },
    },
  },
  plugins: [],
})
