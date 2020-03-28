const playHand = () => {
  socket.emit('play', {
    playerId: player.id,
    cards: selectedCards
  })
}

const pass = () => {
  socket.emit('pass', player.id)
}
