import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';  // Si usas Tailwind

export default defineConfig({
  plugins: [react(), tailwindcss()],  // Tus plugins
  build: {
    sourcemap: false,  // Desactiva source maps en build (y afecta dev)
  },
  css: {
    devSourcemap: false,  // Desactiva source maps para CSS en dev
  },
  server: {
    // Opcional: No agregar headers CSP en dev
    headers: {
      // No agregues 'Content-Security-Policy' aquí por ahora
    },
  },
});