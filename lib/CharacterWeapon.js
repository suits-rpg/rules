
export default class CharacterWeapon {
    constructor (char, weapon) {
        this._char = char;
        this._weapon = weapon;
        this.ready = true;
    }

    /**
     *
     * @returns {Character}
     */
    get char() {
        return this._char;
    }

    /**
     *
     * @returns {Weapon}
     */
    get weapon() {
        return this._weapon;
    }

    get rank () {
        var skillName = this.weapon.skill;
        return this.char.skillRank(skillName);
    }
    
    get name () {
        return this.weapon ? this.weapon.name : '';
    }

    set ready(val) {
        this._ready = val;
    }

    get ready() {
        return this._ready;
    }
}
