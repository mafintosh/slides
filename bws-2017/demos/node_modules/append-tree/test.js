var tape = require('tape')
var hypercore = require('hypercore')
var ram = require('random-access-memory')
var tree = require('./')

tape('basic', function (t) {
  var tr = create()

  tr.get('/hello', function (err) {
    t.ok(err, 'had error')
    tr.put('/hello', 'world', function (err) {
      t.error(err, 'no error')
      tr.get('/hello', function (err, value) {
        t.error(err, 'no error')
        t.same(value, new Buffer('world'))
        tr.get('/foo', function (err) {
          t.ok(err, 'had error')
          t.end()
        })
      })
    })
  })
})

tape('basic list', function (t) {
  t.plan(5)

  var tr = create()

  tr.put('/hello', 'world', function () {
    tr.list('/', function (err, list) {
      t.error(err, 'no error')
      t.same(list, ['hello'])
    })
    tr.list('/hello', function (err, list) {
      t.error(err, 'no error')
      t.same(list, [])
    })
    tr.list('/hello/world', function (err, list) {
      t.ok(err, 'had error')
    })
  })
})

tape('put twice', function (t) {
  t.plan(4)

  var tr = create()

  tr.put('/hello', 'world', function () {
    tr.put('/world', 'hello', function () {
      tr.get('/hello', function (err, value) {
        t.error(err, 'no error')
        t.same(value, new Buffer('world'))
      })
      tr.get('/world', function (err, value) {
        t.error(err, 'no error')
        t.same(value, new Buffer('hello'))
      })
    })
  })
})

tape('put twice same folder', function (t) {
  t.plan(8)

  var tr = create()

  tr.put('/hello', 'world', function () {
    tr.put('/hello/world', 'hello', function () {
      tr.get('/hello', function (err, value) {
        t.error(err, 'no error')
        t.same(value, new Buffer('world'))
      })
      tr.get('/hello/world', function (err, value) {
        t.error(err, 'no error')
        t.same(value, new Buffer('hello'))
      })
      tr.list('/', function (err, list) {
        t.error(err, 'no error')
        t.same(list, ['hello'])
      })
      tr.list('/hello', function (err, list) {
        t.error(err, 'no error')
        t.same(list, ['world'])
      })
    })
  })
})

tape('put twice same folder diff root', function (t) {
  t.plan(8)

  var tr = create()

  tr.put('/root', 'root', function () {
    tr.put('/hello', 'world', function () {
      tr.put('/hello/world', 'hello', function () {
        tr.get('/hello', function (err, value) {
          t.error(err, 'no error')
          t.same(value, new Buffer('world'))
        })

        tr.get('/hello/world', function (err, value) {
          t.error(err, 'no error')
          t.same(value, new Buffer('hello'))
        })

        tr.list('/', function (err, list) {
          t.error(err, 'no error')
          t.same(list, ['root', 'hello'])
        })

        tr.list('/hello', function (err, list) {
          t.error(err, 'no error')
          t.same(list, ['world'])
        })
      })
    })
  })
})

tape('put three times', function (t) {
  t.plan(6)

  var tr = create()

  tr.put('/hello', 'world', function () {
    tr.put('/world', 'hello', function () {
      tr.put('/hello/world', 'hi', function () {
        tr.get('/hello', function (err, value) {
          t.error(err, 'no error')
          t.same(value, new Buffer('world'))
        })
        tr.get('/world', function (err, value) {
          t.error(err, 'no error')
          t.same(value, new Buffer('hello'))
        })
        tr.get('/hello/world', function (err, value) {
          t.error(err, 'no error')
          t.same(value, new Buffer('hi'))
        })
      })
    })
  })
})

tape('put four times', function (t) {
  t.plan(19)

  var tr = create()

  tr.put('/hello', 'world', function () {
    tr.put('/world', 'hello', function () {
      tr.put('/hello/world', 'hi', function () {
        tr.put('/world/hello', 'hi', function () {
          tr.get('/hello', function (err, value) {
            t.error(err, 'no error')
            t.same(value, new Buffer('world'))
          })
          tr.get('/world', function (err, value) {
            t.error(err, 'no error')
            t.same(value, new Buffer('hello'))
          })
          tr.get('/hello/world', function (err, value) {
            t.error(err, 'no error')
            t.same(value, new Buffer('hi'))
          })
          tr.get('/world/hello', function (err, value) {
            t.error(err, 'no error')
            t.same(value, new Buffer('hi'))
          })
          tr.list('/', function (err, list) {
            t.error(err, 'no error')
            t.same(list, ['hello', 'world'])
          })
          tr.list('/hello', function (err, list) {
            t.error(err, 'no error')
            t.same(list, ['world'])
          })
          tr.list('/world', function (err, list) {
            t.error(err, 'no error')
            t.same(list, ['hello'])
          })
          tr.list('/world/foo', function (err) {
            t.ok(err, 'had error')
          })
          tr.list('/world/hello', function (err, list) {
            t.error(err, 'no error')
            t.same(list, [])
          })
          tr.list('/hello/world', function (err, list) {
            t.error(err, 'no error')
            t.same(list, [])
          })
        })
      })
    })
  })
})

tape('put and delete', function (t) {
  t.plan(2)

  var tr = create()

  tr.put('/hello', 'world', function () {
    tr.del('/hello', function () {
      tr.list('/hello', function (err) {
        t.ok(err, 'had error')
      })
      tr.get('/hello', function (err, node) {
        t.ok(err, 'had error')
      })
    })
  })
})

