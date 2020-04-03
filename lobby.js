const Room = require('./room')
const User = require('./user')

class Lobby {
  constructor () {
    this.rooms = []
    this.users = []
  }

  getRooms () {
    return this.rooms
  }

  getFilteredRooms () {
    const filteredRooms = this.rooms.map(room => {
      const { game, ...filteredRoom } = room
      return filteredRoom
    })
    return filteredRooms
  }

  getRoomById (id) {
    return this.rooms.find(room => room.id === id)
  }

  getUsers () {
    return this.users
  }

  addRoom () {
    const room = new Room(this.rooms.length + 1)
    this.rooms.push(room)
  }

  addUser (socketId, name) {
    const user = new User(socketId, name)
    this.users.push(user)
  }

  removeUser (user) {
    const userIndex = this.users.indexOf(user)
    this.users.splice(userIndex, 1)
  }

  getUserByName (name) {
    return this.users.find(user => user.name === name)
  }

  getUserBySocketId (socketId) {
    return this.users.find(user => user.socketId === socketId)
  }

  allRoomUsersDisconnected (room) {
    if (!room) return false

    for (let i in room.users) {
      const user = room.users[i]

      if (this.getUserByName(user.name)) return false
    }

    return true
  }
}

module.exports = Lobby
