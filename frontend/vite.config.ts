import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { username, password })',
        changeOrigin: true,
      },
    },
  },
});
