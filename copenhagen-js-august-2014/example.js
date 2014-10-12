var genfun = require('generate-function')

var generator = function(dim) {
  var fn = genfun('function() {')
    ('return [')

  for (var i = 0; i < dim; i++) {
    if (i) fn(',')
    var row = '['
    for (var j = 0; j < dim; j++) {
      row = row+'0,'
    }
    row = row.slice(0, -1)+']'
    fn(row)
  }

  fn
    (']')
    ('}')

  return fn.toFunction()
}

module.exports = generator(100)