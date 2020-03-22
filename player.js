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

  getCards () {
    return this.cards
  }

  getCardAtIndex (i) {
    return this.cards[i]
  }
}

module.exports = Player