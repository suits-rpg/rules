
export default class Attack {
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
        // @TODO: allow for defensive stalemate
        if (charDraw.over) {
            result = targetDraw.over ?
                `overdraw tie between ${this.char.name} and ${this.target.name}` :
                this.hit(this.target, this.char, targetDraw, charDraw);
        } else if (targetDraw.over) {
            result = this.hit(this.char, this.target, charDraw, targetDraw);
        } else if (charDraw.rank === targetDraw.rank) {
            result = `tie between ${this.char.name} and ${this.target.name}`;
        } else if (charDraw.rank > targetDraw.rank) {
            result = this.hit(this.char, this.target, charDraw, targetDraw); // character hits target
        } else {
            result = this.hit(this.target, this.char, targetDraw, charDraw); // target hits character;
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
            charDraw: charDraw.toJSON(),
            targetDraw: targetDraw.toJSON(),
            result: result
        };
        cHand.removeAll();
        tHand.removeAll();
        return out;
    }

    hit(fromChar, toChar) { // , fromDraw, toDraw
        // @TODO: resolve effect;
        const basePower = fromChar.currentWeapon.basePower;
        //   console.log('base hit to ', toChar.name, ': ', basePower);
        toChar.impact(basePower, fromChar.currentWeapon.weapon);
        return `${fromChar.name} hits ${toChar.name} amount: ${basePower}`;
    }
}
