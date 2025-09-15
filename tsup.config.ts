import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  ...options,
  entry: ['src/index.ts'],
  dts: {
    // Fixes the module resolution error
    resolve: true,
  },
  format: ["esm", "cjs"],
  // Add these TypeScript-specific settings
  tsconfig: './tsconfig.json', // Explicit path to tsconfig
  target: 'esnext',
  clean: true,
  // Ensure these compiler options are effectively passed
  esbuildOptions(options) {
    options.tsconfig = './tsconfig.json';
  },
}));