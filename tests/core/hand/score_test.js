const assert = require('assert')
const Card = require('../../../core/card/card')
const Hand = require('../../../core/hand/hand')
const {
  straight
} = require('../../../core/hand/types')

describe('Given two hands', () => {
  const makeCards = cards => {
    return cards.map(card => new Card(card))
  }

  describe('Where both hands are single with same values', () => {
    it('then the type with superior category must have greater score', () => {
      const firstCards = makeCards(['C-4'])
      const secondCards = makeCards(['H-4'])
      const firstHand = new Hand(firstCards)
      const secondHand = new Hand(secondCards)
      assert.equal(firstHand.getScore() < secondHand.getScore(), true)
    })
  })

  describe('Where both hands are pair with same values', () => {
    it('then the type with superior category must have greater score', () => {
      const firstCards = makeCards(['H-4', 'D-4'])
      const secondCards = makeCards(['S-4', 'C-4'])
      const firstHand = new Hand(firstCards)
      const secondHand = new Hand(secondCards)
      assert.equal(firstHand.getScore() < secondHand.getScore(), true)
    })
  })

  describe('Where both hands are straights with same values', () => {
    it('then the type with superior category must have greater score', () => {
      const firstCards = makeCards(['D-4', 'S-5', 'C-6', 'H-7', 'D-8'])
      const secondCards = makeCards(['S-4', 'H-5', 'D-6', 'C-7', 'S-8'])
      const firstHand = new Hand(firstCards)
      const secondHand = new Hand(secondCards)
      assert.equal(firstHand.getScore() < secondHand.getScore(), true)
    })
  })
})
