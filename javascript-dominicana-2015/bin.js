#!/usr/bin/env node

var rps = require('./rock-paper-scissors')
var stream = rps(process.argv[2])

process.stdin.pipe(stream).pipe(process.stdout)
