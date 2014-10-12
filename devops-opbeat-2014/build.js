var rimraf = require('rimraf')
var path = require('path')
var fs = require('fs')

rimraf.sync(path.join(__dirname, 'deck'))

var slides = fs.readFileSync(path.join(__dirname, 'slides.txt'), 'utf-8').trim().split('----')
var pad = function(n) {
  if (n < 10) return '0'+n
  return n
}

fs.mkdirSync(path.join(__dirname, 'deck'))

var trim = function(s) {
  return s.trim()
}

slides.forEach(function(slide, i) {
  slide = '\n\n\n\n\n          '+slide.trim().split('\n').map(trim).join('\n          ')

  fs.writeFileSync(path.join(__dirname, 'deck', ''+pad(i)), slide)
})