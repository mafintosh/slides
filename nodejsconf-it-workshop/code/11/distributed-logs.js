var topology = require('fully-connected-topology')
var register = require('register-multicast-dns')
var toPort = require('hash-to-port')
var level = require('level')
var scuttleup = require('scuttleup')

var me = process.argv[2]
var peers = process.argv.slice(3)

var db = level(me + '.db')
var logs = scuttleup(db)
var swarm = topology(toAddress(me), peers.map(toAddress))

register(me)

swarm.on('connection', function (socket, id) {
  console.log('info> direct connection to', id)
  socket.pipe(logs.createReplicationStream({live: true})).pipe(socket)
})

logs.createReadStream({live: true})
  .on('data', function (data) {
    console.log(data.peer + ' #' + data.seq + ': ' + data.entry)
  })

logs.append('hello world')

function toAddress (name) {
  return name + '.local:' + toPort(name)
}
