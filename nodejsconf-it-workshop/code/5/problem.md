# P2P!

Alright! Let's do some peer to peer. Up until now, we've been doing client server programs. That
was to show the convenience that node can have as a platform to build network programs. But now, let's
focus on actual peer to peer stuff.

The first program we are going to write is a program that simply connects to other peers. It doesn't do
anything with said connection yet, it just says that a new connection has been established and that's that.

You would run this program and pass a port for it to run, and the ports of the other expected peers.

If 5 instances of the program are running, there should be a connection between any two instances 
(i.e. the network should be fully connected).

## Tips

There is a module on npm called [fully-connected-topology](https://github.com/sorribas/fully-connected-topology), this
module creates a fully connected network based on a list of addresses. Read the docs and you'll be on your way.

## Testing.

Run this commands in 3 different terminals.

```js
node peer.js localhost:3000 localhost:3001 localhost:3002
```

```js
node peer.js localhost:3001 localhost:3000 localhost:3002
```

```js
node peer.js localhost:3002 localhost:3000 localhost:3001
```

They should all print the new connection message twice.
