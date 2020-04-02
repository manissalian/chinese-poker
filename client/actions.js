const playHand = () => {
  socket.emit('play', {
    roomId,
    playerId: player.id,
    cards: selectedCards
  })
}

const pass = () => {
  socket.emit('pass', {
    roomId,
    playerId: player.id
  })
}
