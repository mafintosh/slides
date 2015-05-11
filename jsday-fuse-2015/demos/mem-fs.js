var fuse = require('fuse-bindings')

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

fuse.mount('test', {
  force: true,
  options: ['direct_io'],
  getattr: function (name, cb) {
    console.log('getattr', name)
    var file = files[name]
    if (!file) return cb(fuse.ENOENT)
    cb(0, file)
  },
  readdir: function (name, cb) {
    console.log('readdir', name)
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
    console.log('mkdir', name)
    files[name] = {
      mode: 16877,
      size: 1000,
      uid: process.getuid(),
      gid: process.getgid(),
      ctime: new Date(),
      atime: new Date(),
      mtime: new Date()
    }
    cb(0)
  },
  read: function (name, fd, buffer, length, position, cb) {
    var file = files[name]
    if (!file) return cb(fuse.ENOENT)

    if (position >= file.size) return cb(0)

    var slice = file.buffer.slice(position, position + length)

    slice = slice.toString().replace(/console\.log\(\d+\)/, 'console.log(' + ((10 + Math.random() * 90) | 0) + ')')
    console.log(slice)
    new Buffer(slice).copy(buffer)

    cb(slice.length)
  },
  unlink: function (name, cb) {
    delete files[name]
    cb(0)
  },
  rename: function (from, to, cb) {
    var file = files[from]
    if (file) {
      delete files[from]
      files[to] = file
    }
    cb(0)
  },
  write: function (name, fd, buffer, length, position, cb) {
    var file = files[name]
    if (!file) return cb(fuse.ENOENT)

    if (position + length > file.size) {
      var old = file.buffer
      file.buffer = new Buffer(position + length)
      old.copy(file.buffer)
      file.size = position + length
    }

    buffer.slice(0, length).copy(file.buffer, position)
    cb(length)
  },
  truncate: function (name, len, cb) {
    var file = files[name]
    if (!file) return cb(fuse.ENOENT)
    file.buffer = new Buffer(len)
    file.size = len
    cb(0)
  },
  access: function (name, mode, cb) {
    if (!files[name]) return cb(fuse.ENOENT)
    cb(0)
  },
  create: function (name, mode, cb) {
    files[name] = {
      mode: mode,
      size: 0,
      uid: process.getuid(),
      gid: process.getgid(),
      ctime: new Date(),
      atime: new Date(),
      mtime: new Date(),
      buffer: new Buffer(0)
    }

    cb(0)
  }
})

process.on('SIGINT', function () {
  fuse.unmount('test', function () {
    process.exit()
  })
})