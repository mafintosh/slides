var ndjson = require('ndjson')
var minimist = require('minimist')
var game = require('./game')
var crypto = require('crypto')
var duplexify = require('duplexify')

var argv = minimist(process.argv.slice(2))
var weapon = argv._[0]

if (!weapon) {
  console.error('You have to choose a weapon!')
  return
}

var play = function () {
  var nounce = crypto.randomBytes(64)
  var proof = crypto.createHmac('sha256', nounce).update(weapon).digest('hex')

  var serialize = ndjson.serialize()
  var parse = ndjson.parse()

  parse.once('data', function (data) {
    var remoteProof = data.proof
    if (remoteProof === proof) {
      console.error('Remote sent invalid proof')
      return
    }

    serialize.write({weapon: weapon, nounce: nounce.toString('hex')})
    parse.once('data', function (data) {
      var remoteWeapon = data.weapon
      var remoteNounce = new Buffer(data.nounce, 'hex')
      var remoteChallenge = crypto.createHmac('sha256', remoteNounce).update(remoteWeapon).digest('hex')

      if (remoteProof !== remoteChallenge) {
        console.error('Your "friend" is trying to cheat!')
        return
      }

      game(weapon, remoteWeapon)
    })
  })

  serialize.write({proof: proof})
  var stream = duplexify()
  stream.setReadable(serialize)
  stream.setWritable(parse)
  return stream
}

process.stdin.pipe(play()).pipe(process.stdout)
