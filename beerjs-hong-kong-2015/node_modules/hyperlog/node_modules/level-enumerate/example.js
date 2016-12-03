var level = require('level')
var enumerator = require('./')

var db = level('db')
var enumerate = enumerator(db)

var add = function(key) {
  enumerate(key, function (err, value) {
    if (err) throw err
    console.log('%s -> %d', key, value)
  })
}

add('hello')
add('world')
add('how')
add('are')
add('you')
add('doing')
