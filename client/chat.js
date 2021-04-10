const sendMessage = (event) => {
  event.preventDefault()
  input = event.target.querySelector('#chat-input')
  socket.emit('chat-message', {
    roomId: _roomId,
    // playerId: player.id,
    playerId: playerName,
    message: input.value
  })
  input.value = ''
}

socket.on('chat-message', data => {
  const {
    roomId,
    playerId,
    message
  } = data
  if (roomId !== _roomId) return
  const playerSpan = document.createElement('span')
  const messageSpan = document.createElement('span')
  const p = document.createElement('p')
  messageSpan.innerHTML = message
  playerSpan.innerHTML = playerId + ":"
  playerSpan.style['font-weight'] = 'bold'
  messageSpan.style['margin-left'] = '0.25rem'
  p.appendChild(playerSpan)
  p.appendChild(messageSpan)
  p.style['overflow-wrap'] = 'anywhere'
  document.getElementById('chat-messages').prepend(p)
})
