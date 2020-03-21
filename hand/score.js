module.exports = {
  typeScore: (type) => {
    switch (type) {
      case 'single':
        return 1
        break
      case 'pair':
        return 2
        break
      case 'threeOfAKind':
        return 3
        break
      case 'straight':
        return 4
        break
      case 'flush':
        return 5
        break
      case 'fullHouse':
        return 6
        break
      case 'fourOfAKind':
        return 7
        break
      case 'straightFlush':
        return 8
        break
      case 'royalFlush':
        return 9
        break
    }
  },
  valueScore: (hand) => {
    const _cards = hand.cards.slice()

    const sortedCards = _cards.sort((cardA, cardB) => {
      return cardA.value > cardB.value ? 1 : -1
    })

    if (hand.type === 'fullHouse') {
      if (sortedCards[0].value === sortedCards[1].value &&
          sortedCards[0].value === sortedCards[2].value) {
        return sortedCards[0].value
      } else if (sortedCards[2].value === sortedCards[3].value &&
                  sortedCards[2].value === sortedCards[4].value) {
        return sortedCards[2].value
      }
    }

    if (hand.type === 'fourOfAKind') {
      if (sortedCards[0].value === sortedCards[1].value &&
          sortedCards[0].value === sortedCards[2].value &&
          sortedCards[0].value === sortedCards[3].value) {
        return sortedCards[0].value
      } else if (sortedCards[1].value === sortedCards[2].value &&
                  sortedCards[1].value === sortedCards[3].value &&
                  sortedCards[1].value === sortedCards[4].value) {
        return sortedCards[1].value
      }
    }

    return sortedCards[_cards.length - 1].value
  },
  categoryScore: (hand) => {
    const _cards = hand.cards.slice()

    const sortedCards = _cards.sort((cardA, cardB) => {
      return cardA.value > cardB.value ? 1 : -1
    })

    if (hand.type === 'fullHouse') {
      if (sortedCards[0].value === sortedCards[1].value &&
          sortedCards[0].value === sortedCards[2].value) {
        sortedCards.splice(3, 2)
      } else if (sortedCards[2].value === sortedCards[3].value &&
                  sortedCards[2].value === sortedCards[4].value) {
        sortedCards.splice(0, 2)
      }
    }

    if (sortedCards.find(card => card.category === 'S')) return 4
    if (sortedCards.find(card => card.category === 'H')) return 3
    if (sortedCards.find(card => card.category === 'C')) return 2
    if (sortedCards.find(card => card.category === 'D')) return 1
  }
}
