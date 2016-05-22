let nameInc = 0;

import CharacterSkill from './CharacterSkill';
import CharacterWeapon from './CharacterWeapon';
import * as attrs from './attributes';
import _ from 'lodash';
import {MCP} from 'mcp';

const nameStub = () => 'unnamed ' + (nameInc++);

export default class Character {

    /* ------------ CONSTRUCTOR, INITIALIZERS -------------- */

    constructor(props) {
        if (!props) {
            props = {};
        }
        this._initName(props.name);
        this._initAttrs(props);

        this._initTeam(props.team);
        this._initSkills(props.skills);
        this._initWeapons(props.weapons);

        this._initState();
    }

    _initTeam(team) {
        this.team = team;
    }

    _initName(name) {
        this.name = name || nameStub();
    }

    _initAttrs(props) {
        this._attrs = {};
        for (let attr of _.values(attrs)) {
            this[attr] = props.hasOwnProperty(attr) ? props[attr] : 5;
        }
    }

    _initWeapons(weapons) {
        this._weapons = [];
        if (weapons) {
            for (let weapon of weapons) {
                this.addWeapon(weapon);
            }
        }
    }

    _initState() {
        this.target = null;

        /**
         * state is about the characters' ability to act;
         * it doesn't describe WHY the character can/cannot act.
         */
        this._state = new MCP()
            .mcpWhen('start')
            .mcpStateIs('ready')
            .mcpWhen('inactive')
            .mcpStateIs('inactive')
            .mcpFromState('ready').mcpWhen('unready').mcpStateIs('unready')
            .mcpFromState('unready').mcpWhen('ready').mcpStateIs('ready');
        this._state.start();

        /**
         * health is about what you'd think --
         * being alive, KO or dead.
         */
        this._health = new MCP()
            .mcpWhen('wake')
            .mcpStateIs('awake');
        this._health
            .mcpWhen('knockOut')
            .mcpStateIs('knocked out');
        this._health
            .mcpWhen('die')
            .mcpStateIs('dead');
        this._health.mcpWatchState('knocked out', () => this._state.inactive());
        this._health.mcpWatchState('dead', () => this._state.inactive());

        this._health.wake();

        this.blueChips = 0;
        this.whiteChips = 0;
        this.shock = 0;
        this.wounds = 0;
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

    lossLimit(damageType) {
        let out = this.body;
        switch (damageType.toLowerCase()) {
            case 'hard':
                out = this.body;
                break;
            case 'cutting':
                out = Math.round(this.body * 0.75);
                break;

            case 'piercing':
                out = Math.round(this.body * 0.5);
                break;
        }
        return out;
    }

    impact(amount, weapon) {
        const limit = this.lossLimit(weapon.damageType);
        let wounds = Math.max(amount - limit, 0);
        if (weapon.blunt) {
            wounds = Math.round(wounds / 2);
        }
        this.shock += amount - wounds;
        this.wounds += wounds;
    }

    /* ------------------- SKILLS --------------------- */

    _initSkills(skills) {
        this._skills = {};
        if (skills) {
            for (let skill of skills) {
                this.addSkill(skill);
            }
        }
    }

    get skills() {
        const skills = {};
        for (let p in this._skills) {
            if (this._skills.hasOwnProperty(p)) {
                let skill = this._skills[p];
                skills[skill.name] = skill.rank;
            }
        }
        return skills;
    }

    skillRank(name) {
        if (!this._skills[name]) {
            return 0;
        }

        return this._skills[name].rank;
    }

    addSkill(alpha, beta, gamma) {
        let name;
        let attr;
        let level;

        if (typeof alpha === 'object') {
            name = alpha.name;
            attr = alpha.attr;
            level = alpha.level || 0;
        } else {
            name = alpha;
            attr = beta;
            level = gamma || 0;
        }

        this._skills[name] = new CharacterSkill(this, name, attr, level);
    }

    /* --------------------- TARGET, TEAM --------------------- */

    /**
     *
     * @param val {Character}
     */
    set target(val) {
        this._target = val;
    }

    get targetName() {
        return this.target ? this.target.name : '';
    }

    /**
     *
     * @returns {Character}
     */
    get target() {
        return this._target;
    }

    /**
     *
     * @returns {Team}
     */
    get team() {
        return this._team;
    }

    /**
     * @param val {Team}
     */
    set team(val) {
        this._team = val;
        if (val) {
            val.add(this);
        }
    }

    get teamName() {
        return this.team ? this.team.name : '';
    }

    /* --------------------- STATE, HEALTH ------------------- */

    /**
     * make an active action.
     * @param deck {Deck}
     * @returns {Hand}
     */
    activeDraw(deck) {
        if (this.blueChips < 1) {
            throw new Error(`${this.name} cannot act -- no blue chips`);
        }
        return this.passiveDraw(deck);
    }

    passiveDraw(deck) {
        const hand = deck.draw(Math.max(1, this.chips));
        --this.blueChips;
        --this.whiteChips;
        return hand;
    }

    /**
     * Chips are used to track whether or not you have acted on your turn.
     * You can have at most one blue chip and at most two chips.
     * So you can have:
     *
     *  - no chips
     *  - one Blue chip
     *  - one Blue chip and one White chip
     *  - two White chips
     *
     *  white chips are represented by false in the _chips array;
     *  blue chips are represented by true in the _chips array;
     */

    /**
     * this is the normal beginning of turn initialization.
     */
    updateChips() {
        this.blueChips = this.blueChips + 1;
        this.whiteChips = this.whiteChips + 1;
        this.cleanChips();
    }

    updateChipsPassive() {
        this.whiteChips = this.whiteChips + 2;
        this.cleanChips();
    }

    set blueChips(val) {
        this._blueChips = Math.max(0, val);
    }

    get blueChips() {
        return this._blueChips;
    }

    set whiteChips(val) {
        this._whiteChips = Math.max(0, val);
    }

    get whiteChips() {
        return this._whiteChips;
    }

    get chips() {
        return this.blueChips + this.whiteChips;
    }

    cleanChips() {
        if (this.blueChips > 1) {
            this.whiteChips = this.whiteChips + this.blueChips;
            this.blueChips = 0;
        }
        while (this.chips > 2) {
            this.whiteChips = this.whiteChips - 1;
        }
    }

    get state() {
        return this._state.mcpState;
    }

    get health() {
        return this._health.mcpState;
    }

    knockOut() {
        this._health.knockOut();
        return this;
    }

    die() {
        this.health.die();
    }

    ko() {
        this.health.ko();
    }

    /* ----------------- NAME, ATTRS --------------------- */

    /**
     *
     * @returns {String}
     */
    get name() {
        return this._name;
    }

    /**
     * Name must be a nonempty string.
     * At this point characters cannot be renamed.
     * @param val {String}
     */
    set name(val) {
        if (!val) {
            throw new Error('name cannot be empty');
        }
        if (typeof val !== 'string') {
            throw new Error("non string passed to name");
        }
        if (this._name) {
            throw new Error('cannot rename character');
        }
        this._name = val;
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

    get reflexes() {
        return this._attrs.reflexes;
    }

    set reflexes(val) {
        this._attrs.reflexes = val;
    }

    get spirit() {
        return this._attrs.spirit;
    }

    set spirit(val) {
        this._attrs.spirit = val;
    }

    toString() {
        let prefix = this.team ? `[${this.team.toString()}]` : '';
        return `${prefix}:${this.name}`;
    }

    toJSON() {
        const out = {};

        for (var prop of 'name,mind,body,reflexes,spirit,health,state'.split(',')) {
            out[prop] = this[prop];
        }
        out.team = this.teamName;
        out.target = this.targetName;
        // @TODO: reflect skills, items.
        return out;
    }
}
