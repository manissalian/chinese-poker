const playHand = () => {
  socket.emit('play', {
    roomId: _roomId,
    playerId: player.id,
    cards: selectedCards
  })
}

const pass = () => {
  socket.emit('pass', {
    roomId: _roomId,
    playerId: player.id
  })
}
