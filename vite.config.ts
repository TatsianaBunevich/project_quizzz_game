/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
	build: {
		rollupOptions: {
			external: ['**/*.test.tsx', '*.test.ts'],
		},
	},
	test: {
		environment: 'jsdom',
		globals: true,
		coverage: {
			reporter: ['text', 'html'],
			reportOnFailure: true,
		},
	}
})
