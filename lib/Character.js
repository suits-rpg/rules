let nameInc = 0;

import CharacterSkill from './CharacterSkill';
import * as attrs from './attributes';
import _ from 'lodash';
import {MCP} from 'mcp';

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

        if (props.team) {
            this.team = props.team;
        }

        this.initState();

        this.initHealth();

        this.target = null;
    }

    initState() {
        /**
         * state is about the characters' ability to act;
         * it doesn't describe WHY the character can/cannot act.
         */
        this._state = new MCP()
            .mcpWhen('start')
            .mcpStateIs('ready')
            .mcpWhen('inactive')
            .mcpStateIs('inactive');
        this._state.start();
    }

    initHealth() {
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
    }

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
