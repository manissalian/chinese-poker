const cards = require('./cards')
const Player = require('./player')

let gameId = 0

class Game {
  constructor (id) {
    this.id = id
    this.players = []
  }

  start () {
    this.createPlayers()
    this.deal()
  }

  createPlayers () {
    let playerId = 0
    for (let i = 0; i < 4; i += 1) {
      const player = new Player(++playerId)
      this.players.push(player)
    }
  }

  deal () {
    let distributingCards = cards.slice()
    for (let i = 0; i < cards.length; i += 1) {
      const cardIndex = Math.floor(Math.random() * distributingCards.length)
      const card = distributingCards[cardIndex]
      const playerIndex = i % 4

      this.players[playerIndex].cards.push(card)
      distributingCards.splice(cardIndex, 1)
    }
  }
}

const game = new Game(++gameId)
game.start()
