var http = require('http')
var level = require('level')
var mmm = require('multi-master-merge')
var topology = require('fully-connected-topology')
var minimist = require('minimist')


var argv = minimist(process.argv)

var me = argv.me // --me [addr]
var peers = [].concat(argv.peer || []) // --peer a --peer b
var port = argv.port

if (!port) {
  console.error('--port [port] is required')
  process.exit(1)
}

var db = mmm(level(port+'.db'))
var t = topology(me, peers)

t.on('connection', function(connection, id) {
  console.log('connection established to %s', id)
  connection.pipe(db.sync()).pipe(connection)
})

var server = http.createServer(function(req, res) {
  var key = req.url

  if (req.method === 'GET') {
    console.log('get %s', key)
    db.get(key, function(err, values) {
      values = (values || []).map(function(v) {
        v.value = v.value.toString()
        return v
      })

      res.end(JSON.stringify(values))
    })
    return
  }

  if (req.method === 'PUT') {
    var value = ''
    req.setEncoding('utf-8')
    req.on('data', function(data) {
      value += data
    })
    req.on('end', function() {
      console.log('put %s -> %s', key, value)
      db.put(key, value, function() {
        res.end()      
      })

    })
    return
  }

  res.end()
})

server.listen(port)