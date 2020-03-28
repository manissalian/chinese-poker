const Game = require('./game')
const Card = require('./card/card')
const Hand = require('./hand/hand')

const readline = require('readline')

let gameId = 0

const game = new Game(++gameId)
game.createPlayers()
game.startNextRound()

const prompt = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const currentRound = game.getCurrentRound()
  const playerTurn = currentRound.getPlayerTurn()
  const player = game.getPlayerById(playerTurn)
  const playerCards = player.getCards()

  console.log(playerCards)

  rl.question('Player ' + playerTurn + ', pick a hand (card numbers, comma separated): ', handInput => {
    rl.close()

    const cardNumbers = handInput.split(',')

    if (cardNumbers[0] == 0) {
      currentRound.pass(player)
    } else {
      const hand = new Hand(cardNumbers.map(cardNumber => playerCards[cardNumber - 1]))

      currentRound.playHand(player.id, hand)
    }

    const currentRoundStatus = currentRound.getStatus()

    if (currentRoundStatus === 'inProgress') {
      prompt()
    } else {
      console.log('Player ' + player.id + ' wins')

      if (game.isComplete()) {
        console.log('Game complete. Winner is: ', game.getBestPlayer().id)
      } else {
        game.startNextRound()
        prompt()
      }
    }
  })
}

prompt()
