var drop = require('drag-and-drop-files')
var reader = require('filereader-stream')
var concat = require('concat-stream')

drop(window, function (files) {
  reader(files[0]).pipe(concat(function (buf) {
    console.log('dropped file', buf.length)
  }))
})
