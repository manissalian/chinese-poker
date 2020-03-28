class Player {
  constructor(id) {
    this.id = id

    this.score = 0
    this.cards = []
  }

  getId () {
    return this.id
  }

  getCards () {
    return this.cards
  }

  getCardAtIndex (i) {
    return this.cards[i]
  }

  getCardByCategoryAndValue (category, value) {
    return this.cards.find(card => card.category === category && card.value === value)
  }

  setScore (score) {
    this.score = score
  }

  addCard (card) {
    this.cards.push(card)
  }

  removeCard (card) {
    const cardIndex = this.cards.indexOf(card)
    this.cards.splice(cardIndex, 1)
  }
}

module.exports = Player