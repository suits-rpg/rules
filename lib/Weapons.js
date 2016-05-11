import _ from 'lodash';

export const weapons = {};

class Weapon {
    constructor(params) {
        this.name = params.name;
        this.leverage = params.leverage || 1;
        this.skill = params.skill || '';
        this.size = params.size || 'medium';
        this.boost = params.boost || 0;
        this.offense = params.offense || 0;
        this.defense = params.defense || 0;
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
}

/** Hand Weapons */

const sizes = [
    'Size,Piercing,Cutting,Hard',
    'small,50%,60%,75%',
    'medium,60%,80%,100%',
    'large,75%,100%,125%'
].reduce((memo, value, index) => {
        const data = value.split(',').map(value => {
            let p = /([\d]+)%/.exec(value);
            return p ? parseInt(p[1], 10) / 100 : value;
        });

        if (index === 0) {
            memo.fields = data;
        } else {
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
    'Name,Type,Advantage,Disadvantage,Offense,Defense,Damage',
    'Axe,Cutting,,Slow,,,+1',
    'Blades,Cutting,,,,+1,',
    'Bludgeon,Hard,Cheap,Slow,,,+1',
    'Warhammer,Hard,AP 33%,,,,-1',
    'Sti,Hard,Very Cheap,Blunt,,,-1',
    'Foil,Piercing,,Fragile,+1,+1,',
    'Spear,Piercing,Cheap,,-1,,',
    'Pick,Piercing,,Slow,,,+1'
].reduce((memo, value, index) => {
    const data = value.split(',');
    if (index === 0) {
        memo.fields = data;
    } else {
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
            skill: 'Hand Weapons',
            size: size.Size,
            leverage: size[type.Type]
        };
        let weapon = new Weapon(params);
        weapons[weapon.name] = weapon;
    }
}
