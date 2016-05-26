import _ from 'lodash';

const VALUES = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
const SUITS = ['club', 'spade', 'diamond', 'heart'];

import Card from './../lib/deck/Card';

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
        const c = this.current;
        ++this.current;
        return this.empty ? null : this.cards[c];
    }

    /**
     *
     * @param count {int}
     * @returns {Hand}
     */
    draw(count) {
        if (arguments.length < 1) {
            count = 1;
        }
        // @TODO: test for non-natural number?
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
        return new Hand(this, cards); /* eslint no-use-before-define:0 */
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
        const value = hand.firstCard.rank(limit);
        hand.removeAll();
        return value;
    }
}

import getHand from './../test/Hand';
const Hand = getHand(Card);

export {Hand, Deck, Card, SUITS, VALUES};
