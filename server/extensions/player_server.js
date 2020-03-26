const Player = require('../core/player')

Player.prototype.registerToServer = (player, name, socketId) => {
  player.name = name
  player.socketId = socketId
}

module.exports = Player
