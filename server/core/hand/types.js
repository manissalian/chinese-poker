const single = (cards) => {
  return cards.length === 1
}

const pair = (cards) => {
  return cards.length === 2 &&
          cards[0].getValue() === cards[1].getValue()
}

const threeOfAKind = (cards) => {
  return cards.length === 3 &&
          cards[0].getValue() === cards[1].getValue() &&
          cards[0].getValue() === cards[2].getValue()
}

const straight = (cards) => {
  if (cards.length !== 5) return false

  const sortedCards = sortCards(cards)

  for (let i = 0; i < 4; i += 1) {
    if (sortedCards[i].getValue() !== sortedCards[i + 1].getValue() - 1) return false
  }

  return true
}

const flush = (cards) => {
  if (cards.length !== 5) return false

  return cards[0].getCategory() === cards[1].getCategory() &&
          cards[0].getCategory() === cards[2].getCategory() &&
          cards[0].getCategory() === cards[3].getCategory() &&
          cards[0].getCategory() === cards[4].getCategory()
}

const fullHouse = (cards) => {
  if (cards.length !== 5) return false

  const sortedCards = sortCards(cards)

  if (sortedCards[0].getValue() === sortedCards[1].getValue() &&
      sortedCards[0].getValue() === sortedCards[2].getValue()) {
    return sortedCards[3].getValue() === sortedCards[4].getValue()
  } else if (sortedCards[2].getValue() === sortedCards[3].getValue() &&
              sortedCards[2].getValue() === sortedCards[4].getValue()) {
    return sortedCards[0].getValue() === sortedCards[1].getValue()
  }

  return false
}

const fourOfAKind = (cards) => {
  if (cards.length !== 5) return false

  const sortedCards = sortCards(cards)

  if (sortedCards[0].getValue() === sortedCards[1].getValue() &&
      sortedCards[0].getValue() === sortedCards[2].getValue() &&
      sortedCards[0].getValue() === sortedCards[3].getValue()) {
    return true
  } else if (sortedCards[1].getValue() === sortedCards[2].getValue() &&
              sortedCards[1].getValue() === sortedCards[3].getValue() &&
              sortedCards[1].getValue() === sortedCards[4].getValue()) {
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

  return sortedCards[4].getValue() === 13
}

const sortCards = (cards) => {
  const _cards = cards.slice()

  return _cards.sort((cardA, cardB) => {
    return cardA.getValue() > cardB.getValue() ? 1 : -1
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
