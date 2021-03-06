export default class CharacterWeapon {
    constructor(char, weapon) {
        this._char = char;
        this._weapon = weapon;
        this._unready = 0;
        this.reset();
    }

    reset() {
        this.uses = 1;
    }

    set uses(val) {
        this._uses = val;
    }

    get uses() {
        return this._uses;
    }

    canUse() {
        return this.uses > 0;
    }

    use() {
        let out = false;
        if (this.canUse()) {
            this.uses = this.uses - 1;
            out = true;
        }
        return out;
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

    /**
     *
     * @returns {string}
     */
    get name() {
        return this.weapon ? this.weapon.name : '';
    }

    /**
     * number of turns of readying required before
     * the weapon can be used
     * @returns {int}
     */
    get unready() {
        return this._unready;
    }

    get ready() {
        return this.unready < 1;
    }

    /**
     *
     * @returns {int}
     */
    get slow() {
        return this.weapon.slow;
    }

    readyWeapon() {
        if (this._unready > 0) {
            --this._unready;
        }
    }

    useWeapon() {
        this._unready += this.slow;
    }

    toString() {
        return `char ${this.char.toString()} weapon ${this.weapon ? this.weapon.name : '(none)'}`;
    }

    get damageType() {
        return this.weapon.damageType;
    }
}
