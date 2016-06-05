import CharacterWeapon from './CharacterWeapon';

export default baseClass => {
    return class WeaponsMixedIn extends baseClass {

        constructor(props) {
            if (!props) {
                props = {};
            }
            super(props);
            this._initWeapons(props.weapons);
            this._initArmor(props.armor);
        }

        _initWeapons(weapons) {
            this._weapons = [];
            if (weapons) {
                for (let weapon of weapons) {
                    this.addWeapon(weapon);
                }
            }
            if (this.weapons.length === 1) {
                this.currentWeapon = this.weapons[0];
            }
        }

        _initArmor(armor) {
            this.armor = armor || [];
            if(this.armor.length === 1) {
                this.currentArmor = this.armor[0];
            }
        }

        /* ------------- WEAPONS ---------------- */

        addWeapon(weapon) {
            this._weapons.push(new CharacterWeapon(this, weapon));
        }

        get weapons() {
            return this._weapons;
        }

        /**
         * @param val {CharacterWeapon}
         */
        set currentWeapon(val) {
            this._currentWeapon = val;
        }

        /**
         *
         * @returns {CharacterWeapon}
         */
        get currentWeapon() {
            return this._currentWeapon;
        }

        /**
         * armor is an array of all owned suits of armor.
         *
         * @param val {[Armor]}
         */
        set armor(val) {
            this._armor = val || [];
        }

        /**
         *
         * @returns {Armor[]}
         */
        get armor() {
            return this._armor;
        }

        /**
         *
         * @param val {Armor}
         */
        set currentArmor(val) {
            this._currentArmor = val;
        }

        /**
         *
         * @returns {Armor}
         */
        get currentArmor() {
            return this._currentArmor;
        }
    };
};
