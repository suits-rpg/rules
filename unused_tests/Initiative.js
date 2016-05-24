import chai from 'chai';
import {Deck, Card, SUITS, VALUES} from '../lib/Deck';
import Initiative from '../lib/Initiative';
import _ from 'lodash';
const assert = chai.assert;

describe('Initiative', () => {
  describe('firstAct exclusion', () => {
    let deck;
    let init;
    let order;
    let order1;

    beforeEach(() => {
      deck = new Deck(8, index => {
        const value = VALUES[Math.abs(2 - index) % VALUES.length];
        const suit = SUITS[index % SUITS.length];
        return new Card(value, suit);
      });
// deck == A of club,3 of spade,5 of diamond,7 of heart,9 of club,J of spade,K of diamond,2 of heart
      init = new Initiative(deck);
      init.addCharacter({reflexes: 2, name: 'bob'});
      init.addCharacter({reflexes: 3, name: 'rob'});
      init.addCharacter({reflexes: 4, name: 'jon'});
      order = init.order(0);
      order1 = init.order(1);
    });
    it('should not have bob in the firstCard round', () => {
      assert.deepEqual(_(order).map(item => item.char.name).sortBy(_.identity).value(), ['jon', 'rob']);
    });

    it('should have everyone in the second round', () => {
      assert.deepEqual(_(order1).map(item => item.char.name).sortBy(_.identity).value(), ['bob', 'jon', 'rob']);
    });

    it('have the users in the expected order in the firstCard round', () => {
      assert.deepEqual(_(order).map(item => item.char.name).value(), ['jon', 'rob']);
    });

    it('should have everyone in the second round', () => {
      assert.deepEqual(_(order1).map(item => item.char.name).value(), ['jon', 'rob', 'bob']);
    });
  });
});
