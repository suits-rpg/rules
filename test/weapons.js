import chai from 'chai';
import {weapons} from '../lib/Weapons';
import CharacterWeapon from '../lib/CharacterWeapon';
const assert = chai.assert;

describe('weapons', function () {
    // console.log('weapons: ', weapons);

    describe('CharacterWeapon', () => {
        let charWeapon;
        const sword = weapons['medium blades'];
        const charMock = {
            skillRank: name => {
                return name === 'Hand Weapons' ? 7 : 0;
            }
        };
        
        beforeEach(() => {
            charWeapon = new CharacterWeapon(charMock, sword);
        });
        
        it('should have the rank of 7', () => {
            assert.equal(charWeapon.rank, 7, 'skill reflects charWeapon');
        });
    });
});
