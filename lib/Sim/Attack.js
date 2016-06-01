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

        const charSkill = this.char.currentWeapon ?
            this.char.currentWeapon.rank : this.char.reflexes;

        if (!this.target.currentWeapon) {
            this._sim._chooseWeapon(this.target);
        }

        const targetSkill = this.target.currentWeapon ?
            this.target.currentWeapon.rank : this.target.reflexes;

        const cCards = this.char.activeDraw(this.deck);
        let charBestCards = bestForSkill(cCards, charSkill);

        const tCards = this.target.passiveDraw(this.deck);
        let targetBestCards = bestForSkill(tCards, targetSkill);

        let result = '?';
        // @TODO: allow for defensive stalemate
        if (charBestCards.over) {
            result = targetBestCards.over ?
                `overdraw tie between ${this.char.name} and ${this.target.name}` :
                this.hit(this.target, this.char, targetBestCards, charBestCards);
        } else if (targetBestCards.over) {
            result = this.hit(this.char, this.target, charBestCards, targetBestCards);
        } else if (charBestCards.rank === targetBestCards.rank) {
            result = `tie between ${this.char.name} and ${this.target.name}`;
        } else if (charBestCards.rank > targetBestCards.rank) {
            result = this.hit(this.char, this.target, charBestCards, targetBestCards); // character hits target
        } else {
            result = this.hit(this.target, this.char, targetBestCards, charBestCards); // target hits character;
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
        // @TODO: resolve effect;
        const basePower = fromChar.currentWeapon.basePower;
     //   console.log('base hit to ', toChar.name, ': ', basePower);
        const ratio = Math.max(0.25, (4 + fromDraw.highSuitRank - toDraw.highSuitRank) / 4);

     //   console.log('from bestForSkill: ', fromDraw.toJSON());
     //   console.log('to bestForSkill:', toDraw.toJSON());

     //   console.log('attacker highSuitRank: ', fromDraw.highSuitRank, ',defense highSuitRank:', toDraw.highSuitRank, 'ratio: ', ratio);
        const netPower = Math.round(ratio * basePower);
        toChar.impact(netPower, fromChar.currentWeapon.weapon, fromChar);
        return `${fromChar.name} hits ${toChar.name} amount: ${basePower}`;
    }
}
