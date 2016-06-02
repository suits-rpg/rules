import {MCP} from 'mcp';

export default baseClass => {
    return class StateHealthMixin extends baseClass {

        constructor(props) {
            if (!props) {
                props = {};
            }
            super(props);
            this._initState();
            this._initHealth();
        }

        /* --------------------- STATE, HEALTH ------------------- */

        _initState() {
            this.target = null;

            /**
             * state is about the characters' ability to act;
             * it doesn't describe WHY the character can/cannot act.
             */
            this._state = new MCP()
                .mcpWhen('start')
                .mcpStateIs('canAct')
                .mcpWhen('down')
                .mcpStateIs('inactive')
                .mcpFromState().mcpWhen('act').mcpStateIs('acted')
                .mcpFromState('acted', 'canAct').mcpWhen('reset').mcpStateIs('canAct')
                .mcpFromState('inactive').mcpWhen('act').mcpStateIs('inactive')
                .mcpFromState('inactive').mcpWhen('reReady').mcpStateIs('inactive');
            
            this._state.start();
        }
        
        resetAction() {
            this._state.reset();
        }

        _initHealth() {
            /**
             * health is about what you'd think --
             * being alive, KO or dead.
             */
            this._health = new MCP()
                .mcpWhen('wake')
                .mcpStateIs('awake')
                .mcpWhen('knockOut')
                .mcpStateIs('knocked out')
                .mcpWhen('die')
                .mcpStateIs('dead')
                .mcpFromState('awake')
                .mcpWhen('daze')
                .mcpStateIs('dazed')
                .mcpFromState('dazed')
                .mcpWhen('undaze')
                .mcpStateIs('awake');

            this._health.mcpWatchState('knocked out', () => this._state.down());
            this._health.mcpWatchState('dead', () => this._state.down());

            this._health.wake();
            this.shock = 0;
            this.wounds = 0;

            this._hitLog = [];
        }

        /**
         * make an active action.
         * @param deck {Deck}
         * @returns {[Card]}
         */
        activeDraw(deck) {
            return this.passiveDraw(deck);
        }

        /**
         *
         * @param deck
         * @returns {[Card]}
         */
        passiveDraw(deck) {
            return deck.cards(2);
        }
        
        /* --------------------------- STATE CHANGE PROXIES ------------------- */

        knockOut() {
            if (this.health !== 'knocked out') {
                this._health.knockOut();
            }
            return this;
        }

        die() {
            if (!(this.health === 'dead')) {
                this._health.die();
            }
            return this;
        }

        undaze() {
            if (this.health === 'dazed') {
                this._health.undaze();
            }
            return this;
        }

        act() {
            this._state.act();
            return this;
        }

        /* --------------------------- PROPERTIES ----------------------------- */

        get state() {
            return this._state.mcpState;
        }

        get health() {
            return this._health.mcpState;
        }

        get loss() {
            return this.wounds + this.shock;
        }

        set shock(val) {
            this._shock = val;
        }

        get shock() {
            return this._shock;
        }

        set wounds(val) {
            this._wounds = val;
        }

        get wounds() {
            return this._wounds;
        }

        /* ---------------------------------------------- IMPACT ----------------------------- */

        impact(amount, weapon, enemy) {
            const limit = this.lossLimit(weapon.damageType);
            let wounds = Math.max(amount - limit, 0);

            if (weapon.blunt) {
                wounds = Math.round(wounds / 2);
            }
            const shock = amount - wounds;
            // console.log('impact to ', this.name, ':', this.body, limit, ', type:', weapon.damageType, ',
            // amount: ', amount, ', shock:', shock, ', wounds ', wounds);
            this.shock = this.shock + shock;
            this.wounds = this.wounds + wounds;

            if (this.wounds > this.body) {
                this.die();
            } else if (this.loss > 2 * this.body) {
                this._health.knockOut();
            } else if (this.loss > this.body && this._health.mcpState === 'awake') {
                this._health.daze();
            }

            this.logHit('attack', shock, wounds, enemy ? `from ${enemy.name}` : 'from ???');
        }

        lossLimit(damageType) {
            let out;

            switch (damageType.toLowerCase()) {
                case 'hard':
                    out = this.body;
                    break;

                case 'cutting':
                    out = Math.round(this.body * 0.75);
                    break;

                case 'piercing':
                    out = Math.round(this.body * 0.5);
                    break;

                default:
                    out = this.body;
            }
            return out;
        }

        logHit(event, shock, wounds, notes) {
            const data = {
                event: event,
                shock: shock,
                wounds: wounds,
                currentShock: this.shock,
                currentWounds: this.wounds,
                notes: notes || '',
                health: this.health,
                state: this.state
            };

            this._hitLog.push(data);
        }

        get hitLog() {
            return this._hitLog.slice();
        }
    };
};
