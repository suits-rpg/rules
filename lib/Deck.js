import _ from 'lodash';

/* eslint no-use-before-define:0 */

var cardId = 0;
export class Card {
  constructor (value, suit, deck) {
    this._value = value;
    this._suit = suit;
    this.deck = deck;
    this.id = ++cardId;
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

  toString () {
    return `${this.value} of ${this.suit}`;
  }

  get drawn () {
    return this.hand ? true : false; // eslint-disable-line no-unneeded-ternary
  }

  get hand () {
    return this._hand;
  }

  set hand (val) {
    if (val) {
      if (!(val instanceof Hand)) {
        throw new Error("non Hand passed to hand");
      }
      this._hand = val;
    } else {
      this._hand = null;
    }
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

function makeCards (deckCount, factory, deck) {
  console.log('makeCards with ', Array.prototype.slice.call(arguments, 0));
  return _.range(0, deckCount)
    .map(index => {
      const card = factory(index);
      console.log('made card: ', card, index);
      card.deck = deck;
      return card;
    });
}

function makeDeck (deckCount, deck) {
  var cards = [];
  for (var i = 0; i < deckCount; ++i) {
    for (let suit of SUITS) {
      for (let value of VALUES) {
        cards.push(new Card(value, suit, deck));
      }
    }
  }
  return cards;
}

function forceCards (data) {
  return data.map(input => {
    let card;
    if (_.isArray(input)) {
      card = new Card(input[0], input[1], this);
    } else {
      card = input;
      input.deck = this;
    }
    return card;
  });
}
/**
 * the deck creates an array of cards and a current pointer.
 * All cards before the pointer are considered discarded.
 */
export class Deck {
  constructor (deckCount, factory) {
    this.current = 0;
    if (_.isArray(deckCount)) {
      this.cards = forceCards(deckCount);
    } else if (deckCount) {
      if (factory) {
        this.cards = makeCards(deckCount, factory, this);
      } else {
        this.cards = makeDeck(deckCount, this);
        this.shuffle();
      }
    }
  }

  shuffle () {
    this.cards = _.shuffle(this.cards);
    this.current = 0;
  }

  get empty () {
    return this.cards.length <= this.current;
  }

  _pop () {
    return this.empty ? null : this.cards[this.current++];
  }

  draw (count) {
    if (this.empty) {
      return new Hand(this);
    }
    if (!count) {
      count = 1;
    }
    if (isNaN(count)) {
      throw new Error('non numeric count passed to draw');
    }

    var cards = [];

    // we are assuming it is unlikely that ALL cards are in hands.
    // otherwise, infinite looping!
    while (cards.length < count) {
      if (this.empty) {
        this.shuffle();
      }
      let card = this._pop();
      if (!card.drawn) {
        cards.push(card);
      }
    }
    return new Hand(this, cards);
  }

  get cardCount () {
    return this.cards.length;
  }

  get cardsLeft () {
    return Math.max(0, this.cardCount - this.current);
  }

  toString () {
    return this.cards.map(card => card.toString()).join(',');
  }
}

export class Hand {
  constructor (deck, cards) {
    this.deck = deck;
    this.cards = [];
    if (cards) {
      for (let card of cards) {
        this.addCard(card);
      }
    }
  }

  get deck () {
    return this._deck;
  }

  set deck (val) {
    if (!(val instanceof Deck)) {
      throw new Error("non Deck passed to deck");
    }
    this._deck = val;
  }

  addCard (card) {
    if (!(card instanceof Card)) {
      throw new Error('non card added to hand');
    }
    card.hand = this;
    this.cards.push(card);
  }

  toString () {
    return this.cards.map(card => card.toString()).join(',');
  }
}
