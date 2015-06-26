
p2p and live streaming

----

Mathias Buus
@mafintosh

----

works on the dat project
a tool for distributing and versioning datasets

----

i've been working with p2p for a while

----

the first commit to my first bigger p2p project, peerflix,
was ~2 years ago

----

p2p is interesting because it allows us
to build a new range of applications because
it gives us the following properties

----

no censorship

----

no ownership

----

"free" and scaleable

----

bittorrent is one of the most known p2p protocols

----

torrents (and most other file sharing protocols) deals
with static data

----

a question i always get at conferences:
"how can i update the content of a torrent?"

----

let's look at the bittorrent flow:

----

1. you go to your favorite torrent site

----

2. you "trust" the website

----

3. you search for a torrent

----

4. you download a torrent file
   that matches your search

----

5. since you trust the site you now
   trust this torrent file

----

this torrent file contains a list of hashes
for fixed size chunks of the content

----

torrent-file:
  chunk-size: 512kb
  hash-1 => sha1(bytes 0-512kb)
  hash-2 => sha1(bytes 512kb-1024kb)
  ...

torrent-id: hash of all hashes

----

using these hashes we can verify the content
when we get it from peers

----

BUT! this also means that the content is fixed

----

if you want to update it you have to create a new
torrent and the user must go through the flow again

----

this also means that if the torrent site is down
our flow breaks for new torrents

----

:(

----

solution #1: a p2p torrent index site

----

problem: we need to distribute a list of content

----

people might update this list concurrently

----

list:

  a torrent #1
  |
  b torrent #2
  |
  c ...

----

peer #1 adds d

  a torrent #1
  |
  b torrent #2
  |
  c ...
  |
  d

----

peer #2 adds d'

  a torrent #1
  |
  b torrent #2
  |
  c ...
  |
  d'

----

the list now looks like

  a torrent #1
  |
  b torrent #2
  |
  c ...
 / \
d   d'

----

if a peer inserts again he just auto merges

  a torrent #1
  |
  b torrent #2
  |
  c ...
 / \
d   d'
 \ /
  e

----

if every node hashes the previous nodes
we just need to trust the latest one(s)

----

  a torrent #1
  |
  b (hash of a + torrent #2)
  |
  c (hash of b + ...)
 / \
d   d'
 \ /
  e   (hash of d + d' + ...)

----

we call this a "merkle dag"

----

npm install hyperlog

(implements exactly this data structure)

----

let's build a p2p torrent index site

----

(use cryptographic signatures to sign the dag
to guarantee integrity)

----

so we can search for torrents (or ANYTHING else)
without having a centralized index.

----

however this doesn't change the fact that we cannot
change the content of a torrent - we still have to
fetch new torrent files

----

:(

----

solution #2 - an updatable "torrent like" protocol

----

so a torrent looked like this

  id: hash of all hashes
          |
  - - - - - - - - - - -
  |       |
hash-1  hash-2  ....

----

(a single level merkle tree)

the top node verifies all of the content

----

you cannot append to this tree without changing
the data structure

----

idea: use a merkle tree where *all* bottom
      nodes verifies everything before it

      basically have any bottom hash a data chunk
      + all previous fully rooted trees

----

example: we have two data blocks, a and b

----

tree:

     1
  h(0 + 2)
  /     \
 0       2
h(a)   h(b + 0)

----

add a block, c

     1
  h(0 + 2)
  /     \
 0       2           4
h(a)   h(b + 0)   h(c + 1)

----

add a block, d

                3
             h(1 + 5)
        /                \
     1                     5
  h(0 + 2)              h(4 + 6)
  /     \             /         \
 0       2           4           6
h(a)   h(b + 0)   h(c + 1)  h(d + 4 + 1)

----

add a block, e

                3
             h(1 + 5)
        /                \
     1                     5
  h(0 + 2)              h(4 + 6)
  /     \             /         \
 0       2           4           6          8
h(a)   h(b + 0)   h(c + 1)  h(d + 4 + 1) h(e + 3)

----

if you trust 8 you implicitly trust e and 3 as well

                3
             h(1 + 5)
        /                \
     1                     5
  h(0 + 2)              h(4 + 6)
  /     \             /         \
 0       2           4           6          8
h(a)   h(b + 0)   h(c + 1)  h(d + 4 + 1) h(e + 3)

----

by trusting the latest entry using the structure
you trust everything before you

----

you only need log(n) hashes to verify ANY data block

----

and the entire tree fits in a simple list

----

we can just sign the latest node to sign all data
and have the peervision id be a hash of the feeds public key

----

(thanks @dominictarr for pointing me in this direction)

----

npm install flat-tree

----

solution #2: peervision

----

peervision is a (work in progress) torrent like protocol
that uses the previous merkle tree to support live content

----

demo

----

it is transport agnostic so it should work on
browsers using webrtc (and on chromecasts) as well as in node

----

(disclamer: its under heavy development)

----

thank you!
