import { defineConfig } from 'rollup';
import config from './rollup.config';
import dts from "rollup-plugin-dts";

const plugins = Array.isArray(config.plugins)
    ? config.plugins
    : !!config.plugins
    ? [config.plugins]
    : [];

export default defineConfig({
   ...config,
    plugins: [...plugins, dts()]
});
