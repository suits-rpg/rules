import _ from 'lodash';

export class Team {
    constructor(name, teams) {
        this._name = name;
        this._members = new Set();
        this._teams = teams;
    }

    /**
     *
     * @returns {Teams}
     */
    get teams() {
        return this._teams;
    }

    get name() {
        return this._name;
    }

    enemies() {
        return this.teams.enemies(this);
    }

    /**
     * @returns {Set}
     */
    get members() {
        return this._members;
    }

    /**
     * @returns {Array}
     */
    toArray() {
        return Array.from(this.members);
    }

    add(member) {
        this.members.add(member);
        return this;
    }

    get memberNames() {
        var out = [];
        for (let member of this.members) {
            out.push(member.name);
        }
        return out;
    }

    toString() {
        return this.name;
    }

    get defeated() {
        let out = true;
        for (let member of this.members) {
            switch (member.health) {
                case 'active':
                    out = false;
                    break;

                case 'dazed':
                    out = false;
                    break;

                default:
                // leave as is
            }
            if (!out) {
                break;
            }
        }

        return out;
    }
}

export class Teams {

    constructor() {
        this._teams = new Map();
    }

    get teams() {
        return this._teams;
    }

    add(name) {
        this.teams.set(name, new Team(name, this));
        return this;
    }

    getTeam(name) {
        return this._teams.get(name);
    }

    get names() {
        const names = [];
        for (let team of this.teams.values()) {
            names.push(team.name);
        }
        return names;
    }

    toString() {
        return this.names.join(',');
    }

    enemies(fromTeam) {
        let enemies = [];
        for (let team of this.teams.values()) {
            if (!(fromTeam.name === team.name)) {
                enemies = enemies.concat(Array.from(team.members));
            }
        }
        return enemies;
    }

    get done() {
        let stillStanding = 0;
        for (let team of this.teams.values()) {
            if (!team.defeated) {
                ++stillStanding;
            }
        }

        return stillStanding < 2;
    }
}
