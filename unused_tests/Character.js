import chai from 'chai';
import Character from '../lib/Character/Character';
const assert = chai.assert;
import {Teams} from '../lib/Teams';

describe('Character', function () {
    let char;

    beforeEach(() => {
        char = new Character({
            name: 'foo',
            body: 4,
            mind: 5,
            reflexes: 6,
            spirit: 7,
            skills: [
                {name: 'running', attr: 'body', level: 2}
            ]
        });
    });

    describe('attributes', () => {
        it('should set body', () => assert.equal(char.body, 4, 'body is set'));
        it('should set mind', () => assert.equal(char.mind, 5, 'mind is set'));
        it('should set reflexes', () => assert.equal(char.reflexes, 6, 'reflexes is set'));
        it('should set spirit', () => assert.equal(char.spirit, 7, 'spirit is set'));
    });

    describe('name', () => {
        it('should set name', () => assert.equal(char.name, 'foo', 'name is set'));
    });

    describe('skills', () => {
        it('should have skill rank 6', () => assert.equal(char.skillRank('running'), 6, 'gets the right rank'));
        it('should get rank 0 for non-set skill', () => assert.equal(char.skillRank('acting'), 0, 'unset skill is zero'));
    });

    describe('Teams', () => {
        var teams;

        beforeEach(() => {
            teams = new Teams();
            teams.add('alphans').add('betans');
            char.team = teams.getTeam('alphans');
        });

        it('has the right teamName', () => assert.equal(char.teamName, 'alphans'));
    });

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
