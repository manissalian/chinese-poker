class Player {
  constructor(id) {
    this.id = id

    this.score = 0
    this.cards = []
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

  getCards () {
    return this.cards
  }

  getCardAtIndex (i) {
    return this.cards[i]
  }
}

module.exports = Player