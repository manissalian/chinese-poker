class User {
  constructor (socketId, name) {
    this.socketId = socketId
    this.name = name
  }

  getSocketId () {
    return this.socketId
  }

  getName () {
    return this.name
  }
}

module.exports = User
