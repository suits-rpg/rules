import chai from 'chai';
import Character from '../lib/Character';
const assert = chai.assert;

describe('suits-rules', function () {
    describe('Character', function () {
        let char;

        beforeEach(() => {
            char = new Character({
                name: 'foo',
                body: 4,
                mind: 5,
                speed: 6,
                spirit: 7
            });
        });

        describe('attributes', () => {
            it('should set body', () => assert.equal(char.body, 4, 'body is set'));
            it('should set mind', () => assert.equal(char.mind, 5, 'mind is set'));
            it('should set speed', () => assert.equal(char.speed, 6, 'speed is set'));
            it('should set spirit', () => assert.equal(char.spirit, 7, 'spirit is set'));
        });

        describe('name', () => {
            it('should set name', () => assert.equal(char.name, 'foo', 'name is set'));
        });

        describe('skills', () => {
            beforeEach(() => char.addSkill('running', 'body', 2));

            it('should have skill rank 6', () => assert.equal(char.skillRank('running'), 6, 'gets the right rank'));
            it('should get rank 0 for non-set skill', () => assert.equal(char.skillRank('acting'), 0, 'unset skill is zero'));
        });
    });
});
