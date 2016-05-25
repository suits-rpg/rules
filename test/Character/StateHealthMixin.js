import chai from 'chai';
import StateHealthMixin from './../../lib/Character/StateHealthMixin';

const assert = chai.assert;

describe('Character/StateHealthMixin', function () {
    let char;
    class Base { // a stub
        constructor(props) {
            this.name = props.name;
            this.body = props.body;
        }
    }
    class Character extends StateHealthMixin(Base) {
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

    it('should start with state active', () => assert.equal(char.state, 'ready'));
    it('should start with health awake', () => assert.equal(char.health, 'awake'));

    describe('state', () => {
        describe('start', () => {
            it('shoud start as state:ready', () => assert.equal(char.state, 'ready'));
            it('should start as health:active', () => assert.equal(char.health, 'awake'));
        });

        describe('ko', () => {
            beforeEach(() => char.knockOut());

            it('should make character sleep', () => assert.equal(char.state, 'inactive'));
            it('should make character knocked out', () => assert.equal(char.health, 'knocked out'));
        });
    });

    describe('chips', () => {
        describe('start', () => {
            it('starts with no white chips', () => assert.equal(char.whiteChips, 0, 'no white chips'));
            it('starts with no blue chips', () => assert.equal(char.blueChips, 0, 'no blue chips'));
        });

        describe('after UpdateChips', () => {
            beforeEach(() => {
                char.updateChips();
            });

            it('updates to 1 white chips', () => assert.equal(char.whiteChips, 1, '1 white chips'));
            it('updates to 1 blue chips', () => assert.equal(char.blueChips, 1, '1 blue chips'));
        });

        describe('after updateChipsPassive', () => {
            beforeEach(() => {
                char.updateChipsPassive();
            });

            it('updates to 2 white chips', () => assert.equal(char.whiteChips, 2, '2 white chips'));
            it('updates to 0 blue chips', () => assert.equal(char.blueChips, 0, '0 blue chips'));
        });

        describe('de-crazify chips', () => {
            beforeEach(() => {
                char.blueChips = 7;
                char.whiteChips = 9;
                char.cleanChips();
            });
            it('resets a strange tally to a legal value', () => {
                it('updates to 1 white chips', () => assert.equal(char.whiteChips, 1, '1 white chips'));
                it('updates to 1 blue chips', () => assert.equal(char.blueChips, 1, '1 blue chips'));
            });
        });
    });

    describe('.impact', () => {
        it('should have the proper distribution for Hard weapons', () => {
            char.impact(8, {damageType: 'Hard'});

            assert.equal(char.shock, 4);
            assert.equal(char.wounds, 4);
        });

        it('should have the proper distribution for Cutting weapons', () => {
            char.impact(8, {damageType: 'Cutting'});

            assert.equal(char.shock, 3);
            assert.equal(char.wounds, 5);
        });

        it('should have the proper distribution for Piercing weapons', () => {
            char.impact(8, {damageType: 'Piercing'});

            assert.equal(char.shock, 2);
            assert.equal(char.wounds, 6);
        });
    });
});
