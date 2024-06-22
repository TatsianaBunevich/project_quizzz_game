/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
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