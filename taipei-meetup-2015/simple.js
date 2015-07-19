var queryMatches = function (doc, query) {
  return Object.keys(query || {}).every(function (name) {
    return propertyMatches(doc, name, query[name])
  })
}

// ==>

var compileProperty = function (name, subQuery) {
  return Object.keys(subQuery).every(function (op) {
    // op is $eq
    switch (op) {
      case '$eq':
      return function (doc) {
        return doc[name] === subQuery[op]
      }


      case '$lt':
      return function (doc) {
        return doc[name] < subQuery[op]
      }

      case '$gt':
      return function (doc) {
        return doc[name] > subQuery[op]
      }

      case '$not':
      return function (doc) {
        return !propertyMatches(doc, name, subQuery[op])
      }
    }

    return function (doc) {
      return false
    }
  })
}

var propertyMatches = function (doc, name, subQuery) {
  return Object.keys(subQuery).every(function (op) {
    // op is $eq
    switch (op) {
      case '$eq':
      return doc[name] === subQuery[op]

      case '$lt':
      return doc[name] < subQuery[op]

      case '$gt':
      return doc[name] > subQuery[op]

      case '$not':
      return !propertyMatches(doc, name, subQuery[op])
    }

    return false
  })
}

module.exports = function (query) {
  return function (doc) {
    return queryMatches(doc, query)
  }
}