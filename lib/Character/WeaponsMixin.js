import CharacterWeapon from './CharacterWeapon';

export default (baseClass) => {
    return class WeaponsMixedIn extends baseClass {

        constructor(props) {
            if (!props) {
                props = {};
            }
            super(props);
            this._initWeapons(props.weapons);
        }

        _initWeapons(weapons) {
            this._weapons = [];
            if (weapons) {
                for (let weapon of weapons) {
                    this.addWeapon(weapon);
                }
            }
        }

        /* ------------- WEAPONS ---------------- */

        addWeapon(weapon) {
            this._weapons.push(new CharacterWeapon(this, weapon));
        }

        get weapons() {
            return this._weapons;
        }

        set currentWeapon(val) {
            this._currentWeapon = val;
        }

        get currentWeapon() {
            return this._currentWeapon;
        }
    };
}
