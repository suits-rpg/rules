let nameInc = 0;

import CharacterSkill from './CharacterSkill';
import * as attrs from './attributes';
import _ from 'lodash';
import {MCP} from 'mcp';

const nameStub = () => 'unnamed ' + (nameInc++);

export default class Character {
  constructor (props) {
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

    /**
     * state is about "can I act/be attacked/etc.
     * it doesn't care why a character is out.
     */
    this.state = new MCP()
      .mcpWhen('start')
      .mcpStateIs('idle')
      .mcpWhen('out')
      .mcpStateIs('out')
      .mcpWhen('engage')
      .mcpStateIs('engaged');

    /**
     * health is about what you'd think --
     * being alive, KO or dead.
     */
    this.health = new MCP()
      .mcpWhen('active')
      .mcpStateIs('active');
    this.health
      .mcpWhen('ko')
      .mcpStateIs('ko');
    this.health
      .mcpWhen('die')
      .mcpStateIs('dead');
    this.health
      .mcpWatchState('ko', () => this.state.out());
      .mcpWatchState('dead', () => this.state.out())
  }

  die () {
    this.health.die();
  }

  ko () {
    this.health.ko();
  }

  /**
   *
   * @returns {Team}
   */
  get team () {
    return this._team;
  }

  /**
   * @param val {Team}
   */
  set team (val) {
    this._team = val;
    if (val) {
      val.add(this);
    }
  }

  get teamName () {
    return this.team ? this.team.name : '';
  }

  /**
   *
   * @returns {String}
   */
  get name () {
    return this._name;
  }

  /**
   * Name must be a nonempty string.
   * At this point characters cannot be renamed.
   * @param val {String}
   */
  set name (val) {
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

  get body () {
    return this._attrs.body;
  }

  set body (val) {
    this._attrs.body = val;
  }

  get mind () {
    return this._attrs.mind;
  }

  set mind (val) {
    this._attrs.mind = val;
  }

  get reflexes () {
    return this._attrs.reflexes;
  }

  set reflexes (val) {
    this._attrs.reflexes = val;
  }

  get spirit () {
    return this._attrs.spirit;
  }

  set spirit (val) {
    this._attrs.spirit = val;
  }

  addSkill (alpha, beta, gamma) {
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

  skillRank (name) {
    if (!this._skills[name]) {
      return 0;
    }

    return this._skills[name].rank;
  }

  toString () {
    let prefix = this.team ? `[${this.team.toString()}]` : '';
    return `${prefix}:${this.name}`;
  }
}
