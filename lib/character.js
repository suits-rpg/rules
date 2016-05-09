let nameInc = 0;

import CharacterSkill from './CharacterSkill';
import * as attrs from './attributes';
import _ from 'lodash';

const nameStub = () => 'unnamed ' + (nameInc++);

export default class Character {
    constructor(props) {
        if (!props) {
            props = {};
        }

        this.name = props.name || nameStub();

        this._attrs = {};
        for (let attr of _.values(attrs)) {
            this[attr] = props.hasOwnProperty(attr) ? props[attr] : 5;
        }

        this._skills = {};
        if (props.skills) {
            for (let skill of props.skills) {
                this.addSkill(skill);
            }
        }
    }

    get body() {
        return this._attrs.body;
    }

    set body(val) {
        this._attrs.body = val;
    }

    get mind() {
        return this._attrs.mind;
    }

    set mind(val) {
        this._attrs.mind = val;
    }

    get speed() {
        return this._attrs.speed;
    }

    set speed(val) {
        this._attrs.speed = val;
    }

    get will() {
        return this._attrs.will;
    }

    set will(val) {
        this._attrs.will = val;
    }

    addSkill(alpha, beta, gamma) {
        let name;
        let attr;
        let levels;

        if (typeof alpha === 'object') {
            name = alpha.name;
            attr = alpha.attr;
            levels = alpha.levels || 0;
        } else {
            name = alpha;
            attr = beta;
            levels = gamma || 0;
        }

        this._skills[name] = new CharacterSkill(this, name, attr, levels);
    }

    skillRank(name) {
        if (!this._skills[name]) {
            return 0;
        }

        return this._skills[name].rank;
    }
}
