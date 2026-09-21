import path from 'node:path';
import { defineConfig, defineProject } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    projects: [
      defineProject({
        resolve: {
          alias: {
            '@': path.resolve(__dirname, './src'),
          },
        },
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts'],
          setupFiles: ['./vitest.setup.ts'],
        },
      }),
      defineProject({
        resolve: {
          alias: {
            '@': path.resolve(__dirname, './src'),
          },
        },
        test: {
          name: 'components',
          environment: 'jsdom',
          include: ['src/**/*.test.tsx'],
          setupFiles: ['./vitest.setup.ts'],
        },
      }),
    ],
    coverage: {
      provider: 'v8',
      include: ['src/lib/adjustment-eligibility.ts', 'src/lib/rent-index.ts'],
      thresholds: {
        branches: 90,
      },
    },
  },
});
