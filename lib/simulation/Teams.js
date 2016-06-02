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
}

export class Teams {

    constructor() {
        this._teams = {};
    }

    get teams() {
        return this._teams;
    }

    add(name) {
        this.teams[name] = new Team(name, this);
        return this;
    }

    getTeam(name) {
        if (!this.teams[name]) {
            this.add(name);
        }
        return this._teams[name];
    }

    get names() {
        return _.values(this.teams).map(t => t.toString());
    }

    toString() {
        return this.names.join(',');
    }

    enemies(fromTeam) {
        let enemies = [];
        for (let team of _.values(this.teams)) {
            if (!(fromTeam.name === team.name)) {
                enemies = enemies.concat(Array.from(team.members));
            }
        }
        return enemies;
    }
}
