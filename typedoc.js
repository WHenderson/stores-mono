module.exports = {
    name: '@crikey/stores-mono',
    out: 'build/docs',
    entryPointStrategy: 'packages',
    entryPoints: [
        'packages/*',
    ],
    /*
    pluginPages: {
        pages: [
            { title: '@crikey/stores-base-queue overview', source: 'stores-base-queue/README.md' }
        ],
        source: 'packages'
    }*/
}
