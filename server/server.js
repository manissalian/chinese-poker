const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors')

const Game = require('./extensions/game_server')
const Player = require('./extensions/player_server')
const Hand = require('./core/hand/hand')
const Card = require('./core/card/card')

const playerRoute = require('./routes/player.js')

http.listen(3000, () => {
  console.log('listening on port 3000')
})

let gameId = 0

const game = new Game(++gameId)

io.on('connection', socket => {
  socket.on('join', name => {
    if (game.playerRegisteredToServer(game, name)) {
      return
    }

    game.addPlayer(player => {
      player.registerToServer(player, name, socket.id)
      socket.emit('joined', player)

      game.startNextRound(() => {
        io.emit('gameStarted')
      })
    })
  })

  socket.on('disconnect', () => {
    game.unregisterPlayerFromServer(game, socket)
  })

  socket.on('play', data => {
    const {
      playerId,
      cards
    } = data

    const selectedCards = cards.map(card => new Card(card))
    const hand = new Hand(selectedCards)
    const currentRound = game.getCurrentRound()

    currentRound.playHand(playerId, hand)
  })
})

app.use(cors())

const addGame = (req, res, next) => {
  req.game = game
  next()
}

app.get('/player/:id', addGame, playerRoute.getPlayer)
