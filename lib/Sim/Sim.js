import _ from 'lodash';

import Teams from './Teams';
import Initiative from './Initiative';
import EventEmitter from 'eventemitter2';

import Attack from './Attack';

export class Sim {
    constructor(characters, teams, deck) {
        EventEmitter.call(this, {wildcard: true});
        this._deck = deck;
        this._init = new Initiative(deck);
        this._chars = characters || [];
        for (var char of this.characters) {
            this.init.addCharacter(char);
        }
        this.teams = teams || new Teams();

        this._round = 0;
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

    _ensureTarget(char) {
        if (!this._hasTarget(char)) {
            this._setTarget(char);
        }
        return this._hasTarget(char);
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
        } else { /* eslint no-lonely-if:0 */
            if (char.state === 'ready') {
                // character can actively act
                if (!char.currentWeapon) { // @TODO: only need weapon if there is a target?
                    if (!this._chooseWeapon(char)) {
                        this.emit('act.noop', {char: char.name, reason: 'no weapon'});
                        return;
                    }
                }
                if (char.currentWeapon.canUse) {
                    if (!char.currentWeapon.ready) {
                        char.currentWeapon.readyWeapon();
                        this.emit('act.readyWeapon', {char: char.name, weapon: char.currentWeapon.name});
                    } else if (this._ensureTarget(char)) {
                        this._resolveAttack(characterOrder);
                    } else {
                        this.emit('act.noop', {char: char.name, reason: 'no target'});
                    }
                } else {
                    this.emit('act.noop', {char: char.name, readon: 'weapon used'});
                }
                char.currentWeapon.reset();
            } else {
                this.emit('act.noop', {char: char.name, reason: 'unready'});
            }
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
        if (char.health === 'dazed') {

            var rank = this.deck.card().rank();
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
                    char.undaze();
                }
            }
        }
    }

    _chooseWeapon(char) {
        char.currentWeapon = char.weapons[0];
        let out = false;
        if (char.currentWeapon) {
            this.emit('char.chooseWeapon', char.currentWeapon.weapon ? char.currentWeapon.name : '');
            out = true;
        }
        return out;
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
            enemy = enemies[this.deck.card().rank() % enemies.length];
        }

        this.emit('setTarget', {char: char.name, target: enemy ? enemy.name : ''});
        char.target = enemy;
    }
}

_
    .extend(Sim

            .prototype
        ,
        EventEmitter
            .prototype
    )
;
