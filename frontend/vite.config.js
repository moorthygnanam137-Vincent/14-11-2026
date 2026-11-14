import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development, forward /api requests to the local Express server so the
// frontend can call the same relative URLs it uses in production.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
