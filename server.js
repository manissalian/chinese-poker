const express = require('express')
const app = express()
const http = require('http').createServer(app)
const port = process.env.PORT != null && process.env.PORT != '' ? process.env.PORT : 3000
const io = require('socket.io')(http, {
  pingTimeout: 600 * 1000
})
const cors = require('cors')

const Lobby = require('./lobby')
const Hand = require('./core/hand/hand')
const User = require('./user')

// app.use(cors())

app.use(express.static(__dirname + '/client'))

http.listen(port, () => {
  console.log('listening on port: ' + port)
})

const ROOMS = 4

const lobby = new Lobby()
for (let i = 0; i < ROOMS; i += 1) {
  lobby.addRoom()
}

io.on('connection', socket => {
  socket.emit('requireLogin')

  socket.on('login', name => {
    if (lobby.getUserByName(name)) {
      socket.emit('uniqueLoginError')
      return
    }

    lobby.addUser(socket.id, name)

    const rooms = lobby.getRooms()

    let roomId = null
    const inGameUser = rooms.find(room => {
      roomId = room.id
      return room.getUserByName(name)
    })

    if (inGameUser) {
      const room = lobby.getRoomById(roomId)
      const user = new User(socket.id, name)
      const game = room.getGame()
      const currentRound = game.getCurrentRound()

      room.updateUser(user)

      socket.emit('joinedRoom', {
        roomId,
        players: game.getFilteredPlayers(name)
      })

      if (currentRound) {
        const currentHand = currentRound.getCurrentHand()
        socket.emit('playerTurn', currentRound.getPlayerTurn())
        socket.emit('currentHand', currentHand && currentHand.getCards())
      }
    } else {
      socket.emit('passToLobby', lobby.getFilteredRooms())
    }
  })

  socket.on('joinVoice', data => {
    const {
      peerId,
      roomId
    } = data

    const room = lobby.getRoomById(roomId)
    room.emitToUsers(io, 'joinedVoice', peerId)
  })

  socket.on('joinRoom', data => {
    const {
      roomId,
      name
    } = data

    const room = lobby.getRoomById(roomId)
    const user = lobby.getUserByName(name)

    if (room.getUserByName(name)) return

    if (room.getUsers().length === 4) return

    room.addUser(user)

    socket.emit('joinedRoom', {
      roomId
    })
    socket.broadcast.emit('userJoinedRoomUpdateLobby', {
      roomId,
      name
    })

    room.startGame(() => {
      // remove cards/opponent_cards before sending
      room.getUsers().map(u => {
        const userSocket = io.of('/').connected[u.getSocketId()]
        userSocket.emit('roundStarted', room.getGame().getFilteredPlayers(u.name))
      })

      const currentRound = room.getGame().getCurrentRound()
      room.emitToUsers(io, 'playerTurn', currentRound.getPlayerTurn())
    })
  })

  socket.on('spectateRoom', data => {
    const {
      roomId,
      name
    } = data

    const room = lobby.getRoomById(roomId)
    const user = lobby.getUserByName(name)
    const game = room.getGame()

    room.addSpectator(user)

    socket.emit('spectatingRoom', {
      roomId,
      players: game.getFilteredPlayers()
    })

    const currentRound = game.getCurrentRound()
    if (currentRound) {
      socket.emit('playerTurn', currentRound.getPlayerTurn())

      const currentHand = currentRound.getCurrentHand()
      if (currentHand) {
        socket.emit('currentHand', currentHand.getCards())
      }
    }
  })

  socket.on('quit', roomId => {
    const user = lobby.getUserBySocketId(socket.id)

    if (!user) return

    const room = lobby.getRoomById(roomId)
    room.removeUser(user)

    if (room.getGame().isStarted()) {
      io.emit('gameReset', {
        roomId: room.getId(),
        name: user.name
      })

      room.resetGame()
    }

    socket.broadcast.emit('userQuitUpdateLobby', {
      roomId,
      name: user.name
    })
  })

  socket.on('quitSpectating', roomId => {
    const user = lobby.getUserBySocketId(socket.id)

    if (!user) return

    const room = lobby.getRoomById(roomId)
    room.removeSpectator(user)
  })

  socket.on('disconnect', () => {
    const user = lobby.getUserBySocketId(socket.id)

    if (!user) return

    lobby.removeUser(user)

    // if no more connected players found in room => reset room
    const room = lobby.getRooms().find(room => room.getUserByName(user.name))
    if (lobby.allRoomUsersDisconnected(room)) {
      io.emit('gameReset', {
        roomId: room.getId()
      })

      room.resetGame()
    }
  })

  // gameplay

  socket.on('play', data => {
    const {
      roomId,
      playerId,
      cards
    } = data

    if (!cards) {
      console.log('no cards received')
      return
    }

    const room = lobby.getRoomById(roomId)
    const game = room.getGame()
    const player = game.getPlayerById(playerId)
    const selectedCards = cards.map(card => {
      return player.getCardByCategoryAndValue(card.category, card.value)
    }).filter(card => card)
    const hand = new Hand(selectedCards)
    const currentRound = game.getCurrentRound()

    if (!currentRound) return

    currentRound.playHand(player, hand, () => {
      room.emitToUsers(io, 'handPlayed', {
        cards: hand.getCards(),
        playerId: player.id
      })

      if (currentRound.getStatus() === 'complete') {
        if (game.isComplete()) {
          room.emitToUsers(io, 'gameComplete', {
            winner: game.getBestPlayer(),
            players: game.getPlayers()
          })

          io.emit('gameReset', {
            roomId: room.getId()
          })

          room.resetGame()
        } else {
          room.emitToUsers(io, 'roundComplete', currentRound.getWinner())

          setTimeout(() => game.startNextRound(() => {
            room.getUsers().map(u => {
              const userSocket = io.of('/').connected[u.getSocketId()]
              userSocket.emit('roundStarted', room.getGame().getFilteredPlayers(u.name))
            })

            const currentRound = room.getGame().getCurrentRound()
            room.emitToUsers(io, 'playerTurn', currentRound.getPlayerTurn())
          }), 5000)
        }
      } else {
        room.emitToUsers(io, 'playerTurn', currentRound.getPlayerTurn())
      }
    })
  })

  socket.on('pass', data => {
    const {
      roomId,
      playerId
    } = data

    const room = lobby.getRoomById(roomId)
    const game = room.getGame()
    const player = game.getPlayerById(playerId)
    const currentRound = game.getCurrentRound()

    if (!currentRound) return

    currentRound.pass(player)

    room.emitToUsers(io, 'playerTurn', currentRound.getPlayerTurn())
  })

  socket.on('chat-message', data => {
    const {
      roomId,
      playerId,
      message
    } = data

    const room = lobby.getRoomById(roomId)

    room.emitToUsers(io, 'chat-message', data)
  })
})