tape('twice put and delete', function (t) {
  t.plan(4)

  var tr = create()

  tr.put('/world', 'hello', function () {
    tr.put('/hello', 'world', function () {
      tr.del('/hello', function () {
        tr.list('/', function (err, list) {
          t.error(err, 'no error')
          t.same(list, ['world'])
        })
        tr.get('/hello', function (err) {
          t.ok(err, 'had error')
        })
        tr.get('/world', function (err) {
          t.error(err, 'no error')
        })
      })
    })
  })
})

tape('twice put (opposite order) and delete', function (t) {
  t.plan(4)

  var tr = create()

  tr.put('/hello', 'world', function () {
    tr.put('/world', 'hello', function () {
      tr.del('/hello', function () {
        tr.list('/', function (err, list) {
          t.error(err, 'no error')
          t.same(list, ['world'])
        })
        tr.get('/hello', function (err) {
          t.ok(err, 'had error')
        })
        tr.get('/world', function (err) {
          t.error(err, 'no error')
        })
      })
    })
  })
})

tape('many puts and delete', function (t) {
  t.plan(8)

  var tr = create()

  tr.put('/hello', 'a')
  tr.put('/hello', 'b')
  tr.put('/hello', 'c')
  tr.put('/world/foo', 'bar')
  tr.put('/world', 'baz')
  tr.put('/world', 'hello', function () {
    tr.del('/hello')
    tr.put('/hello', 'world', function () {
      tr.del('/world', function () {
        tr.list('/', function (err, list) {
          t.error(err, 'no error')
          t.same(list.sort(), ['hello', 'world'])
        })
        tr.get('/hello', function (err, val) {
          t.error(err, 'no error')
          t.same(val, new Buffer('world'))
        })
        tr.get('/world/foo', function (err, val) {
          t.error(err, 'no error')
          t.same(val, new Buffer('bar'))
        })
        tr.list('/world', function (err, list) {
          t.error(err, 'no error')
          t.same(list, ['foo'])
        })
      })
    })
  })
})

tape('many puts and delete 2', function (t) {
  t.plan(7)

  var tr = create()

  tr.put('/a/b/c/d/e', '0')
  tr.put('/a', '1')
  tr.put('/a/a', '2')
  tr.put('/a/b/c/d/f', '3')
  tr.del('/a/b/c/d/f', function () {
    tr.get('/a', function (err, val) {
      t.error(err, 'no error')
      t.same(val, new Buffer('1'))
    })
    tr.get('/a/a', function (err, val) {
      t.error(err, 'no error')
      t.same(val, new Buffer('2'))
    })
    tr.get('/a/b/c/d/e', function (err, val) {
      t.error(err, 'no error')
      t.same(val, new Buffer('0'))
    })
    tr.get('/a/b/c/d/f', function (err) {
      t.ok(err, 'had error')
    })
  })
})

tape('many puts and delete 2 (opposite)', function (t) {
  t.plan(7)

  var tr = create()

  tr.put('/a/b/c/d/e', '0')
  tr.put('/a', '1')
  tr.put('/a/a', '2')
  tr.put('/a/b/c/d/f', '3')
  tr.del('/a/b/c/d/e', function () {
    tr.get('/a', function (err, val) {
      t.error(err, 'no error')
      t.same(val, new Buffer('1'))
    })
    tr.get('/a/a', function (err, val) {
      t.error(err, 'no error')
      t.same(val, new Buffer('2'))
    })
    tr.get('/a/b/c/d/f', function (err, val) {
      t.error(err, 'no error')
      t.same(val, new Buffer('3'))
    })
    tr.get('/a/b/c/d/e', function (err) {
      t.ok(err, 'had error')
    })
  })
})

tape('valueEncoding', function (t) {
  var tr = create({valueEncoding: 'json'})

  tr.put('/', {hello: 'world'}, function () {
    tr.get('/', function (err, val) {
      t.error(err, 'no error')
      t.same(val, {hello: 'world'})
      t.end()
    })
  })
})

tape('checkout', function (t) {
  t.plan(6)

  var tr = create()

  tr.put('/', 'foo')
  tr.put('/foo', 'bar')
  tr.del('/foo')
  tr.put('/bar', 'baz')
  tr.put('/bar', 'meh', function () {
    var old1 = tr.checkout(0)

    old1.list('/', function (err, list) {
      t.error(err, 'no error')
      t.same(list, [])
    })

    var old2 = tr.checkout(3)

    old2.list('/', function (err, list) {
      t.error(err, 'no error')
      t.same(list, ['bar'])
    })

    old2.get('/bar', function (err, val) {
      t.error(err, 'no error')
      t.same(val, new Buffer('baz'))
    })
  })
})

tape('history stream', function (t) {
  var tr = create()

  tr.put('/', 'foo')
  tr.put('/foo', 'bar')
  tr.del('/foo')
  tr.put('/bar', 'baz', function () {
    var expected = [{
      type: 'put',
      version: 0,
      name: '/',
      value: new Buffer('foo')
    }, {
      type: 'put',
      version: 1,
      name: '/foo',
      value: new Buffer('bar')
    }, {
      type: 'del',
      version: 2,
      name: '/foo',
      value: null
    }, {
      type: 'put',
      version: 3,
      name: '/bar',
      value: new Buffer('baz')
    }]

    tr.history()
      .on('data', function (data) {
        t.same(data, expected.shift())
      })
      .on('end', function () {
        t.same(expected.length, 0)
        t.end()
      })
  })
})

function create (opts) {
  return tree(hypercore(ram), opts)
}
