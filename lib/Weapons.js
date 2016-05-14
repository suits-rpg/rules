import _ from 'lodash';
import percent from './util/percent';

export const weapons = {};

export class Weapon {
    constructor(params) {
        this.name = params.name;
        this.powerType = params.type;
        this.leverage = params.leverage || 1;
        this.skill = params.skill || '';
        this.size = params.size;
        this.boost = params.boost || 0;
        this.offense = params.offense || 0;
        this.defense = params.defense || 0;
        this.blunt = params.blunt || false;
        this.slow = params.slow || false;
    }

    set powerType(val) {
        this._powerType = val;
    }

    get powerType() {
        return this._powerType;
    }

    set name(val) {
        if (!_.isString(val)) {
            throw new Error('non string value set to name');
        }
        if (!val) {
            throw new Error('weapon must have name');
        }
        this._name = val;
    }

    get name() {
        return this._name;
    }

    set leverage(val) {
        if (!_.isNumber(val)) {
            throw new Error('non numeric value set to leverage:' + val);
        }
        this._leverage = val;
    }

    get leverage() {
        return this._leverage;
    }

    set boost(val) {
        this._boost = val;
    }

    get boost() {
        return this._boost;
    }

    set offense(val) {
        this._offense = val;
    }

    get offense() {
        return this._offense;
    }

    set defense(val) {
        this._defense = val;
    }

    get defense() {
        return this._defense;
    }

    set size(val) {
        this._size = val;
    }

    get size() {
        return this._size;
    }

    set skill(val) {
        this._skill = val;
    }

    get skill() {
        return this._skill;
    }

    set slow(val) {
        this._slow = val;
    }

    get slow() {
        return this._slow ? true : false;
    }
}

/** Hand Weapons */

const sizes = [
    'Size,Piercing,Cutting,Hard',
    'small,50%,60%,75%',
    'medium,60%,80%,100%',
    'large,75%,100%,125%'
].reduce((memo, value, index) => {
        if (index === 0) {
            memo.fields = value.split(',');
        } else {
            const data = value.split(',').map(percent);
            let size = _.zipObject(memo.fields, data);
            memo.sizes.push(size);
        }
        return memo;
    },
    {
        fields: [],
        sizes: []
    }).sizes;

const weaponTypes = [
    'Name,Type,Blunt,Cost,AP,Slow,Offense,Defense,Damage',
    'Axe,Cutting,,80%,,1,,,+1',
    'Blades,Cutting,,100%,,,,+1,',
    'Bludgeon,Hard,,50%,,1,,,',
    'Warhammer,Hard,,80%,50%,,,,-1',
    'Stick,Hard,1,25%,,,,,-1',
    'Spear,Piercing,,50%,,,-1,,',
    'Pick,Piercing,,75%,25%,1,,,+1'
].reduce((memo, value, index) => {
    if (index === 0) {
        memo.fields = value.split(',');
    } else {
        const data = value.split(',').map(percent);
        let weapon = _.zipObject(memo.fields, data);
        memo.weapons.push(weapon);
    }
    return memo;
}, {
    fields: [],
    weapons: []
}).weapons;

for (let size of sizes) {
    for (let type of weaponTypes) {
        let name = size.Size + ' ' + type.Name.toLowerCase();
        let params = {
            name: name,
            type: type.Type,
            skill: 'Hand Weapons',
            size: size.Size,
            leverage: size[type.Type],
            slow: type.Slow ? true : false,
            blunt: type.Blunt ? true : false,
            cost: type.Cost || 1
        };
        let weapon = new Weapon(params);
        weapons[weapon.name] = weapon;
    }
}
