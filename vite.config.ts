import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from "path";
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/public": path.resolve(__dirname, "./public")
    },
  },
  build: {
    rollupOptions: {
      input: {
        newtab: 'index.html',
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
  }
});
