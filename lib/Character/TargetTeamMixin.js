export default baseClass => {
    return class TargetTeamMixin extends baseClass {

        constructor(props) {
            if (!props) {
                props = {};
            }
            super(props);
            this._initTeam(props.team);
        }

        /* --------------------- TARGET, TEAM --------------------- */

        _initTeam(team) {
            this.team = team;
        }

        /**
         *
         * @param val {Character}
         */
        set target(val) {
            this._target = val;
        }

        get targetName() {
            return this.target ? this.target.name : '';
        }

        /**
         *
         * @returns {Character}
         */
        get target() {
            return this._target;
        }

        /**
         *
         * @returns {boolean}
         */
        get hasActiveTarget() {
            return (this.target && this.target.state !== 'inactive');
        }

        /**
         *
         * @returns {Team}
         */
        get team() {
            return this._team;
        }

        /**
         * @param val {Team}
         */
        set team(val) {
            this._team = val;
            if (val) {
                val.add(this);
            }
        }

        get teamName() {
            return this.team ? this.team.name : '';
        }
    };
};
