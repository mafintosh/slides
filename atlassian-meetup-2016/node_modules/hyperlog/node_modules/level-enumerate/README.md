# level-enumerate

Enumerate keys to incrementing numbers.
If you enumerate the same key twice it will enumerate to the same value.

```
npm install level-enumerate
```

[![build status](http://img.shields.io/travis/mafintosh/level-enumerate.svg?style=flat)](http://travis-ci.org/mafintosh/level-enumerate)

## Usage

``` js
var enumerator = require('level-enumerate')
var enumerate = enumerator(db) // where db is a levelup

enumerate('hello', function (err, value) {
  console.log(value) // prints 0
  enumerate('hello', function (err, value) {
    console.log(value) // prints 0 again
    enumerate('world', function (err, value) {
      console.log(value) // prints 1
    })
  })
})
```

## API

#### `enumerate = enumerator(db, [options])`

Create a new enumerator. Options include

``` js
{
  sep: '!'    // the separator used when storing the key values
  prefix: ... // optional string prefix to use when keys when stored
}
```

## License

MIT
