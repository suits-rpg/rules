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

        // the suit that determines the high suit rank is the suit of the highest card (faces high)
        // or in a tie, the last drawn card
        this._highSuitRank = bestPair.cards.reduce(
            (best, card) => (card.valid && (card.card.rank() >= best.rank())) ? card.card : best, {
                suitRank: 0,
                rank: () => -1
            }).suitRank;
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
