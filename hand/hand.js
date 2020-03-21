const types = require('./types')
const score = require('./score')

class Hand {
  constructor(cards) {
    this.cards = cards
    this.count = cards.length
    this.type = this.determineType()
    this.score = this.determineScore()
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

  determineScore () {
    const typeScore = score.typeScore(this.type) * 1000
    const valueScore = score.valueScore(this) * (this.isTypeFlush ? 1 : 10)
    const categoryScore = score.categoryScore(this) * (this.isTypeFlush ? 100 : 1)

    return typeScore + valueScore + categoryScore
  }

  isTypeFlush () {
    return hand.type === 'flush' ||
            hand.type === 'straightFlush' ||
            hand.type === 'royalFlush'
  }
}

module.exports = Hand