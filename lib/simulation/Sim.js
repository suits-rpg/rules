import _ from 'lodash';

import Teams from './Teams';
import Initiative from './Initiative';
import EventEmitter from 'eventemitter2';

import Attack from './Attack';

class Sim {
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
        if (!this.hasTarget(char)) {
            this.setTarget(char);
        }
        return this.hasTarget(char);
    }

    /**
     * @param characterOrder {CharacterOrder}
     */
    act(characterOrder) {
        let char = characterOrder.char;

        this.emit('act.start', {char: char});
        if (char.health === 'dazed') {
            this._recover(char);
        } else { /* eslint no-lonely-if:0 */
            switch (char.state) {
                case 'canAct':
                    // character can act
                    if (!char.currentWeapon) { // @TODO: only need weapon if there is a target?
                        if (!this._chooseWeapon(char)) {
                            this.emit('act.noop', {char: char, reason: 'no weapon'});
                            return;
                        }
                    }

                    if (!char.currentWeapon.ready) {
                        char.currentWeapon.readyWeapon();
                        this.emit('act.readyWeapon', {char: char, weapon: char.currentWeapon.name});
                    } else if (this._ensureTarget(char)) {
                        this._resolveAttack(characterOrder);
                        if (char.state === 'acted') {
                            char.resetAction();
                        }
                    } else {
                        this.emit('act.noop', {char: char, reason: 'no target'});
                    }
                    break;

                case 'inactive':
                    this.emit('act.noop', {char: char, reason: 'inactive'});
                    break;

                case 'acted':
                    this.emit('act.noop', {char: char, reason: 'already acted'});
                    char.resetAction();
                    break;

                default:
                // noop
            }
        }

        this.emit('act.end', {
            char: char
        });
    }

    /**
     *
     * @param characterOrder {CharacterOrder}
     * @private
     */
    _resolveAttack(characterOrder) {
        const attack = new Attack(characterOrder, this);
        const summary = attack.resolve();
        characterOrder.char.act();
        this.emit('attack',  summary);
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
                char: char,
                shock: toRecover
            });

            if (toRecover) {
                char.shock = Math.max(0, char.shock - toRecover);
                if (char.loss <= char.body || char.shock < 1) {
                    char.undaze();
                }
            }
        }
    }

    /**
     *
     * @param char {Character}
     * @returns {boolean}
     * @private
     */
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
     * @return boolean
     */
    hasTarget(char) {
        return (char.target && char.target.state !== 'inactive');
    }

    /**
     *
     * @param char {Character}
     * @private
     */
    setTarget(char) {
        let enemies = char.team.enemies();
        let enemy = null;

        if (enemies.length) {
            enemies = enemies.filter(e => (!(e.state === 'inactive')));
            enemy = enemies[this.deck.card().rank() % enemies.length];
        }

        this.emit('setTarget', {char: char, target: enemy ? enemy : {}});
        char.target = enemy;
    }
}
_.extend(Sim.prototype, EventEmitter.prototype);

export default Sim;
