import chai from 'chai';
import weaponsMixin from './../../lib/Character/WeaponsMixin';

const assert = chai.assert;

describe('Character/WeaponMixin', function () {
    let char;
    class Base { // a stub
        constructor(props) {
            this.name = props.name;
            this.reflexes = props.reflexes;
        }
    }
    class Character extends weaponsMixin(Base) {
        skillRank(name) { // a stub
            return name === 'Hand Weapons' ? 2 + this.reflexes : Math.round(this.reflexes / 2);
        }
    }

    beforeEach(() => {
        char = new Character({
            name: 'foo',
            body: 4,
            mind: 5,
            reflexes: 6,
            spirit: 7,
            skills: [
                {name: 'Hand Weapons', attr: 'reflexes', level: 2}
            ],

            weapons: [
                {name: 'Boot with Nails', damageType: 'Hard', skill: 'Hand Weapons', leverage: 0.5},
                {name: 'Rubber Hose', damageType: 'Hard', blunt: true, skill: 'Hand Weapons', leverage: 0.5}
            ]
        });
    });

    it('should have all the weapons', () => assert.deepEqual(char.weapons.map(w => w.name), ['Boot with Nails', 'Rubber Hose']));

    describe('CharacterWeapon', () => {
        let boot;

        beforeEach(() => {
            boot = char.weapons[0];
        });

        it('should reflect character', () => assert.equal(boot.char.name, char.name));

        it('should have weapon name', () => assert.equal(boot.name, 'Boot with Nails'));

        it('should reflect rank', () => assert.equal(boot.rank, 8));

        it('should reflect damageType', () => assert.equal(boot.damageType, 'Hard'));
    });
});
