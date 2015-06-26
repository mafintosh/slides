
streams, pipes and distributed systems

----

mathias buus
@mafintosh

----

act 1: let's talk about streams

----

streams are a *core* abstraction in node
that allows you to work with data that doesn't
fit in memory

----

let's say you wanted to see how big a file was

----

fs.readFile('huge.file', function (err, data) {
  if (err) throw err
  // data will have ALL of huge.file's content.
  // this might not work because
  // huge.file does not fit in memory :(
  console.log(data.length)
})

----

readable streams to the rescue

----

var readableStream = fs.createReadStream('huge.file')
var length = 0

readableStream.on('data', function (data) {
  // data is a small chunk of the file
  length += data.length
})

readableStream.on('end', function () {
  console.log(length)
})

----

writable streams are streams
you can write readable streams to

----

readableStream.pipe(writableStream)

----

copying a file:

fs.createReadStream('huge.file')
  .pipe(fs.createWriteStream('huge-copy.file'))

----

sometimes you want to modify
the data in a readable stream

----

readableStream
  .pipe(transformStream)
  .pipe(writableStream)

----

gzipping a file:

fs.createReadStream('huge.file')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('huge.file.gz'))

----

streams are great for memory management
and building low latency applications

----

let's talk about transport streams

----

a transport stream is a duplex (readable and writable)
stream that connects you to someone else

----

var net = require('net')
var socket = net.connect('127.0.0.1', 8080)

socket.write('hello world\n')

----

var net = require('net')
var server = net.createServer(function (socket) {
  socket.on('data', function (data) {
    console.log(data.toString())
  })
})

server.listen(8080)

----

act 2: distributed systems

----

let's make a rock, paper, scissors game that works over tcp

----

mathias! write some code

----

{
  name: rock-paper-scissors
  description:
    allows you to play rock, paper, scissors over tcp!
}

----

random person on the internet:
what about ssl? http?

----

*sigh*
*a 1000 lines of code later*

----

name: rock-paper-scissors
description:
  allows you to play rock, paper,
  scissors over tcp, *ssl*, and *http*!

----

random person on the internet:
what about my homebrew protocol?

----

we are doing it wrong!

----

our module should support ANY transport.

----

mathias! write some code

----

how can we support all transports from the command line?

----

rock-paper-scissors --tcp ?
rock-paper-scissors --ssl ?

----

*unix style*

----

transport | rock-paper-scissors | transport

----

:(

----

npm install -g dupsh

----

dupsh transport rock-paper-scissors

----

pipes transport to rock-paper-scissors
and rock-paper-scissors to the same transport

----

dupsh 'rock-paper-scissors rock' 'rock-paper-scissors scissors'

----

act 3: *mad science time*

----

we now have a distributed game that works over *any* transport.

----

airpaste

A 1-1 network pipe that auto discovers other peers using mdns

----

blecat

A 1-1 pipe over bluetooth low energy

----

webcat

A 1-1 pipe over the internet using webrtc

----

Thank you