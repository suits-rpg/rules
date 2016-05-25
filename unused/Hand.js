import Comb from 'js-combinatorics';
import CardFixedRank from './../lib/deck/CardFixedRank';

const _sr = {
    club: 0,
    spade: 1,
    diamond: 2,
    heart: 3
};

const suitRank = suit => {
    return suit ? _sr[suit.toLowerCase()] : 0;
};

export default Card => class Hand {
    constructor(deck, cards) {
        this.deck = deck;
        this._cards = [];
        if (cards) {
            for (let card of cards) {
                this.addCard(card);
            }
        }
    }

    get cards() {
        return this._cards;
    }

    get deck() {
        return this._deck;
    }

    set deck(val) {
        this._deck = val;
    }

    addCard(card) {
        if (!(card instanceof Card)) {
            throw new Error('non card added to hand');
        }
        card.hand = this;
        this.cards.push(card);
    }

    toString() {
        return this.cards.map(card => card.toString()).join(',');
    }

    removeAll() {
        this.cards.forEach(card => {
            card.hand = null;
        });
        this._cards = [];
    }

    /**
     *
     * @returns {Card}
     */
    get firstCard() {
        return this.cards[0];
    }

    bestForSkill(rank) {
        if (this.cards.length < 1) {
            throw new Error('attempt to get bestForSkill from empty hand');
        }
        const bestPair = this.bestPair(rank);
        return new BestCards(bestPair, this);
    }

    cardOptions(limit) {
        return this.cards.map(card => {
            const out = [new CardFixedRank(null)];
            const lowCard = new CardFixedRank(card, card.rank(1), limit);
            const highCard = new CardFixedRank(card, card.rank(limit), limit);
            if (lowCard.valid) {
                out.push(lowCard);
            }
            if (highCard.valid && highCard.toString() !== lowCard.toString()) {
                out.push(highCard);
            }
            return out;
        });
    }

    /**
     * this returns all possible combinations of all of the cards in this hand.
     *
     * @param limit {Number} the skill of the draw-er. Any card above this limit is invalid.
     * @returns {Array}
     */
    combos(limit) {
        return Comb.cartesianProduct.apply(Comb, this.cardOptions(limit)).toArray();
    }

    bestPair(rank) {
        let combo = this.combos(rank).reduce((bestCardSet, cardSet) => {
            const totalRank = cardSet.reduce(
                (total, cardPlay) => total + (cardPlay.valid ? cardPlay.rank : 0), 0);

            /**
             * if new cardSet has a higher rank than the memo
             * AND less than or equal to the target rank; otherwise
             * return memo.
             */
            return totalRank > bestCardSet.rank && totalRank <= rank ? {
                cards: cardSet,
                rank: totalRank
            } : bestCardSet;
        }, {cards: [], rank: 0, highSuit: '', highSuitRank: 0});

        const bestSuit = combo.cards.reduce((best, card) => {
            if (!best || suitRank(card.suit) > suitRank(best)) {
                best = card.suit;
            }
                return best;
        }, '');

        combo.bestSuit = bestSuit;
        combo.suitRank = suitRank(bestSuit);
        return combo;
    }
};
