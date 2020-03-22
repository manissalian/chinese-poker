const Card = require('./card/card')
const cardTypes = require('./card/types')

class Round {
  constructor (id, game) {
    this.id = id
    this.game = game
    this.playerTurn = null
  }

  getId () {
    return this.id
  }

  deal () {
    let distributingCards = cardTypes.slice()
    for (let i = 0; i < cardTypes.length; i += 1) {
      const cardIndex = Math.floor(Math.random() * distributingCards.length)
      const card = distributingCards[cardIndex]
      const playerIndex = i % 4

      const player = this.game.getPlayerById(playerIndex + 1)
      player.addCard(new Card(card))
      distributingCards.splice(cardIndex, 1)
    }

    this.determinePlayerTurn()
  }

  determinePlayerTurn () {
    // second turn +
    if (this.playerTurn) {
    }

    // first turn
    //// first round
    if (this.id === 1) {
      const player = this.game.getPlayers().find(player => {
        return player.getCards().find(card => card.getCategory() === 'D' && card.getValue() === 1)
      })
      this.playerTurn = player.id
    } else {
      //// second round +
    }
  }

  getPlayerTurn () {
    return this.playerTurn
  }
}

module.exports = Round
