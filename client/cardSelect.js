const selectedCards = []

const toggleSelectCard = (card, el) => {
  const isCardSelected = selectedCards.indexOf(card) > -1 ? true : false

  if (isCardSelected) {
    const cardIndex = selectedCards.indexOf(card)
    selectedCards.splice(cardIndex, 1)

    el.classList.remove('selected-card')
  } else {
    selectedCards.push(card)

    el.classList.add('selected-card')
  }
}
