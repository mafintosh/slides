var mutexify = require('mutexify')

var enumerator = function (db, opts) {
  if (!opts) opts = {}

  var sep = opts.sep || '!'
  var prefix = opts.prefix ? sep + opts.prefix + sep : ''
  var keyPrefix = prefix + sep

  var count = 0
  var lock = mutexify()

  var getCount = function (cb) {
    if (count) return cb(null, count)
    db.get(keyPrefix, {valueEncoding: 'utf-8'}, function (err, cnt) {
      if (err && !err.notFound) return cb(err)
      count = Number(cnt || 0)
      cb(null, count)
    })
  }

  var insert = function (prevCount, key, cb) {
    lock(function (release) {
      var inc = function() {
        getCount(function(err, cnt) {
          if (err) return release(cb, err)

          var batch = [{
            type: 'put',
            key: key,
            valueEncoding: 'utf-8',
            value: count.toString()
          }, {
            type: 'put',
            key: keyPrefix,
            valueEncoding: 'utf-8',
            value: (count + 1).toString()
          }]

          db.batch(batch, function (err) {
            if (err) return release(cb, err)
            count++
            release(cb, null, count - 1)
          })
        })
      }

      if (prevCount === count) return inc()

      db.get(key, {valueEncoding: 'utf-8'}, function (err, num) {
        if (err && !err.notFound) return release(cb, err)
        if (num) return release(cb, null, Number(num))
        inc()
      })
    })
  }

  return function (key, cb) {
    if (!key) throw new Error('key is required')

    key = keyPrefix + key

    db.get(key, {valueEncoding: 'utf-8'}, function (err, num) {
      if (err && !err.notFound) return cb(err)
      if (num) return cb(null, Number(num))
      insert(count, key, cb)
    })
  }
}

module.exports = enumerator
