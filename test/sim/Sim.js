import chai from 'chai';
import {Sim} from '../../lib/Sim/Sim';
import {Teams} from '../../lib/Sim/Teams';
import Deck from '../../lib/deck/Deck';
import SUITS from '../../lib/deck/suits.json';
import VALUES from '../../lib/deck/values.json';
import Character from '../../lib/Character/Character';
import {weapons} from '../../lib/Character/Weapons';

const assert = chai.assert;
const startEndReport = report => report.reduce((memo, event) => {
    if (/act\./.test(event.event)) {
        memo.push([event.event, event.data.char]);
    }
    return memo;
}, []);

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

        const pseudoRandom = ('' + Math.PI).replace('.', '')
            .split('')
            .map(n => parseInt(n))
            .map(n => n % SUITS.length);

        deck = new Deck(index => {
            let n = index % VALUES.length;
            if (n % 2) {
                n = (VALUES.length - 1) - n;
            }
            const value = VALUES[n];
            const suitsIndex = pseudoRandom[index % pseudoRandom.length];
            const suit = SUITS[suitsIndex];
            return {value: value, suit: suit};
        });

        chars = [];

        // alphans

        const skills = [{
            name: 'Hand Weapons', levels: 2, attr: 'reflexes'
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
            assert.deepEqual(report, require('./../../unused_tests/SimExpects/characters.json'));
        });

        describe('character skills', () => {
            let skillsList;
            beforeEach(() => {
                skillsList = chars.reduce((list, char) => {
                    list[char.name] = char.skills;
                    return list;
                }, {});
            });

            it('should have characters with expected skills', () => {
                assert.deepEqual(skillsList, {
                    'Alphan 1': {'Hand Weapons': 6},
                    'Alphan 2': {'Hand Weapons': 7},
                    'Alphan 3': {'Hand Weapons': 8},
                    'Betan 1': {'Hand Weapons': 5},
                    'Betan 2': {'Hand Weapons': 6},
                    'Betan 3': {'Hand Weapons': 7}
                }, 'characters have skills');
            });
        });
    });

    describe('simulation', () => {
        it('starts at round 0', () => assert.equal(sim.round, 0));

        describe('init.startRound', () => {
            let chipReport;

            beforeEach(() => {
                chipReport = [];
                sim.init.startRound(0);

                for (let char of chars) {
                    let cr = {
                        char: char.name,
                        blueChips: char.blueChips,
                        whiteChips: char.whiteChips
                    };
                    chipReport.push(cr);
                }
            });

            it('should have some characters with blue, some without', () => {
                assert.deepEqual(chipReport, require('./../../unused_tests/SimExpects/firstRoundChipReport.json'));
            });
        });

        describe('first round', () => {
            let report; // complete event log
            let attacks; // report from characters who attacked
            let noops; // report from characters who do not act because they acted passively on someone elses' turn
            let hits; // report of characters health. 

            const tallyReports = () => {
                attacks = report.reduce((memo, event) => {
                    if (event.event === 'attack') {
                        memo.push(event.data);
                    } else if (event.event === 'recover') {
                        memo.push(Object.assign({recover: true}, event.data));
                    }
                    return memo;
                }, []);

                noops = report.reduce((memo, event) => {
                    if (event.event === 'act.noop') {
                        memo.push(event.data);
                    }
                    return memo;
                }, []);

                hits = chars.reduce((memo, char) => {
                    memo[char.name] = {
                        shock: char.shock,
                        wounds: char.wounds,
                        health: char.health
                    };
                    return memo;
                }, {});
            };

            beforeEach(() => {
                report = [];
                sim.onAny((event, data) => {
                    report.push({
                        event: event,
                        data: data
                    });
                });
                sim.doRound();
                tallyReports();
            });

            it('should have results for each attack', () => {
               // console.log('hits, round 2:', JSON.stringify(hits, true, 4));
              //  console.log('attacks, round 2:', JSON.stringify(attacks, true, 4));
                // assert.deepEqual(attacks, require('./SimExpects/firstRoundAttacks.json'), 'attacks are recorded');
            });

            it('should have no noops', () => {
                assert.deepEqual(noops, [], 'no noops in round 1');
            });

            /**
             * With the character stats and the pre-generated card draws,
             * you will have some characters not acting on the firstCard round.
             * Also the order of action should reflect the initiative class.
             */
            it('should have some of the characters act', () => {
                assert.deepEqual(startEndReport(report), require('./../../unused_tests/SimExpects/startEndReport.json'));
            });

            it('has expected hits:', () => {
                assert.deepEqual(hits, require('./../../unused_tests/SimExpects/firstRoundHits.json'));
            });

            it('goes to round 1', () => assert.equal(sim.round, 1));

            describe('second round', () => {
                beforeEach(() => {
                    report = [];
                    noops = [];
                    sim.doRound();
                    tallyReports();
                   // console.log('hits, round 2:', JSON.stringify(hits, true, 4));
                    // console.log('attacks, round 2:', JSON.stringify(attacks, true, 4));
                });

                it.skip('attack results', () => assert.deepEqual(attacks, require('./../../unused_tests/SimExpects/secondRoundAttacks.json')));

                it('should have noops', () => assert.deepEqual(noops, require('./../../unused_tests/SimExpects/secondRoundNoops.json')));

                it('goes to round 2', () => assert.equal(sim.round, 2));
            });
        });
    });
});
