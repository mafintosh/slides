var fuse = require('fuse-bindings')
var level = require('level')
var hyperlog = require('hyperlog')

var dir = process.argv[2] || 'test'

var files = {
  '/': {
    mode: 16877,
    size: 1000,
    uid: process.getuid(),
    gid: process.getgid(),
    ctime: new Date(),
    atime: new Date(),
    mtime: new Date()
  }
}

var log = hyperlog(level(dir.replace(/\/$/, '') + '.db'))

if (process.argv.indexOf('--replicate') > -1) {
  process.stdin.pipe(log.replicate({live: true})).pipe(process.stdout)
}

var append = function (data, cb) {
  log.append(JSON.stringify(data), function (err, node) {
    if (err) throw err
    cb(data)
  })
}

var onmkdir = function (data) {
  files[data.name] = {
    mode: 16877,
    size: 1000,
    uid: process.getuid(),
    gid: process.getgid(),
    ctime: new Date(),
    atime: new Date(),
    mtime: new Date()
  }
}

var onunlink = function (data) {
  delete files[data.name]
}

var onrename = function (data) {
  var file = files[data.from]
  if (file) {
    delete files[data.from]
    files[data.to] = file
  }
}

var onwrite = function (data) {
  var file = files[data.name]
  var buf = new Buffer(data.buffer, 'base64')
  if (data.position + buf.length > file.size) {
    var old = file.buffer
    file.buffer = new Buffer(data.position + buf.length)
    old.copy(file.buffer)
    file.size = data.position + buf.length
  }

  buf.copy(file.buffer, data.position)
}

var ontruncate = function (data) {
  var file = files[data.name]
  file.buffer = new Buffer(data.length)
  file.size = data.length
}

var oncreate = function (data) {
  files[data.name] = {
    mode: data.mode,
    size: 0,
    uid: process.getuid(),
    gid: process.getgid(),
    ctime: new Date(),
    atime: new Date(),
    mtime: new Date(),
    buffer: new Buffer(0)
  }
}

var rs = log.createReadStream({
  live: true,
  since: 0
})

rs.on('data', function (data) {
  var val = JSON.parse(data.value)

  if (val.type === 'create') oncreate(val)
  else if (val.type === 'truncate') ontruncate(val)
  else if (val.type === 'write') onwrite(val)
  else if (val.type === 'mkdir') onmkdir(val)
  else if (val.type === 'rename') onrename(val)
  else if (val.type === 'unlink') onunlink(val)
})

fuse.mount(dir, {
  force: true,
  displayFolder: true,
  options: ['direct_io'],
  getattr: function (name, cb) {
    var file = files[name]
    if (!file) return cb(fuse.ENOENT)
    cb(0, file)
  },
  readdir: function (name, cb) {
    if (!/\/$/.test(name)) name += '/'

    var names = Object.keys(files)
      .filter(function (filename) {
        return filename !== '/' && filename.indexOf(name) === 0 && filename.indexOf('/', name.length) === -1
      })
      .map(function (filename) {
        return filename.split('/').pop()
      })

    cb(0, names)
  },
  open: function (name, len, cb) {
    cb(0, 10)
  },
  mkdir: function (name, mode, cb) {
    append({type: 'mkdir', name: name, mode: mode}, function (data) {
      onmkdir(data)
      cb(0)
    })
  },
  read: function (name, fd, buffer, length, position, cb) {
    var file = files[name]
    if (!file) return cb(fuse.ENOENT)

    if (position >= file.size) return cb(0)

    var slice = file.buffer.slice(position, position + length)

    // slice = slice.toString().replace(/console\.log\(\d+\)/, 'console.log(' + ((10 + Math.random() * 90) | 0) + ')')
    // console.log(slice)
    // new Buffer(slice).copy(buffer)
    slice.copy(buffer)

    cb(slice.length)
  },
  unlink: function (name, cb) {
    append({type: 'unlink', name: name}, function (data) {
      onunlink(data)
      cb(0)
    })
  },
  rename: function (from, to, cb) {
    append({type: 'rename', from: from, to: to}, function (data) {
      onrename(data)
      cb(0)
    })
  },
  write: function (name, fd, buffer, length, position, cb) {
    var file = files[name]
    if (!file) return cb(fuse.ENOENT)

    append({type: 'write', name: name, buffer: buffer.slice(0, length).toString('base64'), position: position}, function (data) {
      onwrite(data)
      cb(length)
    })
  },
  truncate: function (name, len, cb) {
    var file = files[name]
    if (!file) return cb(fuse.ENOENT)
    append({type: 'truncate', name: name, length: len}, function (data) {
      ontruncate(data)
      cb(0)
    })
  },
  access: function (name, mode, cb) {
    if (!files[name]) return cb(fuse.ENOENT)
    cb(0)
  },
  create: function (name, mode, cb) {
    append({type: 'create', name: name, mode: mode}, function (data) {
      oncreate(data)
      cb(0)
    })
  }
})

process.on('SIGINT', function () {
  fuse.unmount(dir, function () {
    process.exit()
  })
})