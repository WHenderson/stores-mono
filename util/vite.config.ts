/// <reference types="vitest" />
import {defineConfig} from 'vite'
import rollupConfig from './rollup.config';

export default defineConfig({
    mode: 'production',
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['cjs', 'es'],
            fileName: (format) => `[name].${format === 'es' ? 'mjs' : 'js'}`
        },
        sourcemap: true,
        target: 'esnext',
        minify: false,
        rollupOptions: rollupConfig
    },
    resolve: {
    },
    test: {
        coverage: {
            reportsDirectory: "build/coverage"
        }
    }
});
