#!/usr/bin/env node

var rps = require('./rock-paper-scissors')
var weapon = process.argv[2]

var stream = rps(weapon)

process.stdin.pipe(stream).pipe(process.stdout)