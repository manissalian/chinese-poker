const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  pingTimeout: 10000 * 1000
})
const cors = require('cors')

const Game = require('./extensions/game_server')
const Player = require('./extensions/player_server')
const Hand = require('./core/hand/hand')

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
        // remove cards/opponent_cards before sending
        io.emit('gameStarted', game.getPlayers())
      })
    })
  })

  socket.on('disconnect', () => {
    game.unregisterPlayerFromServer(game, socket.id)
  })

  socket.on('play', data => {
    const {
      playerId,
      cards
    } = data

    if (!cards) {
      console.log('no cards received')
      return
    }

    const player = game.getPlayerById(playerId)
    const selectedCards = cards.map(card => {
      return player.getCardByCategoryAndValue(card.category, card.value)
    }).filter(card => card)
    const hand = new Hand(selectedCards)
    const currentRound = game.getCurrentRound()

    currentRound.playHand(player, hand, () => {
      io.emit('handPlayed', {
        cards: hand.getCards(),
        playerId: player.id
      })
    })
  })

  socket.on('pass', playerId => {
    const player = game.getPlayerById(playerId)
    const currentRound = game.getCurrentRound()

    currentRound.pass(player)
  })
})

app.use(cors())

const addGame = (req, res, next) => {
  req.game = game
  next()
}

app.get('/player/:id', addGame, playerRoute.getPlayer)