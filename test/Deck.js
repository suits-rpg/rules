import chai from 'chai';
import {Deck, Card, SUITS, VALUES} from '../lib/Deck';
const assert = chai.assert;
import _ from 'lodash';

describe('Deck(factory)', () => {
    let deck;
    beforeEach(() => {
        deck = new Deck(8, index => {
            const value = VALUES[index * 2 % VALUES.length];
            const suit = SUITS[index % SUITS.length];
            return new Card(value, suit);
        });
    });

    it('should produce a predictable deck', () => assert.equal(deck.toString(), 'A of club,3 of spade,' +
        '5 of diamond,7 of heart,9 of club,J of spade,K of diamond,2 of heart'));

    it('sho0uld assign the deck to each card', () => {
        for (let card of deck.cards) {
            assert.equal(deck, card.deck);
        }
    });
});

describe.only('Hand', () => {
    let deck;
    let hand;

    beforeEach(() => {
        deck = new Deck(100, index => {
            const value = VALUES[index * 2 % VALUES.length];
            const suit = SUITS[index % SUITS.length];
            return new Card(value, suit);
        });

        hand = deck.draw(2);
    });

    describe('.cardOptions', () => {
        it('should have a range of the cards for (8)', () => {
            const cardOptions = hand.cardOptions(8);
            const cStr = cardOptions.map(combo => combo.map(cf => cf.toString()));
            assert.deepEqual(cStr, [
                    ['<< [null] -- rank 0 -- invalid >>',
                        '<< A of club -- rank 1 >>'],
                    ['<< [null] -- rank 0 -- invalid >>',
                        '<< 3 of spade -- rank 3 >>']
                ],
                'projection for rank 8');
        });

        it('should have a range of the cards for (11)', () => {
            const cardOptions = hand.cardOptions(11);
            const cStr = cardOptions.map(combo => combo.map(cf => cf.toString()));
            assert.deepEqual(cStr,
                [
                    ['<< [null] -- rank 0 -- invalid >>',
                        '<< A of club -- rank 1 >>',
                        '<< A of club -- rank 11 >>'],
                    ['<< [null] -- rank 0 -- invalid >>',
                        '<< 3 of spade -- rank 3 >>']
                ],
                'projection for rank 8');
        });
    });

    describe('combos', () => {
        it('should describe all possible combinations at (8)', () => {
            const cardCombos = hand.combos(8);

            const cStr = cardCombos.map(combo => combo.map(cf => cf.toString()));
            // console.log('combos at 8', cStr);

            assert.deepEqual(cStr, [
                    [
                        '<< [null] -- rank 0 -- invalid >>',
                        '<< [null] -- rank 0 -- invalid >>'
                    ],
                    [
                        '<< A of club -- rank 1 >>',
                        '<< [null] -- rank 0 -- invalid >>'
                    ],
                    [
                        '<< [null] -- rank 0 -- invalid >>',
                        '<< 3 of spade -- rank 3 >>'
                    ],
                    [
                        '<< A of club -- rank 1 >>',
                        '<< 3 of spade -- rank 3 >>'
                    ]
                ],
                'combos for rank 8');
        });

        it('should describe all possible combinations at (11)', () => {
            const cardCombos = hand.combos(11);

            const cStr = cardCombos.map(combo => combo.map(cf => cf.toString()));
            assert.deepEqual(cStr, [
                [
                    '<< [null] -- rank 0 -- invalid >>',
                    '<< [null] -- rank 0 -- invalid >>'
                ],
                [
                    '<< A of club -- rank 1 >>',
                    '<< [null] -- rank 0 -- invalid >>'
                ],
                [
                    '<< A of club -- rank 11 >>',
                    '<< [null] -- rank 0 -- invalid >>'
                ],
                [
                    '<< [null] -- rank 0 -- invalid >>',
                    '<< 3 of spade -- rank 3 >>'
                ],
                [
                    '<< A of club -- rank 1 >>',
                    '<< 3 of spade -- rank 3 >>'
                ],
                [
                    '<< A of club -- rank 11 >>',
                    '<< 3 of spade -- rank 3 >>'
                ]
            ], 'combos for rank 8');
        });
    });

    describe('bestPair', () => {
        let best;
        /**
         *  lowest value for one cards is the best sum
         */
        describe('(3)', () => {
            beforeEach(() => {
                best = hand.bestPair(3);
            });
            it('should give you the best pair - rank 4', () => {
                assert.equal(best.rank, 3);
            });

            it('should give the expected card ranks', () => {
                assert.deepEqual(_.map(best.cards, 'rank'), [0, 3]);
            });
        });
        /**
         *  lowest value for both cards is the best sum
         */
        describe('(8)', () => {
            beforeEach(() => {
                best = hand.bestPair(8);
            });
            it('should give you the best pair - rank 4', () => {
                assert.equal(best.rank, 4);
            });

            it('should give the expected card ranks', () => {
                assert.deepEqual(_.map(best.cards, 'rank'), [1, 3]);
            });
        });

        /**
         * high value of one card is enough
         */
        describe('(11)', () => {
            beforeEach(() => {
                best = hand.bestPair(11);
            });
            it('should give you the best pair - rank 11', () => {
                assert.equal(best.rank, 11);
            });

            it('should give the expected card ranks', () => {
                assert.deepEqual(_.map(best.cards, 'rank'), [11, 0]);
            });
        });


        /**
         * highest value of both cards is used
         */
        describe('(14)', () => {
            beforeEach(() => {
                best = hand.bestPair(14);
            });
            it('should give you the best pair - rank 14', () => {
                assert.equal(best.rank, 14);
            });

            it('should give the expected card ranks', () => {
                assert.deepEqual(_.map(best.cards, 'rank'), [11, 3]);
            });
        });

    });
});

describe('Deck', () => {
    let deck;
    beforeEach(() => {
        deck = new Deck(1);
    });

    describe('constructor', () => {
        it('should have 52 cards', () => assert.equal(deck.cardCount, 52, 'deck has 52 cards'));
        it('should have 52 cardsLeft', () => assert.equal(deck.cardsLeft, 52, 'deck has 52 cardsLeft'));
        it('sho0uld assign the deck to each card', () => {
            for (let card of deck.cards) {
                assert.equal(deck, card.deck);
            }
        });
    });

    describe('draw', function () {
        let first;
        let hand;

        describe('draw one (default)', () => {
            beforeEach(function () {
                first = deck.cards[0];
                hand = deck.draw();
            });

            it('should be at card 1', () => assert.equal(deck.current, 1, 'at card 1'));

            it('should still have 52 cards', () => assert.equal(deck.cardCount, 52, 'deck has 52 cards'));

            it('should have 1 fewer card', () => assert.equal(deck.cardsLeft, 51));

            it('should have a hand of the first card', () => assert.equal(first.toString(), hand.toString()));
        });

        describe('draw many', () => {
            const DRAWN = 4;
            let drawnCards;
            beforeEach(function () {
                drawnCards = deck.cards.slice(0, DRAWN);
                hand = deck.draw(DRAWN);
            });

            it('should be at card ' + DRAWN, () => assert.equal(deck.current, DRAWN, 'at card ' + DRAWN));

            it(`should still have 52 cards`, () => assert.equal(deck.cardCount, 52, 'deck has 52 cards'));

            it(`should have ${DRAWN} fewer card`, () => assert.equal(deck.cardsLeft, 52 - DRAWN));

            it('should have a hand of the cards', () => {
                for (var i = 0; i < DRAWN; ++i) {
                    assert.equal(drawnCards.map(card => card.toString()).join(','), hand.toString());
                }
            });
        });
    });
});
