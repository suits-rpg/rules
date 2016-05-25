import Card from './Card';

/**
 * this class represents a hand that is pseudorandom;
 * it returns the same card in a period. 
 */
export default class HandFactory {
    /**
     * @param fn {function}
     * @param repeat {int} (optional)
     */
    constructor(fn, repeat) {
        this._cardAt = fn;
        this._repeat = repeat || 0;
        this._index = 0;
    }

    get index() {
        return this._index;
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
            count = 1
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
        if (!card instanceof Card) {
            card = new Card(card.value, card.suit);
        }
        this._nextIndex();
        return card;
    }
}
