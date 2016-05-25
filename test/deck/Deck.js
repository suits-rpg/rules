import chai from 'chai';
import Deck from '../../lib/deck/Deck';
const SUITS = require('../../lib/deck/suits.json');
const VALUES = require('../../lib/deck/values.json');
import Card from '../../lib/deck/Card';
import _ from 'lodash';
const assert = chai.assert;

describe('Deck', () => {
    let deck;

    beforeEach(() => {
        deck = new Deck(index => {
            const value = VALUES[index * 2 % VALUES.length];
            const suit = SUITS[index % SUITS.length];
            return new Card(value, suit);
        });
    });

    it('.card', () => {
        let card = deck.card();

        assert.equal(card.value, 'A');
        assert.equal(card.suit, SUITS[0]);
    });

    describe('.cards', () => {
        let cards;
        beforeEach(() => {
            cards = deck.cards(3);
        });

        it('should provide the requested count of cards', () => {
            assert.equal(cards.length, 3);
        });

        it('should provide the predicted cards', () => {
            let card = cards[0];
            assert.equal(card.value, 'A');
            assert.equal(card.suit, SUITS[0]);

            card = cards[2];
            assert.equal(card.value, 5);
            assert.equal(card.suit, SUITS[2]);
        });

        it('should always return cards in the expected range', () => {
            var count = 100;
            while (count-- > 0) {
                let card = deck.card();
                assert.ok(_.includes(SUITS, card.suit));
                assert.ok(_.includes(VALUES, card.value));
            }
        });
    });

    describe('random deck', () => {
        beforeEach(() => {
            deck = new Deck();
        });

        it('should always return cards in the expected range', () => {
            var count = 100;
            while (count-- > 0) {
                let card = deck.card();
                assert.ok(_.includes(SUITS, card.suit));
                assert.ok(_.includes(VALUES, card.value));
            }
        });
    });
});
