var http = require('http')
var minimist = require('minimist')
var concat = require('concat-stream')
var level = require('level')
var scuttleup = require('scuttleup')
var request = require('request')

var argv = minimist(process.argv)
var db = level('db.'+argv.port)
var log = scuttleup(db)

var view = {}

log.createReadStream({live: true})
  .on('data', function(data) {
    data.entry = JSON.parse(data.entry)
    if (view[data.entry.key] && view[data.entry.key].entry.timestamp > data.entry.timestamp) return
    view[data.entry.key] = data
    console.log('entry', data.entry)
  })

var server = http.createServer(function (req, res) {
  var key = req.url

  if (req.method === 'POST') {
    console.log('got replication stream')
    req
      .pipe(log.createReplicationStream())
      .pipe(res)
    return
  }

  if (req.method === 'PUT') {
    req.pipe(concat({encoding:'string'}, function(value) {
      log.append(JSON.stringify({
        type: 'put',
        key: key,
        value: value,
        timestamp: Date.now()
      }))
      res.end()
    }))
    return
  }

  if (req.method === 'GET') {
    if (!view[key]) {
      res.statusCode = 404
      res.end()
      return
    }

    res.end(view[key].entry.value+'\n')
    return
  }
})

server.listen(argv.port)

if (argv.peer) {
  console.log('replicating to '+argv.peer)
  var req = request.post('http://'+argv.peer)
  req.pipe(log.createReplicationStream()).pipe(req)
}