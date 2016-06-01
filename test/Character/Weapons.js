import chai from 'chai';
import {weapons} from '../../lib/Character/Weapons';
import CharacterWeapon from '../../lib/Character/CharacterWeapon';
const assert = chai.assert;

describe('weapons', function () {
    // console.log('weapons: ', weapons);

    describe('CharacterWeapon', () => {
        let charWeapon;
        const sword = weapons['medium blades'];
        const charMock = {
            skillRank: name => {
                return name === 'Hand Weapons' ? 7 : 0;
            },
            body: 6
        };

        beforeEach(() => {
            charWeapon = new CharacterWeapon(charMock, sword);
        });

        // skillRank for Hand Weapons is in mock of character
        it('should have the rank of 7', () => assert.equal(charWeapon.rank, 7, 'skill reflects charWeapon'));

        // base power is 100% of body
        it('should have a base power of 6', () => assert.equal(charWeapon.basePower, 6));
    });
});
