var topology = require('fully-connected-topology')
var jsonStream = require('duplex-json-stream')
var streamsSet = require('streams-set')

var me = process.argv[2]
var peers = process.argv.slice(3)

var swarm = topology(me, peers)
var connections = streamsSet()

swarm.on('connection', function (socket, id) {
  console.log('info> new connection from', id)

  socket = jsonStream(socket)
  socket.on('data', function (data) {
    console.log(data.username + '> ' + data.message)
  })

  connections.add(socket)
})

process.stdin.on('data', function (data) {
  connections.forEach(function (socket) {
    var message = data.toString().trim()
    socket.write({username: me, message: message})
  })
})
