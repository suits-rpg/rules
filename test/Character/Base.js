import chai from 'chai';
import Base from './../../lib/Character/Base';

const assert = chai.assert;

describe('Character/Base', function () {
    let char;

    beforeEach(() => {
        char = new Base({
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
});
