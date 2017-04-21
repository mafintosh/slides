var discovery = require('discovery-swarm')
var defaults = require('datland-swarm-defaults')

var swarm = discovery(defaults())

swarm.on('connection', function (connection) {
  process.stdin.pipe(connection).pipe(process.stdout)
})

swarm.join('my-cool-app')
