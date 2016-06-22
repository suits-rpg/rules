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
        this.armorPiercing = params.ap || 0;
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

    set armorPiercing(val) {
        this._armorPiercing = val;
    }

    get armorPiercing() {
        return this._armorPiercing;
    }
}

/** Hand Weapons */

const sizes = require('./../data/json/leverage-Leverage.json')
    .map(size => {
        for (let prop in size) {
            if (size.hasOwnProperty(prop)) {
                size[prop] = percent(size[prop]);
            }
        }
        return size;
    });

const weaponTypes = require('./../data/json/weapons-Weapons.json')
    .map(weapon => {
        let out = {};
        for (let prop in weapon) {
            const lcProp = prop.toLowerCase();
            if (weapon.hasOwnProperty(prop)) {
                out[lcProp] = percent(weapon[prop]);
            }
        }
        return out;
    });

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
