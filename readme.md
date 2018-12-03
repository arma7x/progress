# Progress

> Simple PWA to track your life goals and progress stored in IndexDB

## Install

```sh
git clone https://github.com/arma7x/progress
cd progress
npm install
npm run build
npm start
```

> :exclamation: **Pro Tip:** Use [Yarn](https://yarnpkg.com/) to install dependencies 3x faster than NPM!

## Features

* Offline Caching (via `serviceWorker`)
* SASS & Autoprefixer
* Asset Versioning (aka "cache-busting")
* ES2015 (ES6) and ES2016 (ES7) support
* Hot Module Replacement (HMR) for all files
* Preact's [Developer Tools](#preact-developer-tools)

## Development

### Commands

Any of the following commands can (and should :wink:) be run from the command line.

> If using [Yarn](https://yarnpkg.com/), all instances of `npm` can be replaced with `yarn`. :ok_hand:

#### build

```
$ npm run build
```

Compiles all files. Output is sent to the `dist` directory.

#### start

```
$ npm start
```

Runs your application (from the `dist` directory) in the browser.

#### watch

```
$ npm run watch
```

Like [`start`](#start), but will auto-compile & auto-reload the server after any file changes within the `src` directory.

### Preact Developer Tools

You can inspect and modify the state of your Preact UI components at runtime using the [React Developer Tools](https://github.com/facebook/react-devtools) browser extension.

1. Install the [React Developer Tools](https://github.com/facebook/react-devtools) extension
2. [Import the `preact/devtools`](src/index.js#L23) module in your app
3. Reload and go to the 'React' tab in the browser's development tools

## License

MIT
