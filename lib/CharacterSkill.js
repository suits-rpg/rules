import _ from 'lodash';
import * as attrs from './attributes';

export default class CharacterSkill {
    constructor(character, name, attr, level) {
        this.character = character;
        this.name = name;
        this.attr = attr;
        this.level = level;
    }

    set character(val) {
        this._character = val;
    }

    get character() {
        return this._character;
    }

    set name(val) {
        this._name = val;
    }

    get name() {
        return this._name;
    }

    set attr(val) {
        if (!_.includes(attrs, val)) {
            throw new Error('attempt to set non-existant attribute ' + val);
        }
        this._attr = val;
    }

    get attr() {
        return this._attr;
    }

    set level(val) {
        if (!_.isNumber(val)) {
            throw new Error('attempt to set level to bad value ' + val);
        }
        this._level = val;
    }

    get level() {
        return this._level;
    }

    get base() {
        return this.character[this.attr];
    }

    get rank() {
        return this.base + this.level;
    }
}
