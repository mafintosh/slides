var tape = require('tape')
var collect = require('stream-collector')
var memdb = require('memdb')
var logs = require('./')

tape('can add', function (t) {
  var lgs = logs(memdb(), {valueEncoding: 'json'})

  lgs.append('mathias', {hello: 'world'}, function () {
    lgs.append('mathias', {hej: 'verden'}, function () {
      collect(lgs.createReadStream('mathias'), function (err, datas) {
        if (err) throw err

        t.same(datas, [{
          log: 'mathias',
          seq: 1,
          value: {
            hello: 'world'
          }
        }, {
          log: 'mathias',
          seq: 2,
          value: {
            hej: 'verden'
          }
        }], 'saved logs')
        t.end()
      })
    })
  })
})
