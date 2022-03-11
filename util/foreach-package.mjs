import { execSync } from 'child_process';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';
import chalk from 'chalk';

function main() {
    const command = process.argv[2];
    const root = process.cwd();
    const pkg = JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../package.json')), 'utf8');

    const packages = pkg["mono:packages"];

    packages.forEach(pkg => {
        const workingDir = path.join(root, pkg);
        console.log(chalk.cyanBright(workingDir) + '$', chalk.greenBright(command));
        process.chdir(workingDir);

        try {
            const output = execSync(command).toString();
            console.log(output.endsWith('\n') ? output.slice(0, -1) : output)
            console.log(chalk.greenBright('done'))
        } catch (err) {
            console.error(err);
        }
        console.log('');
    })
}

main();
