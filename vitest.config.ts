import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['tests/**/*.test.ts'], testTimeout: 900000, hookTimeout: 900000, pool: 'forks', reporters: ['verbose'] } });
