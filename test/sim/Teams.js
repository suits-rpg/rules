import chai from 'chai';
import {Teams, Team} from '../../lib/simulation/Teams';
const assert = chai.assert;

describe('Team', () => {
    let team;

    beforeEach(() => {
        team = new Team('foo');
    });

    it('should have the name foo', () => assert.equal(team.name, 'foo'));

    describe('.add', () => {
        class Stub {
            constructor(n) {
                this.name = n;
            }

            toString() {
                return this.name;
            }
        }

        beforeEach(() => {
            team.add(new Stub('bob'))
                .add(new Stub('ray'));
        });

        it('should have foo', () => assert.equal(team.toString(), 'foo'));

        it('should have members', () => assert.deepEqual(team.memberNames, ['bob', 'ray']));
    });
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
