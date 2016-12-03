# framed-hash

A hash function that wraps all input chunks with a length prefix.

```
npm install framed-hash
```

[![build status](http://img.shields.io/travis/mafintosh/framed-hash.svg?style=flat)](http://travis-ci.org/mafintosh/framed-hash)

## Usage

``` js
var framedHash = require('framed-hash')

var hash = framedHash('sha256')

hash.update('hello')
hash.update('world')

// prints 9054cf26016be468a8b56b40342bd5b479202a40da9fc9056b1ac4c5070343d8
console.log(hash.digest('hex'))

var anotherHash = framedHash('sha256')

anotherHash.update('hell')
anotherHash.update('oworld')

// prints 9cb231ff970f99993c9753364405184fc9024c3f56d98716d90f4913a6c746c0
// since the input chunks were different
console.log(anotherHash.digest('hex'))
```

## API

#### `hash = framedHash(algorithm)`

Create a new hash instance. Algorithm can be anything accepted by `crypto.createHash(algo)`

#### `hash.update(chunk)`

Update the hash. Internally the chunk is prefixed with the length of the chunk and a newline

#### `hash.digest(encoding)`

Returns the digest of the hash.

## License

MIT
