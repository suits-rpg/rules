import chai from 'chai';
import {Teams, Team} from '../../lib/simulation/Teams';
const assert = chai.assert;

class Stub {
    constructor(n) {
        this.name = n;
        this.health = 'awake';
    }

    toString() {
        return this.name;
    }
}

describe('Team', () => {
    let team;

    beforeEach(() => {
        team = new Team('foo');
    });

    it('should have the name foo', () => assert.equal(team.name, 'foo'));

    describe('.add', () => {

        beforeEach(() => {
            team.add(new Stub('bob'))
                .add(new Stub('ray'));
        });

        it('should have foo', () => assert.equal(team.toString(), 'foo'));

        it('should have members', () => assert.deepEqual(team.memberNames, ['bob', 'ray']));
        
    });
    
    describe('.defeated', () => {
        beforeEach(() => {
            team.add(new Stub('bob'))
                .add(new Stub('ray'));
        });
        
        it('should not be defeated', () => assert.notOk(team.defeated, 'team is not defeated'));

        it('should be done when everyone dies', () => {
            for (let char of team.members) {
                char.health = 'dead';
            }

            assert.ok(team.defeated, 'team is defeated');
        });
    });
});

describe('Teams', () => {
    let teams;

    beforeEach(() => {
        teams = new Teams()
            .add('foo')
            .add('bar');

        teams.getTeam('foo').add(new Stub('bob'));
        teams.getTeam('bar').add(new Stub('ray'))
       .add(new Stub('phil'));
    });

    it('should have teams foo an bar', () => assert.deepEqual(teams.names, ['foo', 'bar']));
    
    describe('.done', () => {
        it('should not be done at the start', () => assert.notOk(teams.done, 'team is not done at start'));
        
        it('should be done after everyone on one team is dead', () => {
            for (let member of teams.getTeam('foo').members) {
                member.health = 'dead';
            }
            assert.ok(teams.done, 'team is done when everyone on a team is dead');
        });
    });
});
