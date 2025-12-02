import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Data-Tec/", // <--- IMPORTANTE: Pon aquí el nombre exacto de tu repo entre barras
})
