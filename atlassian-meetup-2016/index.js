var level = require('level-browserify')
var webrtcSwarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var fileReader = require('filereader-stream')
var concat = require('concat-stream')
var hyperlog = require('hyperlog')
var drop = require('drag-and-drop-files')
var db = level('hello-test-3')

var hub = signalhub('atlassian-test-1', ['https://signalhub.mafintosh.com'])
var sw = webrtcSwarm(hub)

sw.on('peer', function (peer) {
  console.log('new peer')
  peer.pipe(log.replicate({live: true})).pipe(peer)
})

var log = hyperlog(db)

drop(window, function (files) {
  fileReader(files[0]).pipe(concat(function (data) {
    log.append(JSON.stringify({
      name: files[0].name,
      data: data.toString('base64')
    }))
  }))
})

log.createReadStream({live: true})
  .on('data', function (data) {
    var value = JSON.parse(data.value.toString())
    var div = document.createElement('div')
    div.innerHTML = '<a download="'+ value.name + '" href="data:application/octet-stream;base64,' + value.data +'">' + value.name + '</a>'
    document.body.appendChild(div)
  })

// log.append('hello world')
