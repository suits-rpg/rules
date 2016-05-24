/* eslint no-use-before-define:0 */

var cardId = 0;

export default class Card {
    constructor(value, suit, deck) {
        this._value = value;
        this._suit = suit;
        this.deck = deck;
        this.id = ++cardId;
    }

    rank(limit) {
        var rank = this.value;
        switch (this.value) {
            case 'A':
                rank = 11;
                break;

            case 'J':
                rank = 12;
                break;

            case 'Q':
                rank = 13;
                break;

            case 'K':
                rank = 14;
                break;

            default:
                rank = this.value;
        }

        if (rank > 10 && limit && rank > limit) {
            rank -= 10;
        }
        return rank;
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

    get drawn() {
        return this.hand ? true : false; // eslint-disable-line no-unneeded-ternary
    }

    get hand() {
        return this._hand;
    }

    set hand(val) {
        if (val) {
            this._hand = val;
        } else {
            this._hand = null;
        }
    }
}
