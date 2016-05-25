var cardId = 0;
export default class Card {
    constructor(value, suit) {
        this._value = value || null;
        this._suit = suit || '';
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

    /**
     *
     * @returns {string}
     */
    get suit() {
        return this._suit;
    }

    toString() {
        return `${this.value} of ${this.suit}`;
    }
}
