class Card {
  constructor(card) {
    const segments = card.split('-')

    this.category = segments[0]
    this.value = parseInt(segments[1])
  }

  getCategory () {
    return this.category
  }

  getValue () {
    return this.value
  }
}

module.exports = Card