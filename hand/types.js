module.exports = {
  single: (hand) => {
    return hand.length === 1
  },
  pair: (hand) => {
    return hand.length === 2 &&
            hand[0].value === hand[1].value
  },
  threeOfAKind: (hand) => {
    return hand.length === 3 &&
            hand[0].value === hand[1].value &&
            hand[0].value === hand[2].value
  },
  // from here onwards the level order should be in descending order
  flush: (hand) => {
    if (hand.length !== 5) return false

    return hand[0].category === hand[1].category &&
            hand[0].category === hand[2].category &&
            hand[0].category === hand[3].category &&
            hand[0].category === hand[4].category
  },
  straight: (hand) => {
    const _hand = hand.slice()

    if (_hand.length !== 5) return false

    _hand.sort((cardA, cardB) => {
      return cardA.value > cardB.value ? 1 : -1
    })

    for (let i = 0; i < 4; i += 1) {
      if (_hand[i].value !== _hand[i + 1].value - 1) return false
    }

    return true
  }
}
