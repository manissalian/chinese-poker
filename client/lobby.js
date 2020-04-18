socket.on('passToLobby', rooms => {
  const loginElement = document.getElementById('login')
  loginElement.classList.add('display-none')

  const lobbyElement = document.getElementById('lobby')
  lobbyElement.classList.remove('display-none')

  rooms.map(room => {
    const roomsElement = document.getElementById('rooms')

    const roomElement = document.createElement('div')
    roomElement.classList.add('room')

    const titleElement = document.createElement('div')
    titleElement.innerHTML = 'Room #' + room.id
    roomElement.appendChild(titleElement)

    const listElement = document.createElement('ol')
    listElement.setAttribute('id', room.id)
    room.users.map(user => {
      const userElement = document.createElement('li')
      userElement.setAttribute('name', user.name)
      userElement.innerHTML = user.name
      listElement.appendChild(userElement)
    })
    roomElement.appendChild(listElement)

    const joinbuttonElement = document.createElement('button')
    joinbuttonElement.classList.add('join-room-btn')
    joinbuttonElement.innerHTML = 'Join'
    joinbuttonElement.addEventListener('click', () => {
      socket.emit('joinRoom', {
        roomId: room.id,
        name: playerName
      })
    })
    roomElement.appendChild(joinbuttonElement)

    const spectateButtonElement = document.createElement('button')
    spectateButtonElement.classList.add('spectate-room-btn')
    spectateButtonElement.innerHTML = 'Spectate'
    spectateButtonElement.addEventListener('click', () => {
      roomId = room.id
      socket.emit('spectateRoom', {
        roomId: room.id,
        name: playerName
      })
    })
    roomElement.appendChild(spectateButtonElement)

    roomsElement.appendChild(roomElement)
  })
})

socket.on('userJoinedRoomUpdateLobby', data => {
  if (!playerName) return

  const {
    roomId,
    name
  } = data

  const listElement = document.querySelector('ol[id="' + roomId + '"]')
  const userElement = document.createElement('li')
  userElement.setAttribute('name', name)
  userElement.innerHTML = name
  listElement.appendChild(userElement)
})

socket.on('userQuitUpdateLobby', data => {
  if (!playerName) return

  const {
    roomId,
    name
  } = data

  const listElement = document.querySelector('ol[id="' + roomId + '"]')
  const userElement = document.querySelector('li[name="' + name + '"]')
  if (userElement) {
    listElement.removeChild(userElement)
  }
})

socket.on('gameReset', data => {
  const {
    roomId
  } = data

  const listElement = document.querySelector("ol[id='" + roomId + "']")
  while (listElement.firstChild) listElement.removeChild(listElement.firstChild)
})
