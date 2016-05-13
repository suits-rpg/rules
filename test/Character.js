import chai from 'chai';
import Character from '../lib/Character';
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
            spirit: 7
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

    describe('addSkill', () => {
        beforeEach(() => char.addSkill('running', 'body', 2));

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
});
