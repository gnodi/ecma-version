# @gnodi/ecma-version

[Node.js] Need a package to get the ECMAScript version of a browser? You found it!

[![Build][build-image]][build-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Version][version-image]][version-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![Dev Dependencies][dev-dependencies-image]][dev-dependencies-url]

## Installation

Run the following command to add the package to your dev dependencies:
```sh
$ npm install --save @gnodi/ecma-version
```

## Use
```js
const ecmaVersion = require('@gnodi/ecma-version');
```

### Get the ECMAScript version from a browser name and version
```js
ecmaVersion.getFromBrowser('Firefox', 10); // Return 5
ecmaVersion.getFromBrowser('Firefox', 55); // Return 6
```

### Get the ECMAScript version from a user agent
```js
ecmaVersion.getFromUserAgent(
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/53.0.2785.143 Chrome/53.0.2785.143 Safari/537.36'
);
```

### Get the ECMAScript version from a HTTP request object
```js
const http = require('http');

http.createServer((req) => {
  const version = ecmaVersion.getFromRequest(req);

  console.log(version);
}).listen(3080);
```

### Get the browser compatible version for an ECMAScript version
```js
ecmaVersion.getBrowserCompatibleVersion('Firefox', 5); // Return 0
ecmaVersion.getBrowserCompatibleVersion('Firefox', 6); // Return 53
ecmaVersion.getBrowserCompatibleVersion('IE', 6); // Return null
```

### LICENSE

[MIT](LICENSE)

[build-image]: https://img.shields.io/travis/gnodi/ecma-version.svg?style=flat
[build-url]: https://travis-ci.org/gnodi/ecma-version
[coverage-image]:https://coveralls.io/repos/github/gnodi/ecma-version/badge.svg?branch=master
[coverage-url]:https://coveralls.io/github/gnodi/ecma-version?branch=master
[version-image]: https://img.shields.io/npm/v/@gnodi/ecma-version.svg?style=flat
[version-url]: https://npmjs.org/package/@gnodi/ecma-version
[downloads-image]: https://img.shields.io/npm/dm/@gnodi/ecma-version.svg?style=flat
[downloads-url]: https://npmjs.org/package/@gnodi/ecma-version
[dependencies-image]:https://david-dm.org/gnodi/ecma-version.svg
[dependencies-url]:https://david-dm.org/gnodi/ecma-version
[dev-dependencies-image]:https://david-dm.org/gnodi/ecma-version/dev-status.svg
[dev-dependencies-url]:https://david-dm.org/gnodi/ecma-version#info=devDependencies
