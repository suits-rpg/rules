import chai from 'chai';
import Deck from '../../lib/deck/Deck';
import SUITS from '../../lib/deck/suits.json';
import VALUES from '../../lib/deck/values.json';
import Initiative from '../../lib/Sim/Initiative';
import _ from 'lodash';
const assert = chai.assert;

describe('Initiative', () => {
  describe('firstAct exclusion', () => {
    let deck;
    let init;
    let order;
    let order1;

    beforeEach(() => {
      deck = new Deck(index => {
        const value = VALUES[Math.abs(2 - index) % VALUES.length];
        const suit = SUITS[index % SUITS.length];
        return {value, suit};
      });

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
