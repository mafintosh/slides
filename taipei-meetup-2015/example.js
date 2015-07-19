var interpreter = require('./generated2')

var match = interpreter({
  city: {
    $eq: 'taipei'
  },
  population: {
    $lt: 10
  },
  awesome: {
    $eq: true
  },
  stuff: {
    $not: {
      $eq: 'data'
    }
  }
})

console.log(match.toString())
