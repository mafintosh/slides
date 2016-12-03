var logs = require('./')
var memdb = require('memdb')

var lgs = logs(memdb(), {valueEncoding: 'json'})

lgs.append('karissa', 'lol', function () {
  lgs.append('karissa', 'lol', function () {
    lgs.append('karissa', 'lol', function () {
      lgs.append('max', {hi: 42}, function () {
        lgs.append('max', {hi: 42}, function () {
          lgs.append('mathias', {hello: 'world'}, function () {
            lgs.append('mathias', {hello: 'world'}, function () {
              lgs.list().on('data', console.log)
            })
          })
        })
      })
    })
  })
})
