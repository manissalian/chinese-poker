class Card {
  constructor(card) {
    const segments = card.split('-')

    this.category = segments[0]
    this.value = parseInt(segments[1])
  }
}

module.exports = Card