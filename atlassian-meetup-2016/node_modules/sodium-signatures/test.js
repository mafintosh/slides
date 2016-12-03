var tape = require('tape')
var signatures = require('./')

tape('sign and verify', function (t) {
  var keys = signatures.keyPair()
  t.ok(keys.publicKey, 'has public key')
  t.ok(keys.secretKey, 'has secret key')
  var message = new Buffer('hello')
  var sig = signatures.sign(message, keys.secretKey)
  t.ok(signatures.verify(message, sig, keys.publicKey), 'message verifies')
  t.end()
})
