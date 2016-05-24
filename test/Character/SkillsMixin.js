import chai from 'chai';
import SkillsMixin from './../../lib/Character/SkillsMixin';
import _ from 'lodash';

const assert = chai.assert;

describe('Character/SkillsMixin', function () {
    let char;
    class Base { // a stub
        constructor(props) {
            this.name = props.name;
            this.reflexes = props.reflexes;
            this.mind = props.mind;
        }
    }
    class Character extends SkillsMixin(Base) {
        skillRank(name) { // a stub
            return name === 'Hand Weapons' ? 2 + this.reflexes : Math.round(this.reflexes/2) }
    }

    beforeEach(() => {
        char = new Character({
            name: 'foo',
            body: 4,
            mind: 5,
            reflexes: 6,
            spirit: 7,
            skills: [
                {name: 'Hand Weapons', attr: 'reflexes', level: 2},
                {name: 'Philosophy', attr: 'mind', level: 4}
            ],
        });
    });

    it('should have all the skills', () => assert.deepEqual(_(char.skills).keys().value(),
        ['Hand Weapons', 'Philosophy']));

    it('should have the right rank', () => {
        assert.equal(char.skills['Hand Weapons'], 8);
        assert.equal(char.skills.Philosophy, 9);
    });
});
