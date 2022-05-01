module.exports = {
    name: '@crikey/stores-mono',
    out: 'build/docs',
    entryPointStrategy: 'packages',
    entryPoints: [
        'packages/*',
    ],
    readme: 'README.TYPEDOC.md',
    pluginPages: {

    },
    pluginMonorepoReadmes: {
        readme: ['README.TYPEDOC.md', 'README.md']
    }
    /*
    pluginPages: {
        pages: [
            { title: '@crikey/stores-base-queue overview', source: 'stores-base-queue/README.md' }
        ],
        source: 'packages'
    }*/
}
