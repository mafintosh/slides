var hyperdrive = require('hyperdrive')
var hyperdiscovery = require('hyperdiscovery')
var level = require('level')
var fs = require('fs')

var drive = hyperdrive(level('test.db'))

var archive = drive.createArchive('317a25f1d8318d386d39084c35d8545409505529a2cf2ae2fd941b504e7d7beb')

hyperdiscovery(archive)
console.log(archive.key.toString('hex'))

// archive.list({live: true})
//   .on('data', function (data) {
//     console.log('new file:', data.name)
//     archive.createFileReadStream(data).pipe(process.stdout)
//   })

fs.createReadStream(__filename)
  .pipe(archive.createFileWriteStream('cool-data.js'))
