import Comb from 'js-combinatorics';
import CardFixedRank from './CardFixedRank';
import BestCards from './BestCards';
import suitRank from './suitRank';

const _bestSuit = cards => {
    return cards.reduce((best, card) => {
        if (!best || suitRank(card.suit) > suitRank(best)) {
            best = card.suit;
        }
        return best;
    }, '');
};

const _cardOptions = (cards, limit) => {
    return cards.map(card => {
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
};

const _combos = (cards, limit) => Comb.cartesianProduct.apply(Comb,
    _cardOptions(cards, limit)).toArray();

const _bestPair = (cards, rank) => {
    let combo = _combos(rank).reduce((bestCardSet, cardSet) => {
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

    combo.bestSuit = _bestSuit(combo.cards);
    combo.suitRank = suitRank(combo.bestSuit);
    return combo;
};

/**
 *
 * @param cards {[Card]} an array of cards drawn
 * @param rank {int} the highest acceptable value for a card
 * @returns {BestCards}
 */
const bestForSkill = (cards, rank) => {
    if (cards.length < 1) {
        throw new Error('attempt to get bestForSkill from empty hand');
    }
    const bestPair = _bestPair(cards, rank);
    return new BestCards(bestPair, cards);
};

export default bestForSkill;
