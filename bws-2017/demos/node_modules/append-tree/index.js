var mutexify = require('mutexify')
var varint = require('varint')
var messages = require('./messages')
var codecs = require('codecs')
var inherits = require('inherits')
var events = require('events')

module.exports = Tree

function Tree (feed, opts) {
  if (!(this instanceof Tree)) return new Tree(feed, opts)
  if (!opts) opts = {}

  events.EventEmitter.call(this)

  this._offset = opts.offset || 0
  this._codec = opts.codec || codecs(opts.valueEncoding)
  this._head = typeof opts.checkout === 'number' ? opts.checkout : -1
  this._lock = mutexify()

  this.feed = feed
  this.version = this._head

  var self = this

  this.ready(function (err) {
    if (!err) self.emit('ready')
  })
}

inherits(Tree, events.EventEmitter)

Tree.prototype.put = function (name, value, cb) {
  var self = this
  var names = split(name)

  this._lock(function (release) {
    self.head(function (err, head, seq) {
      if (err) return done(err)
      if (self._checkout > -1) return done(new Error('Cannot delete on a checkout'))
      if (!head) self._init(names, value, done)
      else self._put(head, seq, names, value, done)
    })

    function done (err) {
      release(cb, err)
    }
  })
}

Tree.prototype._put = function (head, seq, names, value, cb) {
  var self = this
  var i = 0
  var end = names.length + 1
  var index = []
  var len = self.feed.length

  loop(null, null, null)

  function loop (err, nodes, seqs) {
    if (err) return cb(err)

    if (nodes) {
      var result = []

      for (var j = 0; j < nodes.length; j++) {
        if (split(nodes[j].name)[i - 1] !== names[i - 1]) {
          result.push(seqs[j])
        }
      }

      result.push(len)
      index.push(result)
    }

    if (i === end) {
      var node = {
        name: join(names),
        value: self._codec.encode(value),
        index: self._deflate(len, index)
      }

      self.version = self.feed.length
      self.feed.append(messages.Node.encode(node), cb)
      return
    }

    self._list(head, seq, names.slice(0, i++), loop)
  }
}

Tree.prototype.list = function (name, opts, cb) {
  if (typeof opts === 'function') return this.list(name, null, opts)
  if (!opts) opts = {}

  var self = this
  var names = split(name)
  var ns = !!(opts.node || opts.nodes)

  this.head(function (err, head, seq) {
    if (err) return cb(err)
    if (!head) return cb(notFound(names))

    self._list(head, seq, names, onnodes)

    function onnodes (err, nodes) {
      if (err) return cb(err)
      if (!nodes.length) return cb(notFound(names))

      var list = []
      for (var i = 0; i < nodes.length; i++) {
        var nodeNames = split(nodes[i].name)
        if (nodeNames.length > names.length) list.push(ns ? nodes[i] : nodeNames[names.length])
      }

      cb(null, list)
    }
  })
}

Tree.prototype._list = function (head, seq, names, cb) {
  var headIndex = this._inflate(seq, head.index)
  var cmp = compare(split(head.name), names)

  var index = cmp < headIndex.length && headIndex[cmp]
  var closest = cmp === names.length

  if (!closest) {
    if (!index || !index.length || (index.length === 1 && index[0] === seq)) return cb(null, [], [])
    this._closer(names, cmp, index, cb)
    return
  }

  if (!index || !index.length) return cb(null, [], [])

  this._getAll(index, cb)
}

Tree.prototype.get = function (name, opts, cb) {
  if (typeof opts === 'function') return this.get(name, null, opts)
  if (!opts) opts = {}

  var names = split(name)
  var self = this

  this.head(function (err, head, seq) {
    if (err) return cb(err)
    if (!head) return cb(notFound(names))
    self._get(head, seq, names, null, opts.node, cb)
  })
}

Tree.prototype.path = function (name, cb) {
  var names = split(name)
  var path = []
  var self = this

  this.head(function (err, head, seq) {
    if (err) return cb(err)
    if (!head) return cb(notFound(names))
    self._get(head, seq, names, path, false, function (err) {
      if (err && !err.notFound) return cb(err)
      cb(null, path)
    })
  })
}

