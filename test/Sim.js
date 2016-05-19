import chai from 'chai';
import {Sim} from '../lib/Sim';
import {Teams} from '../lib/Teams';
import {Deck, Card, SUITS, VALUES} from '../lib/Deck';
import Character from '../lib/Character';
import {weapons} from '../lib/Weapons';

const assert = chai.assert;
const startEndReport = report => report.reduce((memo, event) => {
    if (/act\./.test(event.event)) {
        memo.push([event.event, event.data.char]);
    }
    return memo;
}, []);

const s = cards => cards.map(card => card.toString());

describe('Sim', () => {
    let deck;
    let sim;
    let teams;
    let chars;

    beforeEach(() => {
        let props;

        teams = new Teams();
        teams.add('Alphans');
        teams.add('Betans');

        deck = new Deck(100, index => {
            let n = index % VALUES.length;
            if (n % 2) {
                n = (VALUES.length - 1) - n;
            }
            const value = VALUES[n];
            const suit = SUITS[index % SUITS.length];
            return new Card(value, suit);
        });

        chars = [];

        // alphans

        const skills = [{
            name: 'Hand Weapon', levels: 2, attr: 'reflexes'
        }];
        const alphanWeapons = [weapons['medium blades']];
        const betanWeapons = alphanWeapons;

        for (let i of [0, 1, 2]) {
            props = {
                name: 'Alphan ' + (i + 1),
                reflexes: 6 + i,
                body: 6 - i,
                mind: 5,
                Will: 5 + i,
                team: teams.getTeam('Alphans'),
                skills: skills,
                weapons: alphanWeapons
            };

            chars.push(new Character(props));
        }

        // betans
        for (let j of [0, 1, 2]) {
            props = {
                name: 'Betan ' + (j + 1),
                reflexes: 5 + j,
                body: 7 - j,
                mind: 5,
                Will: 5 + j,
                team: teams.getTeam('Betans'),
                skills: skills,
                weapons: betanWeapons
            };

            chars.push(new Character(props));
        }

        sim = new Sim(chars, teams, deck);
    });

    describe('constructor', () => {
        it('should have characters as entered', () => {
            var report = sim.characters.map(c => c.toJSON());
            assert.deepEqual(report, require('./e/SimsReport.json'));
        });
        
        describe('character skills', () =>{
            let skillsList;
            beforeEach(() => {
                skillsList = chars.reduce((list, char) => {
                   list[char.name] = char.skills;
                    return list;
                }, {});
            });

            it('should have characters with expected skills', () => {
                console.log('character skills: ', skillsList);
            });
        });
    });

    describe('round', () => {
        it('starts at round 0', () => assert.equal(sim.round, 0));

        describe('round one', () => {
            let report;
            beforeEach(() => {
                report = [];
                sim.onAny((event, data) => {
                    report.push({
                        event: event,
                        data: data
                    });
                });
                sim.doRound();
            });

            describe('attack results', () => {
                let attacks;
                beforeEach(() => {
                    attacks = report.reduce((memo, event) => {
                        if (event.event === 'attack') {
                            const pResult = {
                                result: event.data.result,
                                charCards: s(event.data.charDraw.cards),
                                targetCards: s(event.data.targetDraw.cards)
                            };
                            memo.push(pResult);
                        }
                        return memo;
                    }, []);
                });

                it('should have results for each attack', () => {
                    console.log('attacks: ', require('util').inspect(attacks, {depth: 3}));
                    assert.deepEqual(attacks, ['no result', 'no result', 'no result', 'no result']
                        , 'attacks are recorded');
                })
            });

            /**
             * With the character stats and the pre-geneerated card draws,
             * you will have some characters not acting on the first round.
             * Also the order of action should reflect the initiative class.
             */
            it('should have some of the characters act', () => {
                assert.deepEqual(startEndReport(report), require('./e/startEndReport.json'));
            });

            it('goes to round 1', () => assert.equal(sim.round, 1));

            describe('second round', () => {
                let tally;

                beforeEach(() => {
                    report = [];
                    sim.doRound(); // do the second report            
                    tally = report.reduce((tally, item) => {
                        const event = item.event;
                        if (/^act\.(start|end)/.test(event)) {
                            const name = item.data.char;
                            if (!tally[name]) {
                                tally[name] = {};
                            }
                            if (tally[name][event]) {
                                ++tally[name][event];
                            } else {
                                tally[name][event] = 1;
                            }
                        }
                        return tally;
                    }, {});
                });

                it('should have everyone', () => assert.deepEqual(startEndReport(report), require('./e/startEndReport2.json')));

                it('goes to round 2', () => assert.equal(sim.round, 2));

                /**
                 * this validates that
                 * 1) every character is given an act
                 * 2) every characters' act goes through completely.
                 */
                it('includes everyone', () => {
                    assert.deepEqual(tally, require('./e/turn2tally.json'));
                });

                it('has engaged everyone', () => {
                    for (let orderItem of sim.currentOrder) {
                        let enemy = orderItem.char.target;
                        assert.ok(enemy, 'every character has enemy');
                    }
                });

                it('has set everyone\'s currentWeapon', () => {
                    for (let char of chars) {
                        assert.equal(char.currentWeapon ? char.currentWeapon.name : '', 'medium blades');
                    }
                });
            });
        });
    });
});
