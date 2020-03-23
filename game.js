const Player = require('./player')
const Round = require('./round')

class Game {
  constructor (id) {
    this.id = id

    this.players = []
    this.rounds = []
  }

  createPlayers () {
    for (let i = 0; i < 4; i += 1) {
      const player = new Player(i + 1)
      this.players.push(player)
    }
  }

  getPlayers () {
    return this.players
  }

  getPreviousRound () {
    return this.rounds[this.rounds.length - 2]
  }

  getPlayerById (id) {
    return this.players.find(player => player.id === id)
  }

  getCurrentRound () {
    const roundsCount = this.rounds.length
    return roundsCount ? this.rounds[roundsCount - 1] : null
  }

  startNextRound () {
    const currentRound = this.getCurrentRound()
    const roundId = currentRound ? currentRound.getId() + 1 : 1
    const round = new Round(roundId, this)
    this.rounds.push(round)
    round.deal()
  }

  isComplete () {
    return this.players.find(player => player.score > 100) ? true : false
  }

  getBestPlayer () {
    return this.players.reduce((playerA, playerB) => playerA.score < playerB.score ? playerA : playerB)
  }
}

module.exports = Game
