export default class BestCards {

    /**
     *
     * @param bestPair {Object}
     * @param drawn {[Cards]}
     */
    constructor(bestPair, drawn) {
        this.cardsUsed = bestPair.cards;
        this.rank = bestPair.rank;
        this.over = bestPair.rank < 1;
        this.cardsDrawn = drawn;
    }

    set cardsUsed(val) {
        this._cardsUsed = val;
    }

    get cardsUsed() {
        return this._cardsUsed;
    }

    set rank(val) {
        this._rank = val;
    }

    get rank() {
        return this._rank;
    }

    set over(val) {
        this._over = val ? true : false;
    }

    get over() {
        return this._over;
    }

    set cardsDrawn(val) {
        this._cardsDrawn = val;
    }

    get cardsDrawn() {
        return this._cardsDrawn;
    }

    toJSON() {
        return {
            rank: this.rank,
            cardsDrawn: this.cardsDrawn.map(card => card.toString()),
            cardsUsed: this.cardsUsed.map(card => card.toString()),
            over: this.over
        };
    }
}
