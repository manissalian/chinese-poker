const assert = require('assert')
const Card = require('../../../core/card/card')
const {
  single,
  pair,
  threeOfAKind,
  straight,
  flush,
  fullHouse,
  fourOfAKind,
  straightFlush,
  royalFlush
} = require('../../../core/hand/types')

describe('Given an array of cards', () => {
  const makeCards = cards => {
    return cards.map(card => new Card(card))
  }

  describe('Where array has one card', () => {
    it('then the type is single', () => {
      const cards = makeCards(['D-1'])
      assert.equal(single(cards), true)
    })
  })

  describe('Where array has two cards of the same value', () => {
    it('then the type is pair', () => {
      const cards = makeCards(['D-1', 'C-1'])
      assert.equal(pair(cards), true)
    })
  })

  describe('Where array has three cards of the same value', () => {
    it('then the type is threeOfAKind', () => {
      const cards = makeCards(['D-1', 'C-1', 'H-1'])
      assert.equal(threeOfAKind(cards), true)
    })
  })

  describe('Where array has fives cards of consecutive order', () => {
    it('then the type is straight', () => {
      const cards = makeCards(['D-1', 'D-2', 'D-3', 'D-4', 'C-5'])
      assert.equal(straight(cards), true)
    })
  })

  describe('Where array has fives cards of the same category', () => {
    it('then the type is flush', () => {
      const cards = makeCards(['D-1', 'D-2', 'D-3', 'D-4', 'D-6'])
      assert.equal(flush(cards), true)
    })
  })

  describe('Where array has fives cards, 3 of them forming a threeOfAKind, and the other 2 forming a pair', () => {
    it('then the type is fullHouse', () => {
      const cards = makeCards(['D-1', 'C-1', 'H-1', 'D-2', 'C-2'])
      assert.equal(fullHouse(cards), true)
    })
  })

  describe('Where array has four cards of the same value', () => {
    it('then the type is fourOfAKind', () => {
      const cards = makeCards(['D-1', 'C-1', 'H-1', 'S-1', 'D-2'])
      assert.equal(fourOfAKind(cards), true)
    })
  })

  describe('Where array has five cards of consecutive order and the same category', () => {
    it('then the type is straightFlush', () => {
      const cards = makeCards(['D-1', 'D-2', 'D-3', 'D-4', 'D-5'])
      assert.equal(straightFlush(cards), true)
    })
  })

  describe('Where array has five cards of consecutive order and the same category, and contains a card of value 13', () => {
    it('then the type is royalFlush', () => {
      const cards = makeCards(['D-9', 'D-10', 'D-11', 'D-12', 'D-13'])
      assert.equal(royalFlush(cards), true)
    })
  })
})
