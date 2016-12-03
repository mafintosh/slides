var tape = require('tape')
var memdb = require('memdb')
var enumerator = require('./')

tape('one value', function (t) {
  var db = memdb()
  var enumerate = enumerator(db)

  enumerate('hello', function(err, value) {
    if (err) throw err
    t.same(value, 0, 'first one is 0')
    enumerate('hello', function(err, value) {
      if (err) throw err
      t.same(value, 0, 'still 0')
      t.end()
    })
  })
})

tape('two values', function (t) {
  var db = memdb()
  var enumerate = enumerator(db)

  enumerate('hello', function(err, value) {
    if (err) throw err
    t.same(value, 0, 'first one is 0')
    enumerate('world', function(err, value) {
      if (err) throw err
      t.same(value, 1, 'second one is 1')
      t.end()
    })
  })
})

tape('chaotic enumeration', function (t) {
  var db = memdb()
  var enumerate = enumerator(db)

  var values = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n']
  var map = {}

  t.plan(values.length * 10 - values.length)

  for (var i = 0; i < 10; i++) {
    values.forEach(function(v) {
      var add = function () {
        enumerate(v, function (err, num) {
          if (err) throw err
          if (typeof map[v] === 'number') t.same(num, map[v], 'consistent enumeration')
          map[v] = num
        })
      }

      setTimeout(add, (Math.random() * 100) | 0)
    })
  }
})
