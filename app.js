const Game = require('./game')

let gameId = 0

const game = new Game(++gameId)
game.start()
