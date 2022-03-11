/// <reference types="vitest" />
import { defineConfig } from 'vite'
import {resolve,join} from 'path';
import rollupConfig from './rollup.config';

export default defineConfig({
    mode: 'production',
    build: {
        lib: {
            entry: resolve(join(__dirname, '../packages/svelte'), 'src/index.ts'),
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
    }
});
