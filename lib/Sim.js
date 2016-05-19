import _ from 'lodash';

import Teams from './Teams';
import Character from './Character';
import Initiative from './Initiative';
import EventEmitter from 'eventemitter2';
import {Deck} from './Deck';

export class Attack {
    constructor(char, target, deck) {
        this._char = char;
        this._target = target;
        this._deck = deck;
    }

    /**
     *
     * @returns {Deck}
     */
    get deck() {
        return this._deck;
    }

    /**
     * 
     * @returns {Character}
     */
    get char() {
        return this._char;
    }

    resolve() {
        const charSkill = this.char.currentWeapon.rank;
        const targetSkill = this.char.target.currentWeapon ? 
            this.char.target.currentWeapon.rank : this.char.reflexes;
        
        const charHand = this.deck.draw(2);
        charHand.bestForSkill(charSkill);
        
        const targethand = this.deck.draw(2);
        targethand.bestForSkill(charSkill);
    }
}


export class Sim {

    constructor(characters, teams, deck) {
        EventEmitter.call(this, {wildcard: true});
        this._deck = deck || new Deck(2);
        this._init = new Initiative(deck);
        this._chars = characters || [];
        for (var char of this.characters) {
            this.initative.addCharacter(char);
        }
        this.teams = teams || new Teams();

        this._round = 0;
    }

    addChar(props, team) {
        props.team = this.teams.getTeam(team || props.team);
        this._chars.push(new Character(props));
    }

    nextRound() {
        ++this._round;
    }

    get round() {
        return this._round;
    }

    /**
     *
     * @returns {Initiative}
     */

    get initative() {
        return this._init;
    }

    get currentOrder() {
        return this.initative.order(this.round);
    }

    /**
     *
     * @returns {Deck}
     */
    get deck() {
        return this._deck;
    }

    /**
     *
     * @returns {Array.<Character>}
     */
    get characters() {
        return this._chars.slice(0);
    }

    doRound() {
        const order = this.initative.order(this.round);
        this.emit('round.start', this.round);
        for (let item of order) {
            this.act(item);
        }
        this.emit('round.end', this.round);
        this.nextRound();
    }

    _prepCharToAttack(char) {
        if (!this._hasTarget(char)) {
            this._setTarget(char);
        }
        if (!char.currentWeapon) { // @TODO: only need weapon if there is a target?
            this._chooseWeapon(char);
        }

        /**
         * the target needs a weapon for self defense
         */
        if (char.target) {
            this._chooseWeapon(char.target);
        }
    }

    act(orderData) {
        let char = orderData.char;

        this.emit('act.start', {char: char.name});
        if (orderData.char.state === 'ready') {
            this._prepCharToAttack(char);
            if (this._hasTarget(char)) {
                this._resolveAttack(char);
            }
        }
        this.emit('act.end', {char: char.name});
    }

    _resolveAttack(char) {
        var attack = new Attack(char, char.enemy);
        attack.resolve();
    }

    _chooseWeapon(char) {
        char.currentWeapon = char.weapons[0];
        this.emit('char.chooseWeapon', char.currentWeapon.weapon ? char.currentWeapon.name : '');
    }

    /**
     *
     * @param char {Character}
     * @private
     */
    _hasTarget(char) {
        return (char.target && char.target.state === 'ready');
    }

    /**
     *
     * @param char {Character}
     * @private
     */
    _setTarget(char) {
        let myTeam = char.teamName;

        var enemies = _(this.characters).map((memo, otherChar) => {
            if (otherChar.state === 'ready' && otherChar.teamName !== myTeam) {
                memo.push(otherChar);
            }
            return memo;
        }, []).value();

        let enemy = null;

        if (enemies.length) {
            enemy = enemies[this.deck.oneRank() % enemies.length];
        }

        this.emit('setTarget', {char: char.name, target: enemy ? enemy.name : ''});
        char.target = enemy;
    }
}

_.extend(Sim.prototype, EventEmitter.prototype);
