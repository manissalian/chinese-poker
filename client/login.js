let playerName = null

const login = () => {
  const nameValue = document.getElementById('name-input').value

  if (!nameValue) {
    alert('Enter a name before you join.')
    return
  }

  playerName = nameValue
  socket.emit('login', playerName)
}

socket.on('requireLogin', () => {
  const loginElement = document.getElementById('login')
  loginElement.classList.remove('display-none')
})

socket.on('uniqueLoginError', () => {
  alert('A user with that name is already connected, choose another.')
})
