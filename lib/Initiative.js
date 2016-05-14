import {Deck} from './Deck';
import _ from 'lodash';

function inOrder (series, deck) {
  /**
   * if there are chars with the same order and reflexes
   * ensure a tie breaking value from the deck.
   */
  return _(series)
    .groupBy(item => item.order + ',' + item.reflexes)
    .map(itemSet => {
      if (itemSet.length > 1) {
        _.each(itemSet, item => {
          if (!item.tie) {
            item.tie = deck.oneRank();
          }
        });
      }
      return itemSet;
    })
    .flatten()
    .orderBy(['order', 'asc'], ['reflexes', 'asc'], ['tie', 'asc'])
    .value();
}

export default class Initiative {
  constructor (deck) {
    this.deck = deck;

    this._charMeta = [];
  }

  /**
   *
   * @returns {Deck}
   */
  get deck () {
    return this._deck;
  }

  /**
   *
   * @param val {Deck}
   */
  set deck (val) {
    if (!(val instanceof Deck)) {
      throw new Error("non Deck passed to deck");
    }
    this._deck = val;
  }

  /**
   *
   * @param char Character
   */
  addCharacter (char) {
    const hand = this.deck.draw(1);
    var order = hand.first.rank(char.reflexes);

    this._charMeta.push({
      char: char,
      order: order,
      tie: 0,
      reflexes: char.reflexes,
      actFirst: order <= char.reflexes,
      weaponReady: true
    });
  }

  order (turn) {
    let out;
    if (turn === 0) {
      const ifActFirst = _.filter(this._charMeta, item => item.actFirst);
      out = inOrder(ifActFirst, this.deck);
    } else {
      out = inOrder(this._charMeta, this.deck);
    }
    return out;
  }
}
