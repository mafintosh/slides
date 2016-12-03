var varint = require('varint')
var stream = require('readable-stream')
var util = require('util')

var Decoder = function () {
  if (!(this instanceof Decoder)) return new Decoder()
  stream.Transform.call(this)

  this._missing = 0
  this._message = null
  this._prefix = new Buffer(100)
  this._ptr = 0
}

util.inherits(Decoder, stream.Transform)

Decoder.prototype._push = function (message) {
  this._ptr = 0
  this._missing = 0
  this._message = null
  this.push(message)
}

Decoder.prototype._parseLength = function (data, offset) {
  for (offset; offset < data.length; offset++) {
    this._prefix[this._ptr++] = data[offset]
    if (!(data[offset] & 0x80)) {
      this._missing = varint.decode(this._prefix)
      this._ptr = 0
      return offset + 1
    }
  }
  return data.length
}

Decoder.prototype._parseMessage = function (data, offset) {
  var free = data.length - offset
  var missing = this._missing

  if (!this._message) {
    if (missing <= free) { // fast track - no copy
      this._push(data.slice(offset, offset + missing))
      return offset + missing
    }
    this._message = new Buffer(missing)
  }

  // TODO: add opt-in "partial mode" to completely avoid copys
  data.copy(this._message, this._ptr, offset, offset + missing)

  if (missing <= free) {
    this._push(this._message)
    return offset + missing
  }

  this._missing -= free
  this._ptr += free

  return data.length
}

Decoder.prototype._transform = function (data, enc, cb) {
  var offset = 0

  while (offset < data.length) {
    if (this._missing) offset = this._parseMessage(data, offset)
    else offset = this._parseLength(data, offset)
  }

  cb()
}

module.exports = Decoder
