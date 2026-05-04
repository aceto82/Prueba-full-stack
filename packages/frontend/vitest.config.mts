import { defineConfig } from 'vitest/config';
import path from 'path';

const rootNodeModules = path.resolve(__dirname, '../node_modules');

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      react: path.resolve(rootNodeModules, 'react'),
      'react-dom': path.resolve(rootNodeModules, 'react-dom'),
      'react-dom/client': path.resolve(rootNodeModules, 'react-dom/client'),
    },
  },
});