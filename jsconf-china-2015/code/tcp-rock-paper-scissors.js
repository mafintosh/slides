var net = require('net')
var ndjson = require('ndjson')
var minimist = require('minimist')
var game = require('./game')

var argv = minimist(process.argv.slice(2))
var weapon = argv._[0]

if (!weapon) {
  console.error('You have to choose a weapon!')
  return
}

var play = function (socket) {
  var serialize = ndjson.serialize()
  var parse = ndjson.parse()

  parse.once('data', function (data) {
    var remoteWeapon = data.weapon
    game(weapon, remoteWeapon)
  })

  serialize.write({weapon: weapon})
  serialize.pipe(socket)
  socket.pipe(parse)
}

if (argv.listen) {
  var server = net.createServer(play)
  server.listen(argv.listen)
} else {
  var socket = net.connect(argv.connect)
  play(socket)
}
