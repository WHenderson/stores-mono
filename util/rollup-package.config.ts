import { defineConfig } from 'rollup';
import config from './rollup.config';
import dts from "rollup-plugin-dts";

export default defineConfig({
   ...config,
    plugins: [...(config?.plugins ?? [])].concat([
        dts()
    ])
});