Tree.prototype.checkout = function (seq) {
  return new Tree(this.feed, {checkout: seq, offset: this._offset, codec: this._codec})
}

Tree.prototype._del = function (head, seq, names, cb) {
  var self = this
  var i = 0
  var end = names.length + 1
  var index = []
  var len = self.feed.length
  var ignore = join(names)

  closest(names.length, function (err, c, cseq) {
    if (err) return cb(err)

    var cnames = c ? split(c.name) : []

    loop(null, null, null)

    function loop (err, nodes, seqs) {
      if (err) return cb(err)

      if (nodes) {
        var result = []
        var skip = false

        for (var j = 0; j < nodes.length; j++) {
          var cname = i - 1 < cnames.length ? cnames[i - 1] : null
          var next = nodes[j]

          if (split(next.name)[i - 1] === cname) {
            skip = true
            continue
          }

          if (next.name !== ignore) result.push(seqs[j])
        }

        if (skip && cseq > -1) {
          result.push(cseq)
          result.sort(sort)
        }
        index.push(result)
      }

      if (i === end) {
        var node = {
          name: join(names),
          value: null,
          index: self._deflate(len, index)
        }

        self.version = self.feed.length
        self.feed.append(messages.Node.encode(node), cb)
        return
      }

      self._list(head, seq, names.slice(0, i++), loop)
    }
  })

  function closest (j, cb) {
    self._list(head, seq, names.slice(0, j), function (err, nodes, seqs) {
      if (err) return cb(err)

      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].name !== ignore) return cb(null, nodes[i], seqs[i])
      }

      if (j <= 0) {
        return cb(null, null, -1)
      }

      closest(j - 1, cb)
    })
  }
}

Tree.prototype.del = function (name, cb) {
  var self = this
  var names = split(name)

  this._lock(function (release) {
    self.head(function (err, head, seq) {
      if (err) return done(err)
      if (self._checkout > -1) return done(new Error('Cannot delete on a checkout'))
      if (!head) return done(null)
      else self._del(head, seq, names, done)
    })

    function done (err) {
      release(cb, err)
    }
  })
}

Tree.prototype._get = function (head, seq, names, record, asNode, cb) {
  var self = this
  var headNames = split(head.name)
  var cmp = compare(names, headNames)

  if (record) record.push(seq)

  if (cmp === headNames.length && cmp === names.length) {
    if (asNode) return cb(null, this._node(head, seq))
    if (!head.value) return cb(notFound(names))
    return cb(null, this._codec.decode(head.value))
  }

  var inflated = this._inflate(seq, head.index)
  if (cmp >= inflated.length) return cb(notFound(names))

  var index = inflated[cmp]
  var len = index.length
  if (index[len - 1] === seq) len--

  if (!len) return cb(notFound(names))

  var target = cmp < names.length ? names[cmp] : null
  var error = null
  var missing = len

  for (var i = 0; i < len; i++) {
    this._getAndDecode(index[i], onget)
  }

  function onget (err, node, seq) {
    if (err) error = err

    if (node) {
      var nodeNames = split(node.name)
      if ((cmp < nodeNames.length ? nodeNames[cmp] : null) === target) {
        return self._get(node, seq, names, record, asNode, cb)
      }
    }

    if (!--missing) cb(error || notFound(names))
  }
}

Tree.prototype._closer = function (names, cmp, index, cb) {
  var self = this
  var target = names[cmp]
  var error = null
  var missing = index.length
  var done = false

  for (var i = 0; i < index.length; i++) {
    this._getAndDecode(index[i], onget)
  }

  function onget (err, node, seq) {
    if (done) return
    if (err) error = err

    if (node && split(node.name)[cmp] === target) {
      self._list(node, seq, names, cb)
      return
    }

    if (!--missing) cb(error, [], [])
  }
}

Tree.prototype.head = function (cb) {
  if (this._head > -1) return this._getAndDecode(this._head, cb)

  var self = this

  this.ready(function (err) {
    if (err) return cb(err)
    if (self.feed.length > self._offset) self._getAndDecode(self.feed.length - 1, cb)
    else cb(null, null, -1)
  })
}

