import _ from 'lodash';
import percent from './../util/percent';

export const weapons = {};

export class Weapon {
    constructor(params) {
        this.name = params.name;
        this.damageType = params.type;
        this.leverage = params.leverage || 1;
        this.skill = params.skill || '';
        this.size = params.size;
        this.power = params.power || 0;
        this.slow = params.slow || false;
    }

    set damageType(val) {
        this._powerType = val;
    }

    get damageType() {
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

    set power(val) {
        this._power = val || 0;
    }

    get power() {
        return this._power;
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

const weaponTypes =
    [
        'name,type,blunt,cost,ap,slow,power,club,spade,diamond,heart',
        'Axe,Cutting,,80%,,1,+1,50% Armor,1 Stun/3 Pow,1 Bleed/2 Major,-1 Ref/2 Major',
        'Blades,Cutting,,100%,,,,75% Armor,1 Stun/3 Pow,1 Bleed/2 Major,-1 Ref/2 Major',
        'Bludgeon,Hard,,50%,,1,+1,50% Armor,1 Stun/3 Pow,1 Bleed/4 Major,-1 Ref/2 Major',
        'Warhammer,Hard,,80%,50%,,,25% Armor,1 Stun/3 Pow,1 Bleed/3 Major,-1 Ref/2 Major',
        'Stick,Hard,1,25%,,,-1,75% Armor,1 Stun/3 Pow,Extra Attack,-1 Ref/2 Major',
        'Spear,Piercing,,50%,,,,50% Armor,1 Stun/2 Pow,1 Bleed/2 Major,-1 Ref/2 Major',
        'Pick,Piercing,,75%,25%,1,+1,75% Armor,1 Stun/2 Pow,1 Bleed/2 major,-1 Ref/2 Major'
    ]
        .reduce((memo, value, index) => {
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
        let name = `${size.Size} ${type.name.toLowerCase()}`;
        let params = _.extend({}, type, {
            skill: 'Hand Weapons',
            leverage: size[type.type],
            name: name
        });

        let weapon = new Weapon(params);
        weapons[weapon.name] = weapon;
    }
}
