import _ from 'lodash';

import Teams from './Teams';
import Character from './Character';
import Initiative from './Initiative';
import EventEmitter from 'eventemitter2';
import {Deck} from './Deck';

const cs = (data) => {
    const out = {};

    for (let p in data) {
        if (data.hasOwnProperty(p)) {
            let value = data[p];
            if (p === 'cards') {
                value = value.map(c => c.toString());
            }
            out[p] = value;
        }
    }

    return out;
};

export class Attack {
    /**
     *
     * @param characterOrder {CharacterOrder}
     * @param initiative {Initiative}
     */
    constructor(characterOrder, initiative) {
        this._order = characterOrder;
        this._deck = initiative.deck;

        if (!(this.char && this.target && this.deck)) {
            throw new Error('bad Attack constructor: ' + this.toString());
        }
    }

    toString() {
        const char = this.char ? this.char.name : '(missing)';
        const target = this.target ? this.target.name : '(missing)';
        const deck = this.deck ? `${this.deck.cardCount} deck card with ${this.deck.cardsLeft} cards left` : '(missing)';
        return `Attack (${char} ==> ${target} with ${deck}`;
    }

    /**
     *
     * @returns {CharacterOrder}
     */
    get order() {
        return this._order;
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
        return this.order.char;
    }

    /**
     *
     * @returns {Character}
     */
    get target() {
        return this.char.target;
    }

    hit(fromChar, toChar) {
        // @TODO: resolve effect;
        return `${fromChar.name} hits ${toChar.name}`;
    }

    resolve() {
        // @TODO: allow for running out of deck?

        const charSkill = this.char.currentWeapon ?
            this.char.currentWeapon.rank : this.char.reflexes;
        const targetSkill = this.target.currentWeapon ?
            this.target.currentWeapon.rank : this.target.reflexes;

        const cHand = this.char.activeDraw(this.deck);
        let charDraw = cHand.bestForSkill(charSkill);

        const tHand = this.target.passiveDraw(this.deck);
        let targetDraw = tHand.bestForSkill(targetSkill);

        let result = '?';
        if (charDraw.result === 'overdraw') {
            result = targetDraw.result === 'overdraw' ?
                `overdraw tie between ${this.char.name} and ${this.target.name}` :
                this.hit(this.target, this.char);
        } else if (targetDraw.result === 'overdraw') {
            result = this.hit(this.char, this.target);
        } else if (charDraw.result === targetDraw.result) {
            result = `tie between ${this.char.name} and ${this.target.name}`;
        } else if (charDraw.result > targetDraw.result) {
            result = this.hit(this.char, this.target); // character hits target
        } else {
            result = this.hit(this.target, this.char); // target hits character;
        }

        charDraw = cs(charDraw);
        targetDraw = cs(targetDraw);

        cHand.removeAll();
        tHand.removeAll();

        return {
            actor: this.char.name,
            result: result,
            charDraw: charDraw,
            targetDraw: targetDraw
        };
    }
}


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

        if (char.blueChips > 0) { // character can actively act;
            // will be false if they passively engaged another character on their act.
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
            this.emit('act.noop', {char: char.name})
        }
        char.updateChips();
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
            if (otherChar.teamName === myTeam) {
                return memo;
            } else if (otherChar.state === 'inactive') {
                return memo;
            } else {
                memo.push(otherChar);
                return memo;
            }
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
