import chai from 'chai';
import targetTeamsMixin from './../../lib/Character/TargetTeamMixin';
import {Teams} from '../../lib/simulation/Teams';
const assert = chai.assert;

describe('Character/TargetTeams', function () {
    let char;
    class Base { // a stub
        constructor(props) {
            this.name = props.name;
            this.reflexes = props.reflexes;
        }
    }
    class Character extends targetTeamsMixin(Base) {
    }

    beforeEach(() => {
        char = new Character({
            name: 'foo',
            body: 4,
            mind: 5,
            reflexes: 6,
            spirit: 7
        });
    });

    describe('Teams', () => {
        var teams;

        beforeEach(() => {
            teams = new Teams();
            teams.add('alphans').add('betans');
            char.team = teams.getTeam('alphans');
        });

        it('has the right teamName', () => assert.equal(char.teamName, 'alphans'));
    });

});
