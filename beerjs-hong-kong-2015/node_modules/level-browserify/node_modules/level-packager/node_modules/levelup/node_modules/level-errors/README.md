
# level-errors

<img alt="LevelDB Logo" height="100" src="http://leveldb.org/img/logo.svg">

**Error module for [LevelUP](https://github.com/rvagg/node-levelup)**

[![Build Status](https://travis-ci.org/Level/errors.png)](https://travis-ci.org/Level/errors)

## Usage

```js
var levelup = require('levelup')
var errors = levelup.errors

levelup('./db', { createIfMissing: false }, function (err, db) {
  if (err instanceof errors.OpenError) {
    console.log('open failed because expected db to exist')
  }
})
```

## Publishers

* [@ralphtheninja](https://github.com/ralphtheninja)
* [@juliangruber](https://github.com/juliangruber)

## License &amp; copyright

Copyright (c) 2012-2015 LevelUP contributors.

LevelUP is licensed under the MIT license. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE.md file for more details.
