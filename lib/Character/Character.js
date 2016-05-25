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

} /* eslint max-statements-per-line:0 */