Tree.prototype.ready = function (cb) {
  var self = this

  this.feed.ready(function (err) {
    if (err) return cb(err)
    if ((self.version === -1 || self._head === -1) && self.feed.length > self._offset) self.version = self.feed.length - 1
    cb(null)
  })
}

Tree.prototype.history = function (opts) {
  if (!opts) opts = {}
  if (this._offset) opts.start = Math.max(opts.start || 0, this._offset)
  if (this._head > -1) opts.end = this._head + 1

  var version = opts.start || 0
  var self = this

  opts.valueEncoding = {
    decode: function (buf) {
      return self._node(messages.Node.decode(buf), version++)
    }
  }

  return this.feed.createReadStream(opts)
}

Tree.prototype._node = function (node, version) {
  return {
    type: node.value ? 'put' : 'del',
    version: version,
    name: node.name,
    value: node.value && this._codec.decode(node.value)
  }
}

Tree.prototype._init = function (names, value, cb) {
  var index = []

  while (names.length >= index.length) {
    index.push([this.feed.length])
  }

  var node = {
    name: join(names),
    value: this._codec.encode(value),
    index: this._deflate(this.feed.length, index)
  }

  this.version = this.feed.length
  this.feed.append(messages.Node.encode(node), cb)
}

Tree.prototype._getAndDecode = function (seq, cb) {
  this.feed.get(seq, function (err, value) {
    if (err) return cb(err)
    var node = messages.Node.decode(value)
    cb(null, node, seq)
  })
}

Tree.prototype._getAll = function (seqs, cb) {
  var nodes = new Array(seqs.length)
  var missing = seqs.length
  var error = null

  if (!missing) return cb(null, nodes, seqs)
  for (var i = 0; i < seqs.length; i++) this._getAndDecode(seqs[i], get)

  function get (err, node, seq) {
    if (err) error = err
    else nodes[seqs.indexOf(seq)] = node
    if (--missing) return
    if (error) cb(error)
    else cb(null, nodes, seqs)
  }
}

Tree.prototype._deflate = function (seq, index) {
  var endsWithSeq = true
  var lenIsh = 11
  var i = 0
  var idx

  for (i = 0; i < index.length; i++) {
    idx = index[i]

    lenIsh += idx.length * 11 + 11
    if (idx[idx.length - 1] !== seq) endsWithSeq = false
  }

  var header = 0
  if (endsWithSeq) header |= 1

  var buf = new Buffer(lenIsh)
  var offset = 0

  buf[offset++] = header

  for (i = 0; i < index.length; i++) {
    idx = index[i]

    var prev = 0
    var len = endsWithSeq ? idx.length - 1 : idx.length

    varint.encode(len, buf, offset)
    offset += varint.encode.bytes

    for (var j = 0; j < len; j++) {
      varint.encode(idx[j] - prev, buf, offset)
      offset += varint.encode.bytes
      prev = idx[j]
    }
  }

  if (offset > buf.length) throw new Error('Assert error: buffer length too small')
  return buf.slice(0, offset)
}

Tree.prototype._inflate = function (seq, buf) {
  var offset = 0

  var header = varint.decode(buf, offset)
  offset += varint.decode.bytes

  var endsWithSeq = !!(header & 1)
  var index = []

  while (offset < buf.length) {
    var len = varint.decode(buf, offset) // TODO: sanity check this length
    offset += varint.decode.bytes

    var seqs = new Array(endsWithSeq ? len + 1 : len)
    var i = 0

    for (; i < len; i++) {
      if (offset >= buf.length) throw new Error('Invalid index')

      seqs[i] = varint.decode(buf, offset) + (i ? seqs[i - 1] : 0)
      offset += varint.decode.bytes
    }

    if (endsWithSeq) seqs[i] = seq
    index.push(seqs)
  }

  return index
}

function join (names) {
  return '/' + names.join('/')
}

function split (name) {
  var list = name.split('/')
  if (list[0] === '') list.shift()
  if (list[list.length - 1] === '') list.pop()
  return list
}

function notFound (names) {
  var err = new Error(join(names) + ' could not be found')
  err.notFound = true
  err.status = 404
  return err
}

function compare (a, b) {
  var idx = 0
  while (idx < a.length && a[idx] === b[idx]) idx++
  return idx
}

function sort (a, b) {
  return a - b
}
