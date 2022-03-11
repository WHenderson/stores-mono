import { defineConfig } from 'rollup';
import config from './rollup.config';
import dts from "rollup-plugin-dts";
import fs from "fs";
import {join} from "path";

export default defineConfig({
   ...config,
    plugins: [...(config?.plugins ?? [])].concat([
        dts(),
        {
            name: 'package.json',

            writeBundle(options) {
                const pkg = Object.fromEntries(
                    Object
                        .entries(JSON.parse(fs.readFileSync('package.json', 'utf8')))
                        .filter(([key]) => ![
                            'devDependencies'
                        ].includes(key))
                );

                fs.writeFileSync(
                    join(options.dir || 'dist', 'package.json'),
                    JSON.stringify(pkg, null, 2)
                );
            }
        }
    ])
});
