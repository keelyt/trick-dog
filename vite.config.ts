/* eslint-disable spaced-comment */
/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="vitest" />
/// <reference types="vite/client" />

import path from 'path';

import { defineConfig, loadEnv } from 'vite';

import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), svgr()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/client/components'),
        '@styles': path.resolve(__dirname, './src/client/styles'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
      },
      host: true, // allows the Docker container port mapping to work
      strictPort: true, // enforces that only the specified port is used
      port: 5173,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    },
  };
});
