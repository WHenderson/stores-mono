# Contributing to @crikey/stores-mono or any of its packages

@crikey/stores-mono is a mono repo consisting of several packages centred around [Svelte](https://svelte.dev/) 
compatible stores.

The [Open Source Guides](https://opensource.guide/) website has a collection of resources for individuals, communities, and companies. These resources help people who want to learn how to run and contribute to open source projects. Contributors and people new to open source alike will find the following guides especially useful:

* [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
* [Building Welcoming Communities](https://opensource.guide/building-community/)

## Installation

1. Ensure you have [pnpm](https://pnpm.io/installation) installed
2. After cloning the repository, run `pnpm install` in the root of the repository
3. Use the scripts provided in `package.json` to test and build your changes. Scripts are provided at the root level 
and for individual packages

### Notable Scripts

Scripts can be run via `pnpm run <script>` or via your chosen IDE. 

* `build` - build a release which can be found in `dist`
* `build:docs` - build html documentation which can be found in `build/docs`
* `clean` - delete output folders such as `dist` and `build`
* `clean:node_modules` - delete `node_modules` folders
* `test` - run vitest once
* `test:watch` - run vitest, rerunning tests as required
* `test:tsc` - run typescript tests
* `test:tsc:watch` - run typescript tests, rerunning tests as required
* `debug` - run vitest once without threading or isolation which can be helpful for some debuggers
* `coverage` - run vitest and create a coverage report which can be found in `build/coverage`
* `coverage:watch` - run vitest and create a coverage, rerunning tests and adjusting coverage report as needed**
* `coverage:per-package` - generate distinct coverage reports for each package


** coverage generated using watch is sometimes inaccurate
