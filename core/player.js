class Player {
  constructor(id, name) {
    this.id = id
    this.name = name

    this.score = 0
    this.cards = []
  }

  getId () {
    return this.id
  }

  getName () {
    return this.name
  }

  getScore () {
    return this.score
  }

  getCards () {
    return this.cards
  }

  getCardAtIndex (i) {
    return this.cards[i]
  }

  getCardByCategoryAndValue (category, value) {
    return this.cards.find(card => card.getCategory() === category && card.getValue() === value)
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

  resetCards () {
    this.cards = []
  }
}

module.exports = Player