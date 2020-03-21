const single = (hand) => {
  return hand.length === 1
}

const pair = (hand) => {
  return hand.length === 2 &&
          hand[0].value === hand[1].value
}

const threeOfAKind = (hand) => {
  return hand.length === 3 &&
          hand[0].value === hand[1].value &&
          hand[0].value === hand[2].value
}

const straight = (hand) => {
  if (hand.length !== 5) return false

  const sortedHand = sortHand(hand)

  for (let i = 0; i < 4; i += 1) {
    if (sortedHand[i].value !== sortedHand[i + 1].value - 1) return false
  }

  return true
}

const flush = (hand) => {
  if (hand.length !== 5) return false

  return hand[0].category === hand[1].category &&
          hand[0].category === hand[2].category &&
          hand[0].category === hand[3].category &&
          hand[0].category === hand[4].category
}

const fullHouse = (hand) => {
  if (hand.length !== 5) return false

  const sortedHand = sortHand(hand)

  if (sortedHand[0].value === sortedHand[1].value &&
      sortedHand[0].value === sortedHand[2].value) {
    return sortedHand[3].value === sortedHand[4].value
  } else if (sortedHand[2].value === sortedHand[3].value &&
              sortedHand[2].value === sortedHand[4].value) {
    return sortedHand[0].value === sortedHand[1].value
  }

  return false
}

const fourOfAKind = (hand) => {
  if (hand.length !== 5) return false

  const sortedHand = sortHand(hand)

  if (sortedHand[0].value === sortedHand[1].value &&
      sortedHand[0].value === sortedHand[2].value &&
      sortedHand[0].value === sortedHand[3].value) {
    return true
  } else if (sortedHand[1].value === sortedHand[2].value &&
              sortedHand[1].value === sortedHand[3].value &&
              sortedHand[1].value === sortedHand[4].value) {
    return true
  }

  return false
}

const straightFlush = (hand) => {
  return flush(hand) && straight(hand)
}

const royalFlush = (hand) => {
  if (!straightFlush(hand)) return false

  const sortedHand = sortHand(hand)

  return sortedHand[4].value === 13
}

const sortHand = (hand) => {
  const _hand = hand.slice()

  return _hand.sort((cardA, cardB) => {
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
