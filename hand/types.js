const single = (cards) => {
  return cards.length === 1
}

const pair = (cards) => {
  return cards.length === 2 &&
          cards[0].value === cards[1].value
}

const threeOfAKind = (cards) => {
  return cards.length === 3 &&
          cards[0].value === cards[1].value &&
          cards[0].value === cards[2].value
}

const straight = (cards) => {
  if (cards.length !== 5) return false

  const sortedCards = sortCards(cards)

  for (let i = 0; i < 4; i += 1) {
    if (sortedCards[i].value !== sortedCards[i + 1].value - 1) return false
  }

  return true
}

const flush = (cards) => {
  if (cards.length !== 5) return false

  return cards[0].category === cards[1].category &&
          cards[0].category === cards[2].category &&
          cards[0].category === cards[3].category &&
          cards[0].category === cards[4].category
}

const fullHouse = (cards) => {
  if (cards.length !== 5) return false

  const sortedCards = sortCards(cards)

  if (sortedCards[0].value === sortedCards[1].value &&
      sortedCards[0].value === sortedCards[2].value) {
    return sortedCards[3].value === sortedCards[4].value
  } else if (sortedCards[2].value === sortedCards[3].value &&
              sortedCards[2].value === sortedCards[4].value) {
    return sortedCards[0].value === sortedCards[1].value
  }

  return false
}

const fourOfAKind = (cards) => {
  if (cards.length !== 5) return false

  const sortedCards = sortCards(cards)

  if (sortedCards[0].value === sortedCards[1].value &&
      sortedCards[0].value === sortedCards[2].value &&
      sortedCards[0].value === sortedCards[3].value) {
    return true
  } else if (sortedCards[1].value === sortedCards[2].value &&
              sortedCards[1].value === sortedCards[3].value &&
              sortedCards[1].value === sortedCards[4].value) {
    return true
  }

  return false
}

const straightFlush = (cards) => {
  return flush(cards) && straight(cards)
}

const royalFlush = (cards) => {
  if (!straightFlush(cards)) return false

  const sortedCards = sortCards(cards)

  return sortedCards[4].value === 13
}

const sortCards = (cards) => {
  const _cards = cards.slice()

  return _cards.sort((cardA, cardB) => {
    return cardA.value > cardB.value ? 1 : -1
  })
}

module.exports = {
  single,
  pair,
  threeOfAKind,
  // from here onwards the level order should be in descending order
  royalFlush,
  straightFlush,
  fourOfAKind,
  fullHouse,
  flush,
  straight
}
