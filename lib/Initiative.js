import {Deck} from './deck/Deck';
import _ from 'lodash';

function inOrder(series, deck) {
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

/**
 * this class represents the turn order metadata of a character. 
 * This class is designed to be sorted by the inOrder pipe above;
 * the tie field exists to resolve situations in which characters
 * order and reflexes are a match. 
 */
class CharacterOrder {
    /**
     * @param char {Character}
     * @param order {int}
     */
    constructor(char, order) {
        this.char = char;
        this.order = order;
        this.weaponReady = true;
        this.tie = 0;
    }

    /**
     * 
     * @returns {boolean}
     */
    get actFirst() {
        return this.order <= this.char.reflexes;
    }

    /**
     * whether a weapon is ready.
     * Only applies to slow weapons.
     * @param val {boolean}
     */
    set weaponReady(val) {
        this._weaponReady = val ? true : false;
    }

    /**
     * @returns {boolean}
     */
    get weaponReady() {
        return this._weaponReady;
    }

    /**
     *
     * @param val {Character}
     */
    set char(val) {
        this._char = val;
    }

    /**
     * @returns {Character}
     */
    get char() {
        return this._char;
    }

    /**
     * the order of action; based on a card rank.
     * @param val {int}
     */
    set order(val) {
        this._order = val;
    }

    /**
     *
     * @returns {int}
     */
    get order() {
        return this._order;
    }

    /**
     * a card draw ot break tied orders.
     * @param val {int}
     */
    set tie(val) {
        this._tie = val;
    }

    /**
     *
     * @returns {int}
     */
    get tie() {
        return this._tie;
    }
}

/**
 * Initiative is an engine to report which characters act in which order.
 */
export default class Initiative {
    constructor(deck) {
        this.deck = deck;

        this._charMeta = [];
    }

    /**
     *
     * @returns {Deck}
     */
    get deck() {
        return this._deck;
    }

    /**
     *
     * @param val {Deck}
     */
    set deck(val) {
        if (!(val instanceof Deck)) {
            throw new Error("non deck passed to deck");
        }
        this._deck = val;
    }

    /**
     *
     * @param char Character
     */
    addCharacter(char) {
        const hand = this.deck.draw(1);
        var order = hand.firstCard.rank(char.reflexes);
        hand.removeAll();

        this._charMeta.push(new CharacterOrder(char, order));
    }

    order(round) {
        let out;
        if (round === 0) {
            const ifActFirst = _.filter(this._charMeta, item => item.actFirst);
            out = inOrder(ifActFirst, this.deck);
        } else {
            out = inOrder(this._charMeta, this.deck);
        }
        return out;
    }
    
    startRound(round) {
        for (let charOrder of this._charMeta) {
            if (round === 0) {
                if (charOrder.actFirst) {
                    charOrder.char.updateChips();
                } else {
                    charOrder.char.updateChipsPassive();
                }
            } else {
                charOrder.char.updateChips();
            }
        }
    }
}
