import _ from 'lodash';

export class Team {
  constructor (name) {
    this._name = name;
    this._members = [];
  }

  get name () {
    return this._name;
  }

  get members () {
    return this._members.slice(0);
  }
}

export class Teams {

  constructor () {
    this._teams = {};
  }

  get teams () {
    return this._teams;
  }

  add (name) {
    this._teams[name] = new Team(name);
    return this;
  }
  
  getTeam(name) {
    return this._teams[name];
  }

  get names () {
    return _(_.values(this._teams))
      .map(side => side.name)
      .value();
  }
}
