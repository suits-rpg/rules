import bestForSkill from '../deck/bestForSkill';

export default class Attack {
    /**
     *
     * @param characterOrder {CharacterOrder}
     * @param sim {Sim}
     */
    constructor(characterOrder, sim) {
        this._order = characterOrder;
        this._deck = sim.deck;
        this._sim = sim;

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
     * @returns {Sim}
     */
    get sim() {
        return this._sim;
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


    resolve() {
        if (!this.target) {
            throw new Error('no target for attack by ', this.char.name);
        }
        
        if (!this.char.state === 'canAct') {
            throw new Error(`character ${this.char.name} cannot act`);
        }

        const charSkill = this.char.currentWeapon ?
            this.char.currentWeapon.rank : this.char.reflexes;

        if (!this.target.currentWeapon) {
            this._sim._chooseWeapon(this.target);
        }

        if (!this._sim.hasTarget(this.target)) { // you have his attention...
            this.target.target = this.char;
        }

        const targetSkill = this.target.currentWeapon ?
            this.target.currentWeapon.rank : this.target.reflexes;

        const cCards = this.deck.cards(2);
        let charBestCards = bestForSkill(cCards, charSkill);

        const tCards = this.deck.cards(2);
        let targetBestCards = bestForSkill(tCards, targetSkill);

        let result = '?';
        // @TODO: allow for defensive stalemate
        if (charBestCards.over) {
            if (targetBestCards.over) {
                result = `overdraw tie between ${this.char.name} and ${this.target.name}`;
            } else if (this.target.state === 'canAct') {
               result = this.hit(this.target, this.char, targetBestCards, charBestCards);
            } else {
                result = `overdraw attack from ${this.char.name} to ${this.target.name}`;
            }
        } else if (targetBestCards.over) {
            result = this.hit(this.char, this.target, charBestCards, targetBestCards);
        } else if (charBestCards.rank === targetBestCards.rank) {
            result = `tie between ${this.char.name} and ${this.target.name}`;
        } else if (charBestCards.rank > targetBestCards.rank) {
            result = this.hit(this.char, this.target, charBestCards, targetBestCards); // character hits target
        } else if (this.target.state === 'canAct') {
            result = this.hit(this.target, this.char, targetBestCards, charBestCards); // target hits character
        } else {
            result = `target ${this.target.name} defended`;
        }

        /**
         * you have got the target's attention! unless they are already
         * engaged with an active opponent the target is now going
         * to target the active character.
         */
        if (!this.target && (this.target.target.state !== 'inactive')) {
            this.target.target = this.char;
        }

        const out = {
            actor: this.char.name,
            charDraw: charBestCards.toJSON(),
            targetDraw: targetBestCards.toJSON(),
            result: result
        };
        return out;
    }

    hit(fromChar, toChar, fromDraw, toDraw) { //
        const basePower = fromChar.currentWeapon.basePower;
        const ratio = Math.max(0.25, (4 + fromDraw.highSuitRank - toDraw.highSuitRank) / 4);
        const netPower = Math.round(ratio * basePower);
        toChar.impact(netPower, fromChar.currentWeapon.weapon, fromChar);
        return `${fromChar.name} hits ${toChar.name} amount: ${basePower}`;
    }
}
