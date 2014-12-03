var level = require('level')
var db = level('db')

db.createReadStream().on('data', function(data) {
  console.log(data)
})