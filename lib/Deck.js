import _ from 'lodash';

require('es6-collections');

export class Card {
  constructor (value, suit, deck) {
    this._value = value;
    this._suit = suit;
    this.deck = deck;
  }

  get value () {
    return this._value;
  }

  get suit () {
    return this._suit;
  }

  get deck () {
    return this._deck;
  }

  set deck (d) {
    this._deck = d;
  }

  set state (state) {
    this._state = state;
  }

  get state () {
    return this._state;
  }
}

export const VALUES = [
  'A',
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  'J',
  'Q',
  'K'
];

export const SUITS = ['club', 'spade', 'diamond', 'heart'];

export class Deck {
  constructor (deckCount) {
    this.cards = new Set();
    this.discarded = new Set();
    if (deckCount) {
      for (var deck = 0; deck < deckCount; ++deck) {
        for (let suit of SUITS) {
          for (let value of VALUES) {
            this.addCard(new Card(value, suit, this));
          }
        }
      }
    }
  }

  addCard (card, force) {
    if (!(card.deck === this)) {
      if (force) {
        card.deck = this;
      } else {
        throw new Error('attempt to force card into alien deck');
      }
    }
    this.cards.add(card);
    if (this.discarded.has(card)) {
      this.discarded.delete(card);
    }
  }

  discardCard (card, force) {
    if (!(card.deck === this)) {
      if (force) {
        card.deck = this;
      } else {
        throw new Error('attempt to force card into alien deck');
      }
    }

    this.cards.add(card);
    if (this.discarded.has(card)) {
      this.discarded.delete(card);
  }
}
