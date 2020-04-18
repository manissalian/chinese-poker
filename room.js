const Game = require('./core/game')

class Room {
  constructor (id) {
    this.id = id

    this.users = []
    this.spectators = []
    this.game = new Game()
  }

  getId () {
    return this.id
  }

  getUsers () {
    return this.users
  }

  getUserByName (name) {
    return this.users.find(user => user.name === name)
  }

  getSpectators () {
    return this.spectators
  }

  getGame () {
    return this.game
  }

  addUser (user) {
    this.users.push(user)
  }

  updateUser (user) {
    this.users = this.users.map(u => {
      if (user.name === u.name) {
        return user
      }
      return u
    })
  }

  removeUser (user) {
    const userIndex = this.users.indexOf(user)
    this.users.splice(userIndex, 1)
  }

  addSpectator (spectator) {
    this.spectators.push(spectator)
  }

  removeSpectator (spectator) {
    const spectatorIndex = this.spectators.indexOf(spectator)
    this.spectators.splice(spectatorIndex, 1)
  }

  startGame (cb) {
    if (this.users.length !== 4) return

    for (let i in this.users) {
      const user = this.users[i]

      this.game.addPlayer(user.getName())
    }

    this.game.startNextRound(() => {
      if (cb) cb()
    })
  }

  resetGame () {
    this.users = []
    this.game = new Game()
  }

  emitToUsers (io, event, params) {
    this.users.map(user => {
      const userSocket = io.of('/').connected[user.getSocketId()]

      if (!userSocket) return

      userSocket.emit(event, params)
    })

    this.spectators.map(spectator => {
      const spectatorSocket = io.of('/').connected[spectator.getSocketId()]

      if (!spectatorSocket) return

      spectatorSocket.emit(event, params)
    })
  }
}

module.exports = Room
