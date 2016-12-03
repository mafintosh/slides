var lexint = require('lexicographic-integer')
var collect = require('stream-collector')
var through = require('through2')
var from = require('from2')
var pump = require('pump')

var noop = function () {}

var Logs = function (db, opts) {
  if (!(this instanceof Logs)) return new Logs(db, opts)
  if (!opts) opts = {}

  this.db = db
  this.sep = opts.separator || opts.sep || '!'
  this.prefix = opts.prefix ? this.sep + opts.prefix + this.sep : ''
  this.valueEncoding = opts.valueEncoding
}

Logs.prototype.key = function (log, seq) {
  return this.prefix + log + this.sep + (seq === -1 ? '\xff' : lexint.pack(seq, 'hex'))
}

Logs.prototype.list = function (cb) {
  var self = this

  var prev = this.prefix
  var rs = from.obj(function (size, cb) {
    collect(self.db.createKeyStream({gt: prev, limit: 1}), function (err, keys) {
      if (err) return cb(err)
      if (!keys.length) return cb(null, null)
      var log = keys[0].slice(0, keys[0].lastIndexOf(self.sep))
      prev = self.key(log, -1)
      cb(null, log)
    })
  })

  return collect(rs, cb)
}

Logs.prototype.get = function (log, seq, cb) {
  this.db.get(this.key(log, seq), {valueEncoding: this.valueEncoding}, cb)
}

Logs.prototype.put = function (log, seq, value, cb) {
  this.db.put(this.key(log, seq), value, {valueEncoding: this.valueEncoding}, cb)
}

Logs.prototype.append = function (log, value, cb) {
  if (!cb) cb = noop
  var self = this

  this.head(log, function (err, seq) {
    if (err) return cb(err)
    self.put(log, seq + 1, value, function (err) {
      if (err) return cb(err)
      cb(null, seq + 1)
    })
  })
}

Logs.prototype.head = function (log, cb) {
  var self = this

  var keys = this.db.createKeyStream({
    gt: this.key(log, 0),
    lt: this.key(log, -1),
    reverse: true,
    limit: 1
  })

  collect(keys, function (err, head) {
    if (err) return cb(err)
    cb(null, head.length ? lexint.unpack(head[0].slice(head[0].lastIndexOf(self.sep) + 1), 'hex') : 0)
  })
}

Logs.prototype.createValueStream = function (log, opts) {
  if (!opts) opts = {}
  return this.db.createValueStream({
    gt: this.key(log, opts.since || 0),
    lt: this.key(log, opts.until || -1),
    valueEncoding: this.valueEncoding,
    reverse: opts.reverse
  })
}

Logs.prototype.createReadStream = function (log, opts) {
  if (!opts) opts = {}

  var self = this

  var rs = this.db.createReadStream({
    gt: this.key(log, opts.since || 0),
    lt: this.key(log, opts.until || -1),
    valueEncoding: this.valueEncoding,
    reverse: opts.reverse
  })

  var format = through.obj(function (data, enc, cb) {
    var key = data.key
    var log = key.slice(0, key.lastIndexOf(self.sep))
    var seq = lexint.unpack(key.slice(log.length + 1), 'hex')
    cb(null, {log: log, seq: seq, value: data.value})
  })

  return pump(rs, format)
}

module.exports = Logs
