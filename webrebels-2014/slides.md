





BitTorrent, Streams and JavaScript


----





  Mathias Buus, @mafintosh
  https://github.com/mafintosh


----



I'm gonna talk about

  1. What is BitTorrent?
  2. BitTorrent streaming
  3. Mad science!

----






BITTORRENT!

----

Normally when you fetch content online you do this


  [client]
     ^
     | (bergen-to-oslo-train-video.mp4)
     |
  [server]


----

This is nice and simple.

What happens when 1 000 000 clients arrive?


   [client1] [client2] ... [client1M]
        \        |         /
         \       |        /
          \      |       /

              [server]

    (much traffic)
                        (so scale)

----


            --_--
         (  -_    _).
       ( ~       )   )
     (( )  (    )  ()  )
      (.   )) (       )
        ``..     ..``
             | |
           (=| |=)
             | |
         (../( )\.))

      s       r      e
         e                 r
                 v

----



Idea!

Remove the server and have all clients share data
with each other

----





[client1]  --->  [client2]
  ^      \        /
  |       \      /
  |       [client3]
[client5]     \
               \
               ...


----

Now if one of the clients blows up we just fetch data
from someone else


  :(    --->  [client2]
  ^       \        /
  |        \      /
  |        [client3]
[client5]      \
                \
                ...

----

Now if one of the clients blows up we just fetch data
from someone else


             [client2]
                  /
                 /
[client5] -> [client3]
                 \
                  \
                  ...

----



So peer to peer seems nice...

But can we trust data coming from clients?

What if someone sends us something else
instead of bergen-to-oslo-train-video.mp4?

----


Let's start by dividing bergen-to-oslo-train-video.mp4
into pieces and hash each of them


piece1  --> hash of piece1
piece2  --> hash of piece2
...
piece1M --> hash of piece1M


We can use these hashes to verify data received

----

We could store this data on a trusted server


          [client]
              ^
              |
  (file-with-list-of-hashes)
              |
          [server] (hey remember that slide of me exploding)


An OK solution but the list of hashes can be big

----

What if the server just stored a single hash
that was the hash of all piece hashes?


                       | hash of piece1
info-hash  --> hash of | ...
                       | hash of piece1M


[server] can probably handle 16 bytes of data

----

We just fetch all the piece hashes of clients


            [client3] --> (hash-of-some-piece)
                                         |
                                         v
[client1] --> (hash-of-some-piece) --> [client]
                                           ^
                                           |
              [client2] --> (hash-of-some-piece)


We use the info-hash to verify the hashes

----




This is how BitTorrent fetches and verifies data!

But how do we find peers that share
bergen-to-oslo-train-video.mp4?

----



 (so distributed)

  DISTRIBUTED HASH TABLE!

                   (web scale)
(much reliable)

----

Every client joins the DHT

Bootstrap through a couple of known seed nodes
Add the following data


key    = info-hash
value  = my-ip : my-port


----



The BitTorrent DHT is H U G E

~10.000.000 nodes at any time

https://dsn.tm.kit.edu/english/2936.php

----

SUMMARY:

Given an info hash (usually a magnet link)

1. find a bunch of peers in the dht
2. connect to them and get metadata
3. verify metadata using info hash
4. get data from peers
5. verify data using metadata

----





BITTORRENT IS PRETTY SWEET FOR SHARING CONTENT!


----





I'm a node hacker


----




Some things I like about node:

- async
- community
- npm

----




Some things I like about node:

- async
- community
- npm
- STREAMS !!!!

----




NODE.JS STREAMS + BITTORRENT = <3 ?

----




REALTIME + NODE.JS STREAMS + BITTORRENT = <3

----

We wants pieces 1 - 10

Trivial implementation:

request one piece from each peer

  |     | <--- piece1 from peer1
  |  S  | <--- piece2 from peer2
  |  T  |      etc
  |  R  |
  |  E  |
  |  A  |
  |  M  |
  |     |

----




Risk of high latency ==> does not seem realtime


----

Better implementation:

request the first piece from many peers


  |     | <--- piece1 from peer1
  |  S  |   |- piece1 from peer2
  |  T  |   |- piece1 from peer3
  |  R  |
  |  E  | <--- pieceN from other peers
  |  A  |
  |  M  |
  |     |

----

Even better implementation:

maintain a list of fast peers
use these peers to fetch important pieces

  |     | <--- piece1 from fast peerX
  |  S  |   |- piece1 from fast peerY
  |  T  |   |- piece1 from fast peerZ
  |  R  |
  |  E  | <--- pieceN from other (slower) peers
  |  A  |
  |  M  |
  |     |

if a fast peer becomes slow swap him for another one

----




The top peers will always help fetch the most
critical pieces concurrently (usually only a couple)


----



This is how torrent-stream works!

  npm install torrent-stream

https://github.com/mafintosh/torrent-stream

----




(@mafintosh, show them the demo of torrent-stream)


----




What if we streamed video files as well?


----




TORRENT-STREAM + VLC = <3 <3 <3


----



peerflix combines torrent-stream and vlc
(the thing that made popcorn time stream torrents)
(* not part of popcorn time - please don't put me in jail)

  npm install -g peerflix

https://github.com/mafintosh/peerflix

----




(@mafintosh, show them the demo of peerflix)


----




MAD SCIENCE TIME!


----



What if we could mount the torrent in files instantly
and just access them as any file?


----


                                .--.
                               /    \
TORRENT-STREAM + FUSE =       ## a  a
                              (   '._)
                               |'-- |
                             _.\___/_

----


                                .- - -.
                               /       \
TORRENT-STREAM + FUSE =       ##   X    X
                              |         |
                              (      '._)
                               |  ' -- |
                             _.\____ _/_


----
                                   --_--
                                (  -_    _).
                              ( ~       )   )
                            (( )  (    )  ()  )
TORRENT-STREAM + FUSE =      (.   )) (       )
                               ``..     ..``
                                    | |
                                  (=| |=)
                                    | |
                                (../( )\.))


----



torrent-mount allows you to mount all files inside
a torrent instantly

  npm install -g torrent-mount

https://github.com/mafintosh/torrent-mount

----




(@mafintosh, show them the demo of torrent-mount)


----


Modules summary

https://github.com/mafintosh/torrent-stream
https://github.com/mafintosh/peerflix
https://github.com/mafintosh/torrent-mount


----



People and things to follow

  feross      https://github.com/feross
  webtorrent  https://github.com/feross/webtorrent

Get involved!

----



Takk! Questions?

  Mathias Buus, @mafintosh
  https://github.com/mafintosh
