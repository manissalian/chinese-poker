const types = require('./types')

class Hand {
  constructor(cards) {
    this.cards = cards
    this.count = cards.length
    this.type = this.determineType()
    console.log(this.cards, this.type)
    // this.power = this.determinePower()
  }

  determineType () {
    const handTypes = Object.keys(types)

    for (let i in handTypes) {
      const type = handTypes[i]

      if (types[type](this.cards)) {
        return type
      }
    }
  }
}

module.exports = Hand