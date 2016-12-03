# size-limit-stream

[![NPM](https://nodei.co/npm/size-limit-stream.png)](https://nodei.co/npm/size-limit-stream/)

[![js-standard-style](https://raw.githubusercontent.com/feross/standard/master/badge.png)](https://github.com/feross/standard)

[![Build Status](https://travis-ci.org/maxogden/size-limit-stream.svg?branch=master)](https://travis-ci.org/maxogden/size-limit-stream)

a through stream that destroys itself if an overall size limit for the combined stream throughput is exceeded. useful for e.g. limiting HTTP upload size

## usage

### `limitStream(limit)`

returns a through stream

example:

```js
var limiter = limitStream(1024 * 5) // 5kb max
```

## example

create a stream that concatenates input, but only if input is less than the limit:

```
var pumpify = require('pumpify')
var concat = require('concat-stream')
var limitStream = require('size-limit-stream')

function uploadStream (cb) {
  var limiter = limitStream(1024 * 5) // 5kb max
  var concatter = concat(function concatted (buff) {
    cb(null, buff)
  })

  var combined = pumpify(limiter, concatter)
  combined.on('error', cb)
  
  return combined
}
```
