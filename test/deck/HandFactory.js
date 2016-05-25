import chai from 'chai';
import HandFactory from '../../lib/deck/HandFactory';
const SUITS = require('../../lib/deck/suits.json');
const VALUES = require('../../lib/deck/values.json');
import Card from '../../lib/deck/Card';

const assert = chai.assert;

describe('HandFactory', () => {
    let hand;

    beforeEach(() => {
        hand = new HandFactory(index => {
            const value = VALUES[index * 2 % VALUES.length];
            const suit = SUITS[index % SUITS.length];
            return new Card(value, suit);
        });
    });

    it('.card', () => {
        let card = hand.card();

        assert.equal(card.value, 'A');
        assert.equal(card.suit, SUITS[0]);
    });

    describe('.cards', () => {
        let cards;
        beforeEach(() => {
             cards = hand.cards(3);
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
    });
});
