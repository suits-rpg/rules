import Card from './Card';

const SUITS = require('./suits.json');
const VALUES = require('./values.json');

const randomDeck = () => {
    return {
        value: VALUES[Math.floor(Math.random() * VALUES.length)],
        suit: SUITS[Math.floor(Math.random() * SUITS.length)]
    };
};

/**
 * this class represents a deck that returns a card or cards
 * whose value and suit is based on a function.
 *
 * It can be random (if no deterministic function is passed),
 * or deterministic (always returns the cards from the same "virtual deck").
 */

export default class Deck {
    /**
     * @param fn {function}
     * @param {int} [repeat]
     */
    constructor(fn, repeat) {
        this._cardAt = fn || randomDeck;
        this._repeat = repeat || 0;
        this._index = 0;
    }

    get index() {
        return this._index;
    }

    /**
     * 
     * @returns {int}
     */
    cardCount() {
        return this._repeat || 0;
    }

    cardsLeft() {
        return this.cardCount ? this.cardCount - this.index: Number.MAX_VALUE;
    }

    _nextIndex() {
        if (this._repeat && this.index >= this._repeat) {
            this._index = 0;
        } else {
            ++this._index;
        }
    }

    cards(count) {
        if (count < 1) {
            count = 1;
        }

        const out = [];
        while (count > 0) {
            out.push(this.card());
            --count;
        }
        return out;
    }

    card() {
        let card = this._cardAt(this.index);
        if (!(card instanceof Card)) {
            card = new Card(card.value, card.suit);
        }
        this._nextIndex();
        return card;
    }
}
