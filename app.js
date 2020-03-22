const Game = require('./game')

let gameId = 0

const game = new Game(++gameId)
game.createPlayers()
game.startNextRound()

const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const playersTurn = game.getCurrentRound().getPlayerTurn()
console.log(game.getPlayerById(playersTurn).getCards())

rl.question('Player ' + playersTurn + ', pick card (number): ', index => {
  console.log('selected card is: ', game.getPlayerById(1).getCardAtIndex(index - 1))
  rl.close()
})
