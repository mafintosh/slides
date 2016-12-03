# event-source-stream

[EventSource](https://developer.mozilla.org/en-US/docs/Server-sent_events/Using_server-sent_events) implemented in node as a readable stream

``` js
npm install event-source-stream
```

[![build status](http://img.shields.io/travis/mafintosh/event-source-stream.svg?style=flat)](http://travis-ci.org/mafintosh/event-source-stream)
![dat](http://img.shields.io/badge/Development%20sponsored%20by-dat-green.svg?style=flat)

## Usage

``` js
var ess = require('event-source-stream')

ess('http://server-sent-events-demo.herokuapp.com/update')
  .on('data', function(data) {
    console.log('received event:', data)
  })
```

Per default it will retry after 3s when the connection terminates. Change this by setting the `retry` option

``` js
// no retries
ess('http://server-sent-events-demo.herokuapp.com/update', {retry:false}).pipe(...)

// retry after 10s
ess('http://server-sent-events-demo.herokuapp.com/update', {retry:10000}).pipe(...)
```

## Browser support

It also works in the browser using browserify

``` js
var ess = require('event-source-stream') // will use EventSource behind the scene

ess('http://server-sent-events-demo.herokuapp.com/update')
  .on('data', function(data) {
    console.log('recevied event in the browser', data)
  })
```

## License

MIT