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
      return cardA.getValue() > cardB.getValue() ? 1 : -1
    })

    if (hand.type === 'fullHouse') {
      if (sortedCards[0].getValue() === sortedCards[1].getValue() &&
          sortedCards[0].getValue() === sortedCards[2].getValue()) {
        return sortedCards[0].getValue()
      } else if (sortedCards[2].getValue() === sortedCards[3].getValue() &&
                  sortedCards[2].getValue() === sortedCards[4].getValue()) {
        return sortedCards[2].getValue()
      }
    }

    if (hand.type === 'fourOfAKind') {
      if (sortedCards[0].getValue() === sortedCards[1].getValue() &&
          sortedCards[0].getValue() === sortedCards[2].getValue() &&
          sortedCards[0].getValue() === sortedCards[3].getValue()) {
        return sortedCards[0].getValue()
      } else if (sortedCards[1].getValue() === sortedCards[2].getValue() &&
                  sortedCards[1].getValue() === sortedCards[3].getValue() &&
                  sortedCards[1].getValue() === sortedCards[4].getValue()) {
        return sortedCards[1].getValue()
      }
    }

    return sortedCards[_cards.length - 1].getValue()
  },
  categoryScore: (hand) => {
    const _cards = hand.cards.slice()

    const sortedCards = _cards.sort((cardA, cardB) => {
      return cardA.getValue() > cardB.getValue() ? 1 : -1
    })

    if (hand.type === 'fullHouse') {
      if (sortedCards[0].getValue() === sortedCards[1].getValue() &&
          sortedCards[0].getValue() === sortedCards[2].getValue()) {
        sortedCards.splice(3, 2)
      } else if (sortedCards[2].getValue() === sortedCards[3].getValue() &&
                  sortedCards[2].getValue() === sortedCards[4].getValue()) {
        sortedCards.splice(0, 2)
      }
    }

    if (sortedCards.find(card => card.getCategory() === 'S')) return 4
    if (sortedCards.find(card => card.getCategory() === 'H')) return 3
    if (sortedCards.find(card => card.getCategory() === 'C')) return 2
    if (sortedCards.find(card => card.getCategory() === 'D')) return 1
  }
}
