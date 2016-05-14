import chai from 'chai';
import Sim from '../lib/Sim';
import {Teams} from '../lib/Teams';
import {Deck, Card, SUITS, VALUES} from '../lib/Deck';
import Character from '../lib/Character';

const assert = chai.assert;

describe('Sim', () => {
    let deck;
    let sim;
    let teams;

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


        var chars = [];
        // alphans
        for (let i of [0, 1, 2]) {
            props = {
                name: 'Alphan ' + (i + 1),
                reflexes: 6 + i,
                body: 6 - i,
                mind: 5,
                Will: 5 + i,
                team: teams.getTeam('Alphans')
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
                team: teams.getTeam('Betans')
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
    });

    describe('round', () => {
        it('starts at round 0', () => assert.equal(sim.round, 0));

        describe('round one', () => {
            var report = [];
            beforeEach(() => {
                const orderData = sim.initative._charMeta;
                sim.onAny((event, data) => {
                    report.push({
                        event: event,
                        data: data
                    });
                });
                sim.doRound();
            });

            it('should have some of the characters act', () => {
                const startEndReport = report.reduce((memo, event) => {
                    if (/act\./.test(event.event)){
                        memo.push([event.event, event.data.char]);
                    }
                    return memo;
                }, []);
                
                console.log('startEndReport: ', JSON.stringify(startEndReport, true, 4));
                
                assert.deepEqual(startEndReport, require('./e/startEndReport.json'));
            });

            it('goes to round 1', () => assert.equal(sim.round, 1));
        });
    });
});
