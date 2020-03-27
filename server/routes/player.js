const Player = require('../extensions/player_server')

module.exports = {
  getPlayer: (req, res) => {
    const game = req.game
    const id = req.params.id

    res.send(game.getPlayerById(id))
  }
}
