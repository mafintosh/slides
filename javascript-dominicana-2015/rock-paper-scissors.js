var ndjson = require('ndjson')
var net = require('net')
var crypto = require('crypto')
var duplexify = require('duplexify')

module.exports = function (weapon, server) {
  var nounce = crypto.randomBytes(32)
  var hmac = crypto.createHmac('sha256', nounce)
  var proof = hmac.update(weapon).digest('hex')

  var parse = ndjson.parse()
  var serialize = ndjson.serialize()

  parse.once('data', function (proof) {
    serialize.write({
      weapon: weapon,
      nounce: nounce.toString('hex')
    })

    parse.once('data', function (data) {
      var remoteWeapon = data.weapon
      var remoteHmac = crypto.createHmac('sha256', new Buffer(data.nounce, 'hex'))
      var remoteProof = remoteHmac.update(remoteWeapon).digest('hex')

      if (remoteProof !== proof) {
        console.error('Your "friend" is a liar')
        return
      }

      if (weapon === remoteWeapon) {
        console.error('tie')
        return
      }

      switch (weapon) {
        case 'rock':
        return won(remoteWeapon === 'scissors')
        case 'paper':
        return won(remoteWeapon === 'rock')
        case 'scissors':
        return won(remoteWeapon === 'paper')
      }

      function won (yes) {
        if (yes) console.error('You won')
        else console.error('You lost')
      }

    })
  })

  serialize.write(proof)

  return duplexify(parse, serialize)
}