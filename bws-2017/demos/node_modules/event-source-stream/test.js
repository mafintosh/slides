var tape = require('tape')
var http = require('http')
var ess = require('./')

var server = http.createServer(function(req, res) {
  if (req.url === '/multiline') {
    res.write('data: a\n')
    res.write('data: b\n\n')
  }
  if (req.url === '/basic') {
    res.write('data: hello world\n\n')
  }
  if (req.url === '/header') {
    res.write('data: hello ' + req.headers.custom + '\n\n')
  }
  if (req.url === '/crash') {
    res.write('data: test\n\n')
    res.end()
  }
})

server.listen(0, function() {
  server.unref()
  var addr = 'http://localhost:'+server.address().port

  tape('events', function(t) {
    var stream = ess(addr+'/basic')

    stream.on('data', function(data) {
      stream.destroy()
      t.same(data, 'hello world')
      t.end()
    })
  })

  tape('multiline events', function(t) {
    var stream = ess(addr+'/multiline')

    stream.on('data', function(data) {
      stream.destroy()
      t.same(data, 'a\nb')
      t.end()
    })
  })

  tape('retry', function(t) {
    var stream = ess(addr+'/crash', {retry:100})
    var cnt = 2

    stream.on('data', function(data) {
      if (!--cnt) {
        stream.destroy()
        t.end()
      }
      t.same(data, 'test')
    })
  })

  tape('send custom header', function(t) {
    var headerValue = 'value'
    var stream = ess(addr+'/header', {request: {headers: {Custom: headerValue}}})

    stream.on('data', function(data) {
      stream.destroy()
      t.same(data, 'hello ' + headerValue)
      t.end()
    })
  })
})
