import _ from 'lodash';

import Teams from './Teams';
import Character from './../Character/Character';
import Initiative from './Initiative';
import EventEmitter from 'eventemitter2';
import {Deck} from './../../unused/Deck';

import Attack from './Attack';

export class Sim {
    constructor(characters, teams, deck) {
        EventEmitter.call(this, {wildcard: true});
        this._deck = deck || new Deck(2);
        this._init = new Initiative(deck);
        this._chars = characters || [];
        for (var char of this.characters) {
            this.init.addCharacter(char);
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

    get init() {
        return this._init;
    }

    get currentOrder() {
        return this.init.order(this.round);
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
        const order = this.init.order(this.round);
        this.emit('round.start', this.round);
        this.init.startRound(this.round);
        for (let characterOrder of order) {
            this.act(characterOrder);
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

    /**
     *
     * @param characterOrder {CharacterOrder}
     */
    act(characterOrder) {
        let char = characterOrder.char;

        this.emit('act.start', {char: char.name});

        // will be false if they passively engaged another character on their act.
        if (char.health === 'dazed') {
            this._recover(char);
        } else if (char.blueChips > 0) { // character can actively act
            if (char.state === 'ready') {
                // this is a weapon state; will be false after a slow weapon is used.

                this._prepCharToAttack(char);
                if (this._hasTarget(char)) {
                    this._resolveAttack(characterOrder);
                } else {
                    this.emit('act.notarget', {char: char.name});
                }
            } else if (char.state === 'unready') {
                char.ready();
                this.emit('act.ready', {char: char.name});
            }
        } else {
            this.emit('act.noop', {char: char.name});
        }
        this.emit('act.end', {char: char.name});
    }

    /**
     *
     * @param characterOrder {CharacterOrder}
     * @private
     */
    _resolveAttack(characterOrder) {
        const attack = new Attack(characterOrder, this);
        const summary = attack.resolve();
        this.emit('attack', summary);
    }

    _recover(char) {
        console.log('character ', char.name, 'recovering');
        if (char.health === 'dazed') {

            var rank = this.deck.oneRank();
            var toRecover = 0;
            if (char.spirit >= rank) {
                toRecover = 2;
            } else if (char.spirit * 2 >= rank) {
                toRecover = 1;
            }
            
            this.emit('recover', {
                char: char.name,
                shock: toRecover
            });

            if (toRecover) {
                char.shock = Math.max(0, char.shock - toRecover);
                if (char.loss <= 2 * char.body || char.shock < 1) {
                    char.vitality.undaze();
                }
            }
        }
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
        var enemies = this.characters.reduce((memo, otherChar) => {
            if (!(otherChar.teamName === myTeam || otherChar.state === 'inactive')) {
                memo.push(otherChar);
            }
            return memo;
        }, []);

        let enemy = null;

        if (enemies.length) {
            enemy = enemies[this.deck.oneRank() % enemies.length];
        }

        this.emit('setTarget', {char: char.name, target: enemy ? enemy.name : ''});
        char.target = enemy;
    }
}

_.extend(Sim.prototype, EventEmitter.prototype);
