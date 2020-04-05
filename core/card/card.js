class Card {
  constructor(card) {
    let {
      category,
      value
    } = card

    if (typeof card === 'string') {
      const segments = card.split('-')

      category = segments[0]
      value = parseInt(segments[1])
    }

    this.category = category
    this.value = value
  }

  getCategory () {
    return this.category
  }

  getValue () {
    return this.value
  }

  hasValueOfCard (card) {
    return this.value === card.getValue()
  }

  hasCategoryOfCard (card) {
    return this.category === card.getCategory()
  }
}

module.exports = Card