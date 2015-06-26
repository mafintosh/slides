var ndjson = require('ndjson')
var crypto = require('crypto')
var duplexify = require('duplexify')

module.exports = function (weapon, isServer) {
  // weapon = rock|paper|scissors
  var serialize = ndjson.serialize()
  var parse = ndjson.parse()
  var nounce = crypto.randomBytes(64)
  var proof = crypto.createHmac('sha256', nounce).update(weapon).digest('hex')

  parse.once('data', function (data) {
    var remoteProof = data.proof

    serialize.write({
      weapon: weapon,
      nounce: nounce
    })

    parse.once('data', function (data) {
      var remoteWeapon = data.weapon
      var remoteNounce = data.nounce
      var remoteChallenge = crypto.createHmac('sha256', new Buffer(remoteNounce, 'hex')).update(remoteWeapon).digest('hex')

      if (remoteProof !== remoteChallenge) {
        console.error('You "friend" is lying!')
        return
      }

      if (remoteWeapon === weapon) {
        console.error('Tie!')
        return
      }

      switch (remoteWeapon) {
        case 'rock':
        won(weapon === 'paper')
        return

        case 'scissors':
        won(weapon === 'rock')
        return

        case 'paper':
        won(weapon === 'scissors')
        return
      }

      function won (yes) {
        if (yes) console.error('You win!')
        else console.error('You lose!')
      }

    })
  })

  serialize.write({
    proof: proof
  })

  return duplexify(parse, serialize)
}













