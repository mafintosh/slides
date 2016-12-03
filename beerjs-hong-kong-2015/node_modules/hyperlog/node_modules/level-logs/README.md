# level-logs

Store multiple append only logs in leveldb.

```
npm install level-logs
```

[![build status](http://img.shields.io/travis/mafintosh/level-logs.svg?style=flat)](http://travis-ci.org/mafintosh/level-logs)

## Usage

``` js
var logs = require('level-logs')(db) // where db is a levelup

logs.append('mathias', 'hello', function (err) {
  logs.append('mathias', 'world', function (err) {
    logs.createReadStream('mathias')
      .on('data', function (data) {
        console.log(data)
      })
  })
})
```

Running the above outputs

``` js
{
  log: 'mathias',
  seq: 1,
  value: 'hello'
}
{
  log: 'mathias',
  seq: 2,
  value: 'world'
}
```

## API

#### `logs = levelLogs(db, [options])`

Create a new logs instance. Options include

```
{
  valueEncoding: 'json', // set a levelup value encoding
  prefix: 'logs',        // prefix all keys with this prefix
  separator: '!'         // use this as log key separator
}
```

#### `logs.append(log, value, cb)`

Append a value to a log.

#### `logs.put(log, seq, value, [cb])`

Insert a value into a log at position `seq`. Normally you want seq to be the head of the log +1.
This method is useful if you want to cache the head position of the log somehow.

``` js
logs.head('mathias', function (err, seq) {
  logs.put('mathias', seq + 1, 'hello', function (err) {
    ...
  })
})
```

#### `logs.get(log, seq, cb)`

Get a value from a log at position `seq`

#### `logs.head(seq, cb)`

The the head `seq` of a log. If the log doesn't exist the head will be `0`

``` js
logs.head('some-log', function (err, seq) {
  console.log('head of some-log is', seq)
})
```

#### `stream = logs.list()`

Return a list of all logs names as a readable stream

``` js
var names = logs.list()

names.on('data', function (name) {
  console.log('there is a log called', name)
})
```

#### `key = logs.key(log, seq)`

Get the leveldb key the value stored in a log at position `seq`.
This is useful if you want to batch multiple operations together.

## License

MIT
