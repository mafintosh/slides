var test = require('tape')
var limit = require('./')

test('errors if limit exceeded', function exceeded (t) {
  var limiter = limit(5) // 5 byte limit

  limiter.on('error', function errored (error) {
    t.ok(error, 'got error')
    t.equal(error.message, 'Limit exceeded', 'got correct error message')
    t.end()
  })

  limiter.write(new Buffer(6))
  limiter.end()
})

test('does not error if limit not exceeded', function okay (t) {
  var limiter = limit(5) // 5 byte limit

  limiter.on('error', function errored (error) {
    t.ifErr(error, 'did not get error')
  })

  limiter.on('finish', function finished () {
    t.ok(true, 'finished without error')
    t.end()
  })

  limiter.write(new Buffer(4))
  limiter.end()
})
