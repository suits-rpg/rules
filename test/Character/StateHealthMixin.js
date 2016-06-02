import chai from 'chai';
import stateHealthMixin from './../../lib/Character/StateHealthMixin';

const assert = chai.assert;

describe('Character/StateHealthMixin', function () {
    let char;
    class Base { // a stub
        constructor(props) {
            this.name = props.name;
            this.body = props.body;
        }
    }
    class Character extends stateHealthMixin(Base) {
    }

    beforeEach(() => {
        char = new Character({
            name: 'foo',
            body: 4,
            mind: 5,
            reflexes: 6,
            spirit: 7
        });
    });

    it('should start with state active', () => assert.equal(char.state, 'canAct'));
    it('should start with health awake', () => assert.equal(char.health, 'awake'));

    describe('state', () => {
        describe('start', () => {
            it('shoud start as state:canAct', () => assert.equal(char.state, 'canAct'));
            it('should start as health:active', () => assert.equal(char.health, 'awake'));
        });

        describe('.knockOut', () => {
            beforeEach(() => char.knockOut());

            it('should make character sleep', () => assert.equal(char.state, 'inactive'));
            it('should make character knocked out', () => assert.equal(char.health, 'knocked out'));
        });

        describe('act', () => {
            beforeEach(() => char.act());

            it('should be acted', () => assert.equal(char.state, 'acted'));

            describe('reset', () => {
                beforeEach(() => char.resetAction());

                it('should reset to canAct', () => assert.equal(char.state, 'canAct'));
            });
        });
    });

    describe('.impact', () => {
        it('should have the proper distribution for Hard weapons', () => {
            char.impact(8, {damageType: 'Hard'}, {name: 'Stan'});

            assert.equal(char.shock, 4);
            assert.equal(char.wounds, 4);
        });

        it('should have the proper distribution for Cutting weapons', () => {
            char.impact(8, {damageType: 'Cutting'}, {name: 'Stan'});

            assert.equal(char.shock, 3);
            assert.equal(char.wounds, 5);
        });

        describe('piercing hit', () => {
            beforeEach(() => char.impact(8, {damageType: 'Piercing'}, {name: 'Stan'}));
            it('should have the proper distribution for Piercing weapons', () => {
                assert.equal(char.shock, 2);
                assert.equal(char.wounds, 6);
            });

            it('should log the hit', () => assert.deepEqual(char.hitLog, [
                {
                    event: 'attack',
                    currentShock: 2,
                    currentWounds: 6,
                    health: "dead",
                    shock: 2,
                    state: "inactive",
                    wounds: 6,
                    notes: 'from Stan'
                }
            ]));
        });

    });
});
