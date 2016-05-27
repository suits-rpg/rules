import suitRank from './suitRank';

export default class BestCards {

    /**
     *
     * @param bestPair {Object}
     * @param drawn {[Cards]}
     */
    constructor(bestPair, drawn) {
        this.cardsUsed = bestPair.cards;
        this._rank = bestPair.rank;
        this._over = bestPair.rank < 1;
        this._cardsDrawn = drawn;
        this._highSuitRank = bestPair.cards.reduce((best, card) => {
            return card.valid ? Math.max(best, suitRank(card.suit)) : best;
        }, 0);
    }

    get highSuitRank() {
        return this._highSuitRank;
    }

    set cardsUsed(val) {
        this._cardsUsed = val;
    }

    get cardsUsed() {
        return this._cardsUsed;
    }

    get rank() {
        return this._rank;
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
            highSuitRank: this.highSuitRank,
            over: this.over
        };
    }
}
