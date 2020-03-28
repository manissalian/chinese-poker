const playHand = () => {
  socket.emit('play', {
    playerId: player.id,
    cards: selectedCards
  })
}