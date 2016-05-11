import _ from 'lodash';

class Card {
    constructor(value, suit, deck) {
        this._value = value;
        this._suit = suit;
        this.deck = deck;
    }

    get value() {
        return this._value;
    }

    get suit() {
        return this._suit;
    }

    get deck() {
        return this._deck;
    }

    set deck(d) {
        this._deck = d;
    }
    
    toString() {
        return `${this.value} of ${this.suit}`;
    }
}

const VALUES = [
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

/**
 * the deck creates an array of cards and a current pointer.
 * All cards before the pointer are considered discarded.
 */
export class Deck {
    constructor(deckCount) {
        console.log('making deck ', deckCount);
        this.cards = [];
        this.current = 0;
        if (deckCount) {
            for (var deck = 0; deck < deckCount; ++deck) {
                for (let suit of SUITS) {
                    for (let value of VALUES) {
                        this.cards.push(new Card(value, suit, this));
                    }
                }
            }
        }
        this.shuffle();
    }

    shuffle() {
        this.cards = _.shuffle(this.cards);
        this.current = 0;
    }

    get empty() {
        return this.cards.length <= this.current;
    }

    drawOne() {
        if (this.empty) {
            return null;
        }
        var card = this.cards[this.current];
        ++this.current;
        return card;
    }

    drawMany(count) {
        if (this.empty) {
            return [];
        }
        var out = this.cards.slice(this.current, this.current + count);
        this.current += count;
        return out;
    }

    get cardCount() {
        return this.cards.length;
    }

    get cardsLeft() {
        return Math.max(0, this.cardCount - this.current);
    }
}
