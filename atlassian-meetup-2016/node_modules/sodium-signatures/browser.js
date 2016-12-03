var tweetnacl = require('tweetnacl')

exports.keyPair = function () {
  var publicKey = new Buffer(tweetnacl.lowlevel.crypto_sign_PUBLICKEYBYTES)
  var secretKey = new Buffer(tweetnacl.lowlevel.crypto_sign_SECRETKEYBYTES)
  tweetnacl.lowlevel.crypto_sign_keypair(publicKey, secretKey)
  return {publicKey: publicKey, secretKey: secretKey}
}

exports.verify = function (message, signature, publicKey) {
  return tweetnacl.sign.detached.verify(toUint8Array(message), toUint8Array(signature), toUint8Array(publicKey))
}

exports.sign = function (message, secretKey) {
  return toBuffer(tweetnacl.sign.detached(toUint8Array(message), toUint8Array(secretKey)))
}

function toUint8Array (message) {
  var message8 = new Uint8Array(message.length)
  for (var i = 0; i < message8.length; i++) message8[i] = message[i]
  return message8
}

function toBuffer (message8) {
  var message = new Buffer(message8.length)
  for (var i = 0; i < message.length; i++) message[i] = message8[i]
  return message
}
