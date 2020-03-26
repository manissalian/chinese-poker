const Game = require('../core/game')

Game.prototype.unregisterPlayerFromServer = (game, socketId) => {
  const players = game.getPlayers()
  const player = players.find(player => player.socketId === socketId)
  game.removePlayer(player)
}

Game.prototype.playerRegisteredToServer = (game, playerName) => {
  const players = game.getPlayers()
  const player = players.find(player => player.name === playerName)
  return player ? true : false
}

module.exports = Game
