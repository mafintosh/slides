var hypercore = require('hypercore')
var hyperdiscovery = require('hyperdiscovery')
var db = require('level')('test.db')

var core = hypercore(db)
var feed = core.createFeed('7f940ba819e9ba3f06a6369fc74d52c7298ba3dbff8acc85988de910f1eefcdc')

console.log(feed.key.toString('hex'))

hyperdiscovery(feed)

process.stdin.on('data', function (data) {
  feed.append(data.toString().trim())
})
