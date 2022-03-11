import { defineConfig } from 'rollup';
// @ts-ignore
import autoExternal from 'rollup-plugin-auto-external';

export default defineConfig({
    input: {
        'index': 'src/index.ts'
    },
    output: {
        sourcemapExcludeSources: true,
        dir: 'dist'
    },
    plugins: [
        autoExternal()
    ]
});
