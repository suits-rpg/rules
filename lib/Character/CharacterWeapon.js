export default class CharacterWeapon {
    constructor(char, weapon) {
        this._char = char;
        this._weapon = weapon;
        this.ready = true;
    }

    /**
     * the average power(damage) the weapon does
     */
    get basePower() {
        const leverage = this.weapon.leverage;
        let power = this.weapon.power;
        if (leverage) {
            power = Math.round(power + this.char.body * leverage);
        }

        return power;
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

    get rank() {
        var skillName = this.weapon.skill;
        // note -- this is dependent on the skills mixin 
        return this.char.skillRank(skillName);
    }

    get name() {
        return this.weapon ? this.weapon.name : '';
    }

    set ready(val) {
        this._ready = val;
    }

    get ready() {
        return this._ready;
    }

    toString() {
        return `char ${this.char.toString()} weapon ${this.weapon ? this.weapon.name : '(none)'}`;
    }

    get damageType() {
        return this.weapon.damageType;
    }
}
