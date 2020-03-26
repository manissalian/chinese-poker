const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const Game = require('./extensions/game_server')
const Player = require('./extensions/player_server')

http.listen(3000, () => {
  console.log('listening on port 3000')
})

let gameId = 0

const game = new Game(++gameId)

io.on('connection', socket => {
  console.log('a user connected')

  socket.on('join', name => {
    console.log(name + ' requests to join')

    if (game.playerRegisteredToServer(game, name)) {
      return
    }

    game.addPlayer(player => {
      player.registerToServer(player, name, socket.id)

      console.log(name + ' joined')

      game.startNextRound(() => {
        io.emit('gameStarted')
      })
    })
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')

    game.unregisterPlayerFromServer(game, socket)
  })
})
