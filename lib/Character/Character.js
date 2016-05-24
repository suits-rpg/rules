import CharacterSkill from './CharacterSkill';
import _ from 'lodash';
import {MCP} from 'mcp';
import CharacterBase from './Base';
import weaponsMixin from './WeaponsMixin';

import * as attrs from './attributes';

export default class Character extends weaponsMixin(CharacterBase) {

    /* ------------ CONSTRUCTOR, INITIALIZERS -------------- */

    constructor(props) {
        if (!props) {
            props = {};
        }
        super(props);

        this._initTeam(props.team);
        this._initSkills(props.skills);
        this._initState();
    }

    _initTeam(team) {
        this.team = team;
    }

    lossLimit(damageType) {
        let out;

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

            default:
                out = this.body;
        }
        return out;
    }

    impact(amount, weapon) {
        const limit = this.lossLimit(weapon.damageType);
        let wounds = Math.max(amount - limit, 0);

        if (weapon.blunt) {
            wounds = Math.round(wounds / 2);
        }
        const shock = amount - wounds;
        //  console.log('impact to ', this.name, ':', this.body, limit, ', type:', weapon.damageType, ', amount: ', amount, ', shock:', shock, ', wounds ', wounds);
        this.shock = this.shock + shock;
        this.wounds = this.wounds + wounds;

        if (this.wounds > this.body) {
            this.vitality.die();
        } else if (this.loss > 2 * this.body) {
            this.vitality.knockOut();
        } else if (this.loss > this.body && this.vitality.mcpState === 'awake') {
            this.vitality.daze();
        }
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
        this.vitality = new MCP()
            .mcpWhen('wake')
            .mcpStateIs('awake');
        this.vitality
            .mcpWhen('knockOut')
            .mcpStateIs('knocked out');
        this.vitality
            .mcpWhen('die')
            .mcpStateIs('dead');
        this.vitality
            .mcpFromState('awake')
            .mcpWhen('daze')
            .mcpStateIs('dazed');
        this.vitality
            .mcpFromState('dazed')
            .mcpWhen('undaze')
            .mcpStateIs('awake');

        this.vitality.mcpWatchState('knocked out', () => this._state.inactive());
        this.vitality.mcpWatchState('dead', () => this._state.inactive());

        this.vitality.wake();

        this.blueChips = 0;
        this.whiteChips = 0;
        this.shock = 0;
        this.wounds = 0;
    }

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
        this.blueChips = 1;
        this.whiteChips = 1;
    }

    updateChipsPassive() {
        this.whiteChips = 2;
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
        return this.vitality.mcpState;
    }

    get loss() {
        return this.wounds + this.shock;
    }

    knockOut() {
        this.vitality.knockOut();
        return this;
    }

    die() {
        this.health.die();
    }

    ko() {
        this.health.ko();
    }

    set shock(val) {
        this._shock = val;
    }

    get shock() {
        return this._shock;
    }

    set wounds(val) {
        this._wounds = val;
    }

    get wounds() {
        return this._wounds;
    }

    /* ----------------- NAME, ATTRS --------------------- */

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
