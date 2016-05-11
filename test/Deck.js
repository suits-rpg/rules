import chai from 'chai';
import {Deck} from '../lib/Deck';
const assert = chai.assert;

describe('suits-rules', () => {
    describe('Deck', () => {
        let deck;

        beforeEach(() => {
            deck = new Deck(1);
        });

        describe('constructor', () => {
            it('should have 52 cards', () => assert.equal(deck.cardCount, 52, 'deck has 52 cards'));
            it('should have 52 cardsLeft', () => assert.equal(deck.cardsLeft, 52, 'deck has 52 cardsLeft'));
        });

        describe('draw', function () {
            let first;
            let drawn;

            beforeEach(function () {
                first = deck.cards[0];
                drawn = deck.drawOne();
                console.log('deck: ', require('util').inspect(deck));
            });

            it('should be at card 1', () => assert.equal(deck.current, 1, 'at card 1'));
            
            it('should still have 52 cards', () => assert.equal(deck.cardCount, 52, 'deck has 52 cards'));

            it('should have 1 fewer card', () => assert.equal(deck.cardsLeft, 51));

            it('should have drawn the first card', () => assert.equal(first.toString(), drawn.toString()));
        });
    });
});
