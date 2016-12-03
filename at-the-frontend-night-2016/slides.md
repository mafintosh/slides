
at the frontend night
@mafintosh

----

hypermodular web development

----

a talk about using modules in the browser

----

modules makes node.js code maintainable

----

modules solve callback hell

----

modules are great.
they allow us to split up problems into smaller problems

----

they help with legacy code as there will be less of it and it will be easier to remove

----

you are if you still have legacy code

----

....

----

browserify bundle sizes

----

an optimization problem
-> the best kind of problems

----

trivial solution:

1. generate a browserify bundle when you update something
2. update your script tag src

----

bundles tend to be 100s of kbs.
you don't want to think about "bundle cost" when updating small things

----

complicated solutions:

partial bundles
high level abstractions

----

better solution: rsync

----

rsync is great because it just deals with files

----

*unix*

----

behind the scenes it does a bunch of magic to reduce bytes sent

----

diffing using rolling hashes
one-round-trip sync

----

rsync for the browser!

npm install browser-sync-stream

----

(demo)
