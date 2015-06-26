// var hyperlog = require('hyperlog')
// console.log('hello world')

var hyperlog = require('hyperlog')
var level = require('level-browserify')
var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var drop = require('drag-and-drop-files')
var filereader = require('filereader-stream')
var concat = require('concat-stream')

var hub = signalhub('test-demo', [
  'https://signalhub.mafintosh.com'
])

drop(window, function (files) {
  filereader(files[0])
    .pipe(concat(function (data) {
      log.append(JSON.stringify({
        name: files[0].name,
        data: data.toString('base64')
      }))
    }))
})

var sw = swarm(hub)

var db = level('db-demo-hyperlog-3')
var log = hyperlog(db)

var stream = log.replicate()

log.createReadStream({live: true})
  .on('data', function (data) {
    var val = JSON.parse(data.value.toString())
    var div = document.createElement('div')

    div.innerHTML = '<a download="' + val.name + '" href="data:application/octet-stream;base64,' + val.data + '">' +
      val.name +
      '</a>'

    document.body.appendChild(div)
  })

sw.on('peer', function (peer) {
  peer.pipe(log.replicate({live: true})).pipe(peer)
})
