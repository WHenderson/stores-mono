import { execSync } from 'child_process';
import { readdirSync } from 'fs';
import * as path from 'path';
import chalk from 'chalk';

function main() {
    console.log(chalk.bold(`JS FOREACH-FOLDER`))
    let args = process.argv.splice(2)
    if (args.length < 1) {
        console.log('Usage: ', chalk.greenBright('forfo "<command>"'))
        console.log(chalk.red('Error: '), '<command> missing!')
    } else if (args.length > 1) {
        console.log('Usage: ', chalk.greenBright('forfo "<command>"'))
        console.log(chalk.red('Error:'), 'too much arguments!')
    } else {
        proceed(args[0])
    }
}

function getDirectories(source) {
  return readdirSync(source, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(name => !name.startsWith('.') && !name.startsWith('_'));
}

function proceed(command) {
    let containerFolder = process.cwd()
    console.log('')
    console.log('current folder: ')
    console.log(chalk.blueBright(containerFolder))
    let subfolders = getDirectories(containerFolder)
    console.log('subfolders: ')
    for (let folder of subfolders.map(f => `'${f}'`)) {
        console.log(chalk.cyanBright(folder))
    }
    console.log('')
    for (let dirName of subfolders) {
        exec(containerFolder, dirName, command)
    }
}

function exec(folder, dirName, command) {
    let dirPath = path.join(folder, dirName)
    console.log(chalk.cyanBright(dirPath) + '$', chalk.greenBright(command))
    process.chdir(dirPath)
    try {
        let outputBuffer = execSync(command)
        var output = outputBuffer.toString()
        if (output.length > 1 && output[output.length - 1] === '\n')
            output = output.substr(0, output.length - 1)
        console.log(output)
        console.log(chalk.greenBright('done'))
    } catch (err) {
        console.log(chalk.red(err))
    }
    console.log('')
}

main()
