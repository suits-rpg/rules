/**
 * This is a card that has a fixed rank, scaled by the input rank.
 * note the limit _constrains_ the card value but does not equal it.
 *
 * goal exists to artificially "skew" the rank to the lowest or highest possible value.
 */
export default class CardFixedRank {
    constructor(card, goal, limit) {
        if (card) {
            this._card = card;
            this._rank = card.rank(goal);
        } else {
            this._rank = 0;
            this._card = null;
        }

        this._valid = this.card && (this.rank <= limit);
    }

    /**
     *
     * @returns {Card}
     */
    get card() {
        return this._card;
    }

    /**
     * @returns {Number}
     */
    get rank() {
        return this._rank;
    }

    get valid() {
        return this._valid;
    }

    toString() {
        return `<< ${this.card ? this.card.toString() : '[null]'} -- rank ${this.rank}${this.valid ? '' : " -- invalid"} >>`;
    }

    get suit() {
        return this.card ? this.card.suit : '';
    }
}
