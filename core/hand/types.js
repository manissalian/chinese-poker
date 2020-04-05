const single = (cards) => {
  return cards.length === 1
}

const pair = (cards) => {
  return cards.length === 2 &&
          cards[0].hasValueOfCard(cards[1])
}

const threeOfAKind = (cards) => {
  return cards.length === 3 &&
          cards[0].hasValueOfCard(cards[1]) &&
          cards[0].hasValueOfCard(cards[2])
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

  return cards[0].hasCategoryOfCard(cards[1]) &&
          cards[0].hasCategoryOfCard(cards[2]) &&
          cards[0].hasCategoryOfCard(cards[3]) &&
          cards[0].hasCategoryOfCard(cards[4])
}

const fullHouse = (cards) => {
  if (cards.length !== 5) return false

  const sortedCards = sortCards(cards)

  if (threeOfAKind([sortedCards[0], sortedCards[1], sortedCards[2]])) {
    return pair([sortedCards[3], sortedCards[4]])
  } else if (threeOfAKind([sortedCards[2], sortedCards[3], sortedCards[4]])) {
    return pair([sortedCards[0], sortedCards[1]])
  }

  return false
}

const fourOfAKind = (cards) => {
  if (cards.length !== 5) return false

  const sortedCards = sortCards(cards)

  if (threeOfAKind([sortedCards[0], sortedCards[1], sortedCards[2]]) &&
      pair([sortedCards[0], sortedCards[3]])) {
    return true
  } else if (threeOfAKind([sortedCards[1], sortedCards[2], sortedCards[3]]) &&
      pair([sortedCards[1], sortedCards[4]])) {
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
