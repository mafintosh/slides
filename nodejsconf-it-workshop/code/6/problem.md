# Simple P2P Chat!

Now that we can create a p2p network, let's use it for some chatting. We would provide this program with a username,
the address to use and a list of addresses for other peers. Then it should indicate when connections are established
(just like the past example), and whatever a user write in his terminal, should be shown in the other users' terminals.

## Tips

You should build on top of the solution to problem 5. Our solution looks like this.

```js
var topology = require('fully-connected-topology')
var me = process.argv[2]
var peers = process.argv.slice(3)

var swarm = topology(me, peers)

swarm.on('connection', function (socket, id) {
  console.log('new connection from', id)
})
```
The `fully-connected-topology` module has a `forEach` method, which might make sense to send messages
to each one of the peers you have a connection with.

We're using usernames on this problem, so it makes sense to look back at problem 3 and at how we use
`duplex-json-stream` for this purpose.

## Testing

Run this commands in 3 different terminals.

```
node peer.js eduardo localhost:3000 localhost:3001 localhost:3002
```

```
node peer.js mafintosh localhost:3001 localhost:3000 localhost:3002
```

```
node peer.js watson localhost:3002 localhost:3000 localhost:3001
```

The clients should be able to chat between them.

Wo-hoo! You created a chat system that doesn't require a centralized server.
