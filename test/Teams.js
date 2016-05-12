import chai from 'chai';
import {Teams, Team} from '../lib/Teams';
const assert = chai.assert;

describe('Team', () => {
  let team;

  beforeEach(() => {
    team = new Team('foo');
  });

  it('should have the name foo', () => assert.equal(team.name, 'foo'));
});

describe('Teams', () => {
  let teams;

  beforeEach(() => {
    teams = new Teams()
      .add('foo')
      .add('bar');
  });

  it('should have teams foo an bar', () => assert.deepEqual(teams.names, ['foo', 'bar']));
});
