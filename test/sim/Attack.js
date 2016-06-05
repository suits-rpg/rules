import chai from 'chai';
import Deck from './../../lib/deck/Deck';
import SUITS from './../../lib/deck/suits.json';
import VALUES from './../../lib/deck/values.json';
import Attack from './../../lib/simulation/Attack';
import Character from './../../lib/Character/Character';
import {weapons} from './../../lib/Character/Weapons';
import {armors} from './../../lib/Character/Armor';
const assert = chai.assert;

describe('Attack', () => {
    let target;
    let char;
    let deck;
    let attack;

    beforeEach(() => {
        char = new Character({
            name: 'foo',
            body: 6,
            reflexes: 7,
            skills: [{
                name: 'Hand Weapons', levels: 2, attr: 'reflexes'
            }],
            weapons: [
                weapons['medium blades']
            ],
            armor: [
                armors['Chainmail']
            ]
        });

        target = new Character({
            name: 'bar',
            body: 6,
            reflexes: 7,
            skills: [{
                name: 'Hand Weapons', levels: 2, attr: 'reflexes'
            }],
            weapons: [
                weapons['medium blades']
            ],
            armor: [
                armors['Chainmail']
            ]
        });

        deck = new Deck(i => {
            const suit = SUITS[i % SUITS.length];
            const value = VALUES[i % VALUES.length];
            return {suit, value};
        });

        char.target = target;

        attack = new Attack(char, {deck});
    });

    it('has the right char', () => assert.equal(attack.char.name, char.name));

    it('has the right target', () => assert.equal(attack.target.name, target.name));

    describe('.resolve', () => {
        let summary;
        beforeEach(() => {
            summary = attack.resolve();
        });

        it('should have the expected result: ', () => {
            assert.deepEqual(summary.result, {
                message: 'bar hits foo',
                basePower: 6,
                boostedPower: 12,
                ratio: 2,
                power: 9
            });
        });
    });
});
