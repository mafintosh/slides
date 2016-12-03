var level = require('level-browserify')
var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var hyperlog = require('hyperlog')
var drop = require('drag-and-drop-files')
var filereader = require('filereader-stream')
var concat = require('concat-stream')

var db = level('tester4')
var log = hyperlog(db)

var hub = signalhub('test-demo-test', [
  'https://signalhub.mafintosh.com'
])

var sw = swarm(hub)

console.log('i am here')

sw.on('peer', function (peer) {
  console.log('got peer')
  peer.pipe(log.replicate({live: true})).pipe(peer)
})

log.createReadStream({live: true})
  .on('data', function (data) {
    var value = JSON.parse(data.value.toString())
    console.log(value)
    var div = document.createElement('div')
    div.innerHTML = '<a download="' + value.name + '" href="data:application/octet-stream;base64,' + value.data + '">' + value.name + '</a>'
    document.body.appendChild(div)
  })

drop(window, function (files) {
  filereader(files[0]).pipe(concat(function (data) {
    log.append(JSON.stringify({
      name: files[0].name,
      data: data.toString('base64')
    }))
  }))
})

// log.append('hello world (' + Date.now() + ')')