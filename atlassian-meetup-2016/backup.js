var drop = require('drag-and-drop-files')
var reader = require('filereader-stream')
var concat = require('concat-stream')
var level = require('level-browserify')
var hyperlog = require('hyperlog')
var db = level('hello-world1')

// var sw = swarm(hub)
var log = hyperlog(db)

drop(window, function (e) {
  reader(e[0]).pipe(concat(function (data) {
    console.log(data.toString('base64').length)
    log.append(data.toString('base64'))
  }))
})

log.createReadStream({live: true})
  .on('data', function (data) {
    console.log('??')
    var value = data.value.toString()
    // var value = JSON.parse(data.value.toString())
    // var value = new Buffer(data.value.toString(), 'base64')
    // console.log(value)
    var div = document.createElement('div')
    div.innerHTML = '<a download="' + 'test.jpg'+ '" href="data:application/octet-stream;base64,' + value + '">' + 'test.jpg' + '</a>'
    document.body.appendChild(div)
  })



// var signalhub = require('signalhub')
// var hub = signalhub('test-application', ['https://signalhub.mafintosh.com'])
// var swarm = require('webrtc-swarm')
// var level = require('level-browserify')
// var db = level('hello-world')
// var hyperlog = require('hyperlog')

// var sw = swarm(hub)
// var log = hyperlog(db)

// sw.on('peer', function (peer) {
//   console.log('new peer')
//   peer.pipe(log.replicate({live: true})).pipe(peer)
// })

// log.createReadStream({live: true})
//   .on('data', function (data) {
//     console.log(data)
//   })

// log.append('hello')
