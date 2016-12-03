
var Leveljs = require('level-js')

module.exports = require('level-packager')(function(l) {
  return new Leveljs(l)
})
