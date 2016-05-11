import chai from 'chai';
import {Deck, Card, SUITS, VALUES} from '../lib/Deck';
const assert = chai.assert;

describe('Deck(factory)', () => {
  let deck;
  beforeEach(() => {
    deck = new Deck(8, index => {
      const value = VALUES[index * 2 % VALUES.length];
      const suit = SUITS[index % SUITS.length];
      return new Card(value, suit);
    });
  });

  it('should produce a predictable deck', () => assert.equal(deck.toString(), 'A of club,3 of spade,' +
    '5 of diamond,7 of heart,9 of club,J of spade,K of diamond,2 of heart'));

  it('sho0uld assign the deck to each card', () => {
    for (let card of deck.cards) {
      assert.equal(deck, card.deck);
    }
  });
});

describe('Deck', () => {
  let deck;
  beforeEach(() => {
    deck = new Deck(1);
  });

  describe('constructor', () => {
    it('should have 52 cards', () => assert.equal(deck.cardCount, 52, 'deck has 52 cards'));
    it('should have 52 cardsLeft', () => assert.equal(deck.cardsLeft, 52, 'deck has 52 cardsLeft'));
    it('sho0uld assign the deck to each card', () => {
      for (let card of deck.cards) {
        assert.equal(deck, card.deck);
      }
    });
  });

  describe('draw', function () {
    let first;
    let hand;

    describe('draw one (default)', () => {
      beforeEach(function () {
        first = deck.cards[0];
        hand = deck.draw();
      });

      it('should be at card 1', () => assert.equal(deck.current, 1, 'at card 1'));

      it('should still have 52 cards', () => assert.equal(deck.cardCount, 52, 'deck has 52 cards'));

      it('should have 1 fewer card', () => assert.equal(deck.cardsLeft, 51));

      it('should have a hand of the first card', () => assert.equal(first.toString(), hand.toString()));
    });

    describe('draw many', () => {
      const DRAWN = 4;
      let drawnCards;
      beforeEach(function () {
        drawnCards = deck.cards.slice(0, DRAWN);
        hand = deck.draw(DRAWN);
      });

      it('should be at card ' + DRAWN, () => assert.equal(deck.current, DRAWN, 'at card ' + DRAWN));

      it(`should still have 52 cards`, () => assert.equal(deck.cardCount, 52, 'deck has 52 cards'));

      it(`should have ${DRAWN} fewer card`, () => assert.equal(deck.cardsLeft, 52 - DRAWN));

      it('should have a hand of the cards', () => {
        for (var i = 0; i < DRAWN; ++i) {
          assert.equal(drawnCards.map(card => card.toString()).join(','), hand.toString());
        }
      });
    });
  });
});
