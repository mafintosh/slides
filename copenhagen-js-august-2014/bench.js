var gen = require('./example')

var t = Date.now()

for (var i = 0; i < 100000; i++) {
  gen()
}

console.log(Date.now() - t)