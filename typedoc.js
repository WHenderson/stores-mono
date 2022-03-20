module.exports = {
    name: '@crikey/stores-mono',
    out: 'docs',
    entryPointStrategy: 'packages',
    entryPoints: [
        'packages/stores-dynamic',
        'packages/stores-base-queue',
        'packages/stores-base',
        'packages/stores-const',
        'packages/stores-promise',
        'packages/stores-strict',
        'packages/stores-svelte',
        'packages/stores-immer',
        'packages/stores-rxjs',
        'packages/stores-selectable',
    ],
    /*
    pluginPages: {
        pages: [
            { title: '@crikey/stores-base-queue overview', source: 'stores-base-queue/README.md' }
        ],
        source: 'packages'
    }*/
}
