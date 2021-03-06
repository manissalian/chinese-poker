let _roomId = null
let spectating = false

let player = null
let playerTurnId = null
let selectedCards = []

const resetRoomUI = () => {
  const deckIds = ['player-deck', 'opponent-deck-1', 'opponent-deck-2', 'opponent-deck-3']
  deckIds.map(deckId => {
    const deckEl = document.getElementById(deckId)
    while (deckEl.firstChild) deckEl.removeChild(deckEl.firstChild)
  })

  const nameIds = ['player-name', 'opponent-name-1', 'opponent-name-2', 'opponent-name-3']
  nameIds.map(nameId => {
    const nameEl = document.getElementById(nameId)
    nameEl.innerHTML = ''
  })

  const scoreIds = ['player-score', 'opponent-score-1', 'opponent-score-2', 'opponent-score-3']
  scoreIds.map(scoreId => {
    const scoreEl = document.getElementById(scoreId)
    scoreEl.innerHTML = ''
  })

  const ground = document.getElementById('ground')
  while (ground.firstChild) ground.removeChild(ground.firstChild)

  const announcement = document.getElementById('announcement')
  announcement.innerHTML = ''

  const turnElement = getTurnElement()
  if (turnElement) turnElement.classList.add('display-none') 
}

const renderUI = players => {
  if (!players || !players.length) return

  document.getElementById('player-name').innerHTML = spectating ? players[0].name : playerName

  const playerDeck = document.getElementById('player-deck')
  while (playerDeck.firstChild) playerDeck.removeChild(playerDeck.firstChild)

  for (let i in player.cards) {
    if (spectating) {
      const cardElement = document.createElement('div')
      cardElement.classList.add('card')

      const cardImageElement = document.createElement('img')
      cardImageElement.classList.add('card-image')
      cardImageElement.src = 'assets/cards/cardback.jpg'
      cardImageElement.setAttribute('draggable', false)
      cardElement.appendChild(cardImageElement)

      playerDeck.appendChild(cardElement)
      continue
    }

    const card = player.cards[i]

    const cardElement = document.createElement('div')
    cardElement.classList.add('card')
    cardElement.setAttribute('id', card.category + card.value)
    cardElement.setAttribute('draggable', true)
    cardElement.addEventListener('dragstart', onCardDragStart)
    cardElement.addEventListener('dragover', onCardDragOver)
    cardElement.addEventListener('click', e => {
      toggleSelectCard(card, cardElement)
    })

    const cardImageElement = document.createElement('img')
    cardImageElement.classList.add('card-image')
    cardImageElement.src = 'assets/cards/' + mapCardToAsset(card) + '.jpg'
    cardImageElement.setAttribute('draggable', false)
    cardElement.appendChild(cardImageElement)

    playerDeck.appendChild(cardElement)
  }

  document.getElementById('player-score').innerHTML = 'Score: ' + player.score

  const opponentId1 = player.id === 4 ? 1 : player.id + 1
  const opponentId2 = opponentId1 === 4 ? 1 : opponentId1 + 1
  const opponentId3 = opponentId2 === 4 ? 1 : opponentId2 + 1

  const opponentDeck1 = document.getElementById('opponent-deck-1')
  const opponentDeck2 = document.getElementById('opponent-deck-2')
  const opponentDeck3 = document.getElementById('opponent-deck-3')

  opponentDeck1.setAttribute('player-id', opponentId1)
  opponentDeck2.setAttribute('player-id', opponentId2)
  opponentDeck3.setAttribute('player-id', opponentId3)

  const opponentTurn1 = document.getElementById('opponent-turn-1')
  const opponentTurn2 = document.getElementById('opponent-turn-2')
  const opponentTurn3 = document.getElementById('opponent-turn-3')

  opponentTurn1.setAttribute('player-id', opponentId1)
  opponentTurn2.setAttribute('player-id', opponentId2)
  opponentTurn3.setAttribute('player-id', opponentId3)

  while (opponentDeck1.firstChild) opponentDeck1.removeChild(opponentDeck1.firstChild)
  while (opponentDeck2.firstChild) opponentDeck2.removeChild(opponentDeck2.firstChild)
  while (opponentDeck3.firstChild) opponentDeck3.removeChild(opponentDeck3.firstChild)

  players.map(p => {
    if (p.id === player.id) return

    p.cards.map(card => {
      const opponentCard = document.createElement('img')
      opponentCard.src = 'assets/cards/cardback.jpg'
      opponentCard.setAttribute('draggable', false)
      if (p.id === opponentId1) {
        opponentCard.classList.add('opponent1-card')
        opponentDeck1.appendChild(opponentCard)
      } else if (p.id === opponentId2) {
        opponentCard.classList.add('opponent2-card')
        opponentDeck2.appendChild(opponentCard)
      } else if (p.id === opponentId3) {
        opponentCard.classList.add('opponent3-card')
        opponentDeck3.appendChild(opponentCard)
      }
    })
  })

  const opponentName1 = document.getElementById('opponent-name-1')
  const opponentName2 = document.getElementById('opponent-name-2')
  const opponentName3 = document.getElementById('opponent-name-3')

  opponentName1.innerHTML = players.find(p => p.id === opponentId1).name
  opponentName2.innerHTML = players.find(p => p.id === opponentId2).name
  opponentName3.innerHTML = players.find(p => p.id === opponentId3).name

  const opponentScore1 = document.getElementById('opponent-score-1')
  const opponentScore2 = document.getElementById('opponent-score-2')
  const opponentScore3 = document.getElementById('opponent-score-3')

  opponentScore1.setAttribute('player-id', opponentId1)
  opponentScore2.setAttribute('player-id', opponentId2)
  opponentScore3.setAttribute('player-id', opponentId3)

  opponentScore1.innerHTML = 'Score: ' + players.find(p => p.id === opponentId1).score
  opponentScore2.innerHTML = 'Score: ' + players.find(p => p.id === opponentId2).score
  opponentScore3.innerHTML = 'Score: ' + players.find(p => p.id === opponentId3).score

  const ground = document.getElementById('ground')

  while (ground.firstChild) ground.removeChild(ground.firstChild)

  selectedCards = []
}

