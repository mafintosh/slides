var genobj = require('generate-object-property')
var compileQuery = function (query) {
  var fns = Object.keys(query || {}).map(function (name) {
    return compileProperty(name, query[name])
  })

  return every(fns)
}

var every = function (fns) {
  if (!fns || !fns.length) {
    return 'true'
  }

  return '(' + fns.join(' && ') + ')'
}

var compileProperty = function (name, prop) {
  var fns = Object.keys(prop).map(function (op) {
    // op is $eq
    switch (op) {
      case '$eq':
      return genobj('doc', name)
        + ' === '
        + JSON.stringify(prop[op])

      case '$lt':
      return genobj('doc', name)
        + ' < '
        + JSON.stringify(prop[op])

      case '$gt':
      return genobj('doc', name)
        + ' > '
        + JSON.stringify(prop[op])

      case '$not':
      var fn = compileProperty(name, prop[op])
      return '!(' + fn + ')'
    }

    return 'false'
  })

  return every(fns)
}

module.exports = function (query) {
  var match = compileQuery(query)
  var fn = new Function('doc', 'return ' + match)
  return fn
}



