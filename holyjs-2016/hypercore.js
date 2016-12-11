var hypercore = require('hypercore')
var hyperdiscovery = require('hyperdiscovery')
var level = require('level')

var core = hypercore(level('test.db'))
var feed = core.createFeed('1e97869b389449cc848b99bb83197d665e060e85d10a2d70ba2d93e71f05a754')

hyperdiscovery(feed)

console.log(feed.key.toString('hex'))

process.stdin.on('data', function (data) {
  feed.append(data.toString().trim())
})
// feed.createReadStream()
//   .on('data', function (data) {
//     console.log(data.toString())
//   })
// feed.append('hi moscow')
