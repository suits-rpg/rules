import _ from 'lodash';

import Comb from 'js-combinatorics';

/* eslint no-use-before-define:0 */

var cardId = 0;

export class Card {
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
            if (!(val instanceof Hand)) {
                throw new Error("non Hand passed to hand");
            }
            this._hand = val;
        } else {
            this._hand = null;
        }
    }
}

export const VALUES = [
    'A',
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    'J',
    'Q',
    'K'
];

export const SUITS = ['club', 'spade', 'diamond', 'heart'];

function makeCards(deckCount, factory, deck) {
    return _.range(0, deckCount)
        .map(index => {
            const card = factory(index);
            card.deck = deck;
            return card;
        });
}

function makeDeck(deckCount, deck) {
    var cards = [];
    for (var i = 0; i < deckCount; ++i) {
        for (let suit of SUITS) {
            for (let value of VALUES) {
                cards.push(new Card(value, suit, deck));
            }
        }
    }
    return cards;
}

function forceCards(data) {
    return data.map(input => {
        let card;
        if (_.isArray(input)) {
            card = new Card(input[0], input[1], this);
        } else {
            card = input;
            input.deck = this;
        }
        return card;
    });
}
/**
 * the deck creates an array of cards and a current pointer.
 * All cards before the pointer are considered discarded.
 */
export class Deck {
    constructor(deckCount, factory) {
        this.current = 0;
        if (_.isArray(deckCount)) {
            this.cards = forceCards(deckCount);
        } else if (deckCount) {
            if (factory) {
                this.cards = makeCards(deckCount, factory, this);
            } else {
                this.cards = makeDeck(deckCount, this);
                this.shuffle();
            }
        }
    }

    shuffle() {
        this.cards = _.shuffle(this.cards);
        this.current = 0;
    }

    get empty() {
        return this.cards.length <= this.current;
    }

    _pop() {
        return this.empty ? null : this.cards[this.current++];
    }

    draw(count) {
        if (this.empty) {
            return new Hand(this);
        }
        if (!count) {
            count = 1;
        }
        if (isNaN(count)) {
            throw new Error('non numeric count passed to draw');
        }

        var cards = [];

        // we are assuming it is unlikely that ALL cards are in hands.
        // otherwise, infinite looping!
        while (cards.length < count) {
            if (this.empty) {
                this.shuffle();
            }
            let card = this._pop();
            if (!card.drawn) {
                cards.push(card);
            }
        }
        return new Hand(this, cards);
    }

    get cardCount() {
        return this.cards.length;
    }

    get cardsLeft() {
        return Math.max(0, this.cardCount - this.current);
    }

    toString() {
        return this.cards.map(card => card.toString()).join(',');
    }

    oneRank(limit) {
        const hand = this.draw(1);
        const value = hand.first.rank(limit);
        hand.removeAll();
        return value;
    }
}

export class Hand {
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
        if (!(val instanceof Deck)) {
            throw new Error("non Deck passed to deck");
        }
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
    get first() {
        return this.cards[0];
    }

    bestForSkill(rank) {
        let bestPair = this._bestPair(rank);
        return new Hand(this.deck, bestPair.cards);
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
        return this.combos(rank).reduce((bestCardSet, cardSet) => {
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
        }, {cards: [], rank: 0});
    }
}

/**
 * This is a card that has a fixed rank, scaled by the input rank.
 * note the limit _constrains_ the card value but does not equal it.
 */
class CardFixedRank {
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
}
