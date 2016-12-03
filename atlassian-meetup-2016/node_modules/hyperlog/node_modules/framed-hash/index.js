var crypto = require('crypto')

var FramedHash = function (algo) {
  if (!(this instanceof FramedHash)) return new FramedHash(algo)
  this.hash = crypto.createHash(algo)
}

FramedHash.prototype.update = function (data) {
  this.hash.update((typeof data === 'string' ? Buffer.byteLength(data) : data.length) + '\n')
  this.hash.update(data)
  return this
}

FramedHash.prototype.digest = function (enc) {
  return this.hash.digest(enc)
}

module.exports = FramedHash
