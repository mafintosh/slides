var hypercore = require('hypercore')
var ram = require('random-access-memory')
var signalhub = require('signalhub')
var swarm = require('webrtc-swarm')
var drop = require('drag-and-drop-files')
var fileReader = require('filereader-stream')
var concat = require('concat-stream')

var feed = hypercore(ram, window.location.toString().split('#')[1], {sparse: true})

document.body.innerHTML = `
  <input><br><br>
  <textarea></textarea><br><br>
  <button>send</button><br><br>
`

feed.on('ready', function () {
  var hub = signalhub(feed.key.toString('hex'), 'https://signalhub.mafintosh.com')
  var sw = swarm(hub)

  sw.on('peer', function (peer) {
    console.log('new peer')
    peer.pipe(feed.replicate({encrypt: false})).pipe(peer)
  })

  window.location = '#' + feed.key.toString('hex')
  document.querySelector('input').value = feed.key.toString('hex')
})

feed.get(0, function () {
  var start = Math.max(0, feed.length - 5)
  console.log(start)
  feed.createReadStream({live: true, start: start}).on('data', function (data) {
    var div = document.createElement('div')
    div.innerHTML = data.toString()
    document.querySelector('body').appendChild(div)
  })
})

document.querySelector('button').onclick = function () {
  feed.append(document.querySelector('textarea').value)
}

drop(document.body, function (files) {
  fileReader(files[0]).pipe(concat(function (data) {
    feed.append('<img src="data:image/png;base64,' + data.toString('base64') + '">')
  }))
})
