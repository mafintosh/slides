var hyperdrive = require('hyperdrive')
var hyperdiscovery = require('hyperdiscovery')
var level = require('level')
var fs = require('fs')

var drive = hyperdrive(level('drive.db'))
var archive = drive.createArchive('474cdf88c5192d4640adfa3bbad4477a5853a1367409cb642a7e7b4d75832faa')

console.log(archive.key.toString('hex'))

hyperdiscovery(archive)

var file = fs.createReadStream(__filename)

file.pipe(archive.createFileWriteStream('cool-data.js'))
  .on('finish', function () {
    console.log('added')
  })
