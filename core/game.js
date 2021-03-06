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

  addPlayer (name, cb) {
    const playersCount = this.players.length

    if (playersCount >= 4) return

    const player = new Player(playersCount + 1, name)
    this.players.push(player)

    if (cb) {
      cb(player) 
    }
  }

  removePlayer (player) {
    const playerIndex = this.players.indexOf(player)
    this.players.splice(playerIndex, 1)
  }

  getPlayers () {
    return this.players
  }

  getFilteredPlayers (name) {
    return this.players.map(player => {
      if (name && player.name === name) {
        return player
      }

      return player.getWithHiddenCards()
    })
  }

  getPreviousRound () {
    return this.rounds[this.rounds.length - 2]
  }

  getPlayerById (id) {
    return this.players.find(player => player.id == id)
  }

  getCurrentRound () {
    const roundsCount = this.rounds.length
    return roundsCount ? this.rounds[roundsCount - 1] : null
  }

  startNextRound (cb) {
    const currentRound = this.getCurrentRound()

    if (currentRound && currentRound.getStatus() === 'inProgress') return

    if (this.players.length < 4) return

    const roundId = currentRound ? currentRound.getId() + 1 : 1
    const round = new Round(roundId, this)
    this.rounds.push(round)

    this.players.map(player => player.resetCards())

    round.deal()

    if (cb) {
      cb()
    }
  }

  isStarted () {
    return this.rounds.length
  }

  isComplete () {
    return this.players.find(player => player.score > 100) ? true : false
  }

  getBestPlayer () {
    return this.players.reduce((playerA, playerB) => playerA.score < playerB.score ? playerA : playerB)
  }
}

module.exports = Game
