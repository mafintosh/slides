#!/usr/bin/env node

var fs = require('fs')
var keypress = require('keypress')
var slides = fs.readFileSync(__dirname+'/slides.md')
var log = require('single-line-log').stdout

var max = 0

slides = slides.toString().split('----\n').map(function(slide, i) {
  slide = '\n\n  '+slide.split('\n').join('\n  ')+'\n\n'
  max = Math.max(max, slide.split('\n').length)
  return slide
}).map(function(slide, i) {
  while (slide.split('\n').length < max) slide += '\n'
  return slide += '  # '+i+'\n'
})

slides[0] = slides[0].slice(0, -4) + '[<-] to view prev and [->] to view next\n'

var i = -1

var next = function() {
  i++
  if (i >= slides.length) i = slides.length-1
  log(slides[i]+'\n')
}

var prev = function() {
  i--
  if (i < 0) i = 0
  log(slides[i]+'\n')
}

next()

keypress(process.stdin)
process.stdin.on('keypress', function(ch, key) {
  if (key && key.ctrl && key.name == 'c') process.exit()
  if (key.name === 'right') next()
  if (key.name === 'left') prev()
})

process.stdin.setRawMode(true);
process.stdin.resume();