const updateGroundCards = (cards) => {
  cards.map(card => {
    const cardElement = document.createElement('div')
    cardElement.classList.add('card')

    const cardImageElement = document.createElement('img')
    cardImageElement.classList.add('card-image')
    cardImageElement.src = 'assets/cards/' + mapCardToAsset(card) + '.jpg'
    cardImageElement.setAttribute('draggable', false)
    cardElement.appendChild(cardImageElement)

    ground.appendChild(cardElement)
  })
}

const getTurnElement = () => {
  if (player && player.id == playerTurnId) {
    return document.getElementById('player-turn')
  }

  return document.querySelector(".turn[player-id='" + playerTurnId + "']")
}

const quit = () => {
  if (spectating) {
    socket.emit('quitSpectating', _roomId)
  } else {
    socket.emit('quit', _roomId)
  }

  const roomElement = document.getElementById('room')
  roomElement.classList.add('display-none')

  const lobbyElement = document.getElementById('lobby')
  lobbyElement.classList.remove('display-none')
}

socket.on('joinedRoom', data => {
  const {
    roomId,
    players
  } = data

  joinVoice(roomId)

  resetRoomUI()

  _roomId = roomId

  const loginElement = document.getElementById('login')
  loginElement.classList.add('display-none')

  const lobbyElement = document.getElementById('lobby')
  lobbyElement.classList.add('display-none')

  const roomElement = document.getElementById('room')
  roomElement.classList.remove('display-none')

  document.getElementById('player-name').innerHTML = playerName

  if (players) {
    player = players.find(p => p.name === playerName)
    renderUI(players)
  }
})

socket.on('gameReset', data => {
  const {
    name
  } = data

  if (name) {
    const announcement = document.getElementById('announcement')
    announcement.innerHTML = name + ' has quit. The game ends.'
    announcement.classList.remove('display-none')
  }
})

// gameroom / gameplay

socket.on('roundStarted', players => {
  player = spectating ? players[0] : players.find(p => p.name === playerName)

  renderUI(players)
})

socket.on('spectatingRoom', data => {
  const {
    roomId,
    players
  } = data

  joinVoice(roomId)

  spectating = true

  resetRoomUI()

  _roomId = roomId

  const loginElement = document.getElementById('login')
  loginElement.classList.add('display-none')

  const lobbyElement = document.getElementById('lobby')
  lobbyElement.classList.add('display-none')

  const roomElement = document.getElementById('room')
  roomElement.classList.remove('display-none')

  player = players[0]

  document.getElementById('player-name').innerHTML = (player && player.name) || ''

  renderUI(players)

  const actionBtns = document.getElementById('action-btns')
  actionBtns.classList.add('display-none')
})

socket.on('handPlayed', data => {
  const {
    cards,
    playerId
  } = data

  const ground = document.getElementById('ground')

  while (ground.firstChild) ground.removeChild(ground.firstChild)

  updateGroundCards(cards)

  if (playerId === player.id) {
    selectedCards = []

    cards.map(card => {
      const playerCard = player.cards.find(pCard => pCard.category === card.category && pCard.value === card.value)
      const cardIndex = player.cards.indexOf(playerCard)

      player.cards.splice(cardIndex, 1)

      const cardElement = document.getElementById(card.category + card.value)
      const playerDeck = document.getElementById('player-deck')
      playerDeck.removeChild(spectating ? playerDeck.childNodes[0] : cardElement)
    })
  } else {
    const opponentDeck = document.querySelector(".deck[player-id='" + playerId + "']")
    cards.map(card => {
      opponentDeck.removeChild(opponentDeck.childNodes[0])
    })
  }
})

socket.on('playerTurn', playerId => {
  if (playerTurnId) {
    getTurnElement().classList.add('display-none')
  }

  playerTurnId = playerId

  getTurnElement().classList.remove('display-none')

  if (playerTurnId === player.id && !spectating) {
    document.getElementById('turn-sound').play()
  }
})

socket.on('currentHand', cards => {
  updateGroundCards(cards)
})

socket.on('roundComplete', winner => {
  const announcement = document.getElementById('announcement')
  announcement.innerHTML = winner.name + ' wins this round!'
  announcement.classList.remove('display-none')

  setTimeout(() => {
    announcement.classList.add('display-none')
  }, 5000)
})

socket.on('gameComplete', data => {
  const {
    winner,
    players
  } = data

  players.map(p => {
    const scoreElement = p.id === player.id ?
      document.getElementById('player-score') :
      document.querySelector(".score[player-id='" + p.id + "']")

    scoreElement.innerHTML = 'Score: ' + p.score
  })

  const announcement = document.getElementById('announcement')
  announcement.innerHTML = winner.name + ' wins the game!!!'
  announcement.classList.remove('display-none')
})
