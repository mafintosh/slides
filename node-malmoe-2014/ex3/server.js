var http = require('http')
var scuttleup = require('scuttleup')
var level = require('level')
var topology = require('fully-connected-topology')
var minimist = require('minimist')

var argv = minimist(process.argv)

var me = argv.me // --me [addr]
var peers = [].concat(argv.peer || []) // --peer a --peer b
var port = argv.port

var t = topology(me, peers)
var log = scuttleup(level(port+'.db'))

if (!port) {
  console.error('--port [port] is required')
  process.exit(1)
}

t.on('connection', function(connection, id) {
  console.log('connection established to %s', id)
  connection.pipe(log.createReplicationStream()).pipe(connection)
})

var server = http.createServer(function(req, res) {
  if (req.url === '/favicon.ico') return res.end()
  if (req.url === '/log') {
    var statusCodes = {}
    var totalTime = 0
    var totalRequests = 0

    log.createReadStream({head:true})
      .on('data', function(data) {
        console.log(data.head)

        var entry = JSON.parse(data.entry)
        statusCodes[entry.statusCode] = (statusCodes[entry.statusCode] || 0) + 1
        totalTime += entry.time
        totalRequests++
      })
      .on('end', function() {
        res.end(JSON.stringify({
          statusCodes: statusCodes,
          averageTime: totalTime / totalRequests
        }))
      })
      return
  }

  log.append(JSON.stringify({
    url:req.url,
    time: Math.floor(Math.random() * 1000),
    statusCode: 200
  }))

  res.end('hello world\n')
})

server.listen(port)