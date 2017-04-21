var discovery = require('discovery-swarm')
var defaults = require('datland-swarm-defaults')

var swarm = discovery(defaults())

swarm.on('connection', function (stream) {
  process.stdin.pipe(stream).pipe(process.stdout)
})

swarm.join('my-chat-app')
