const Card = require('./card/card')
const cardTypes = require('./card/types')

class Round {
  constructor (id, game) {
    this.id = id
    this.game = game
    this.playerTurn = null
    this.status = 'inProgress'
    this.currentHand = null
    this.passes = 0
  }

  getId () {
    return this.id
  }

  getPlayerTurn () {
    return this.playerTurn
  }

  getStatus () {
    return this.status
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
      this.playerTurn = this.playerTurn + (this.playerTurn < 4 ? 1 : -3)
      return
    }

    // first turn, first round
    if (this.isFirstRound()) {
      this.playerTurn = this.weakestCardOwningPlayer().id
    } else {
      // first turn, second round +
      // winner
    }
  }

  playHand (player, hand) {
    console.log('selected hand is: ', hand)

    const handType = hand.getType()
    const cards = hand.getCards()

    if (player.id !== this.playerTurn) {
      console.log('not player ' + player.id + ' turn')
      return
    }

    if (!handType) {
      console.log('invalid hand')
      return
    }

    if (this.isFirstTurn()) {
      if (!cards.find(card => card.getCategory() === 'D' && card.getValue() === 1)) {
        console.log('hand must contain weakest card in first turn') 
        return
      }

      cards.map(card => {
        player.removeCard(card)
      })

      this.currentHand = hand

      this.determinePlayerTurn()

      return
    }

    if (handType !== this.currentHand.getType() && this.passes < 3) {
      console.log('invalid hand type')
      return
    }

    if (hand.getScore() <= this.currentHand.getScore() && this.passes < 3) {
      console.log('hand score must be higher than the current hand score')
      return
    }

    cards.map(card => {
      player.removeCard(card)
    })

    this.currentHand = hand

    this.passes = 0

    this.determinePlayerTurn()
  }

  pass (player) {
    if (this.isFirstTurn()) {
      console.log('cant pass during first turn') 
      return
    }

    this.passes = this.passes + 1

    this.determinePlayerTurn()
  }

  weakestCardOwningPlayer () {
    return this.game.getPlayers().find(player => {
      return player.getCards().find(card => card.getCategory() === 'D' && card.getValue() === 1)
    })
  }

  isFirstTurn () {
    return this.weakestCardOwningPlayer() ? true : false
  }

  isFirstRound () {
    return this.id === 1
  }
}

module.exports = Round