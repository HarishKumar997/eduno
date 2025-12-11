import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: true, // Allows access from localhost and network
    open: true, // Automatically open browser on start
  },
  plugins: [react()],
  // Vite automatically exposes VITE_* prefixed environment variables
  // via import.meta.env at build time - no need for manual define
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  build: {
    // Ensure environment variables are embedded at build time
    // VITE_* variables are automatically replaced during build
    outDir: 'dist',
    sourcemap: false,
  }
});
