var level = require('level')
var db = level('db')

db.put('hello', 'world', function () {
  db.get('hello', function (err, val) {
    console.log(err, val)
  })
})