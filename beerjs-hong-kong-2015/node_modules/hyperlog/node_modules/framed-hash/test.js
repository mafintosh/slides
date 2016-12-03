var tape = require('tape')
var framedHash = require('./')

tape('works', function (t) {
  var hash = framedHash('sha256')

  hash.update('hello')
  hash.update('world')

  var str = hash.digest('hex')
  t.ok(str, 'digest worked')

  var hash2 = framedHash('sha256')

  hash2.update('hello')
  hash2.update('world')

  t.same(hash2.digest('hex'), str, 'same hash as before')
  t.end()
})

tape('different chunks, different hashes', function (t) {
  var hash = framedHash('sha256')

  hash.update('hello')
  hash.update('world')

  var str = hash.digest('hex')
  t.ok(str, 'digest worked')

  var hash2 = framedHash('sha256')

  hash2.update('hell')
  hash2.update('oworld')

  t.ok(hash2.digest('hex') !== str, 'different hashes')
  t.end()
})
