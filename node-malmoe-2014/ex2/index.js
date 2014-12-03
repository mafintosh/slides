var scuttleup = require('scuttleup')
var level = require('level')

var log1 = scuttleup(level('log.1'), {id:'mathias'})
var log2 = scuttleup(level('log.2'), {id:'bob'})

var stream1 = log1.createReplicationStream()
var stream2 = log2.createReplicationStream()

// stream1.pipe(stream2).pipe(stream1)

log1.createReadStream()
  .on('data', function(data) {
    data.entry = data.entry.toString()
    console.log(data)
  })

// log.append('hi am bob')