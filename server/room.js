const Game = require('./core/game')

class Room {
  constructor (id) {
    this.id = id

    this.users = []
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

  getGame () {
    return this.game
  }

  addUser (user) {
    this.users.push(user)
  }

  removeUser (user) {
    const userIndex = this.users.indexOf(user)
    this.users.splice(userIndex, 1)
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
      userSocket.emit(event, params)
    })
  }
}

module.exports = Room
