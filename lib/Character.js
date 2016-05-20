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

        this.initTeam(props.team);
        this._initSkills(props.skills);
        this._initWeapons(props.weapons);

        this._initState();
    }

    initTeam(team) {
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

        this.blueChips = 1;
        this.whiteChips = 1;
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
            console.log('character doesn\'t have skil', name);
            return 0;
        }

        console.log('getting skill', name);
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
            throw new Error(`${char.name} cannot act -- no blue chips`);
        }
        return this.passiveDraw(deck);
    }

    passiveDraw(deck) {
        const total = Math.min(1, this.blueChips + this.whiteChips);
        const hand = deck.draw(total);
        --this.blueChips;
        --this.whiteChips;
        return hand;
    }

    /**
     * Chips are used to track whether or not you have acted on your turn. 
     * 
     *  - If you have both your chips when your turn starts, you can act with 2 cards. 
     *  - If you have one blue chip, you can act with 1 card.
     *  - If you do not have a blue chip, you cannot act.
     *  
     *  You get (via updateChips) up to two chips at the end of your turn,
     *  whether or not you have acted. 
     *  
     *  You can have zero or 1 blue chip and zero or 1 white chip. 
     */
    
    updateChips() {
        ++this.blueChips;
        ++this.whiteChips;
    }

    /**
     * A token that can be used defensively or offensively.
     * @param val {int}
     */
    set whiteChips(val) {
        if (!val) {
            val = 0;
        }
        this._whiteChips = Math.min(1, Math.max(0, val));
    }

    /**
     * @returns {int}
     */
    get whiteChips() {
        return this._whiteChips;
    }

    /**
     *
     * @param val {int}
     */
    set blueChips(val) {
        if (!val) val = 0;
        this._blueChips = Math.min(1, Math.max(0, val));
    }

    /**
     *
     * @returns {int}
     */
    get blueChips() {
        return this._blueChips;
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
