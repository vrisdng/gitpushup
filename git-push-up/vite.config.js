import { defineConfig } from 'vite';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    target: 'node', // Target Node.js environment
    lib: {
      entry: './src/extension.ts',
      formats: ['cjs'], // CommonJS format for VS Code extensions
      fileName: () => 'extension.js',
    },
    outDir: 'dist', // Output directory
    sourcemap: 'nosources', // Generate source maps without showing source code
    rollupOptions: {
      external: [
        'vscode', // Exclude the VS Code module from bundling
      ],
      output: {
        exports: 'named', // Ensure named exports work correctly
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Optional: Alias for src folder
    },
    extensions: ['.ts', '.js'], // Resolve TypeScript and JavaScript files
  },
  plugins: [
    nodeResolve(), // Ensure dependencies are resolved correctly
    dts({ entryRoot: './src', outputDir: 'dist/types' }), // Generate TypeScript declaration files
  ],
});
