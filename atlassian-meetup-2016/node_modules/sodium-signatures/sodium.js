var sodium = require('sodium').api

exports.keyPair = function () {
  return sodium.crypto_sign_keypair()
}

exports.verify = function (message, signature, publicKey) {
  return sodium.crypto_sign_verify_detached(signature, message, publicKey)
}

exports.sign = function (message, secretKey) {
  return sodium.crypto_sign_detached(message, secretKey)
}
