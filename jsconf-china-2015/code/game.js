var rockPaperScissors = function (weapon, opponentWeapon) {
  if (weapon === opponentWeapon) {
    console.error('Tie!')
    return
  }

  var won = function (yes) {
    if (yes) console.error('You win :) ' + weapon + ' beats ' + opponentWeapon)
    else console.error('You lose :( ' + opponentWeapon + ' beats ' + weapon)
  }

  switch (weapon) {
    case 'scissors':
    won(opponentWeapon === 'paper')
    break

    case 'rock':
    won(opponentWeapon === 'scissors')
    break

    case 'paper':
    won(opponentWeapon === 'rock')
    break
  }
}

module.exports = rockPaperScissors
