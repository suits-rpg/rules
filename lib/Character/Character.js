import CharacterBase from './Base';
import weaponsMixin from './WeaponsMixin';
import skillsMixin from './SkillsMixin';
import teamMixin from './TargetTeamMixin';
import stateMixin from './StateHealthMixin';

export default class Character extends skillsMixin(
    teamMixin(
        stateMixin(
            weaponsMixin(CharacterBase)
        )
    )
) {
    toJSON() {
        const out = {};

        for (var prop of 'name,mind,body,reflexes,spirit,health,state'.split(',')) {
            out[prop] = this[prop];
        }
        out.team = this.teamName || '';
        out.target = this.targetName || '';
        // @TODO: reflect skills, items.
        return out;
    }
} /* eslint max-statements-per-line:0 */
