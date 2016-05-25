import CharacterSkill from './CharacterSkill';

export default baseClass => {
    return class SkillsMixedIn extends baseClass {

        constructor(props) {
            if (!props) {
                props = {};
            }
            super(props);
            this._initSkills(props.skills);
        }

        /* ------------------- SKILLS --------------------- */

        _initSkills(skills) {
            this._skills = {};
            if (skills) {
                for (let skill of skills) {
                    this.addSkill(skill);
                }
            }
        }

        get skills() {
            const skills = {};
            for (let p in this._skills) {
                if (this._skills.hasOwnProperty(p)) {
                    let skill = this._skills[p];
                    skills[skill.name] = skill.rank;
                }
            }
            return skills;
        }

        skillRank(name) {
            if (!this._skills[name]) {
                return 0;
            }

            return this._skills[name].rank;
        }

        addSkill(alpha, beta, gamma) {
            let name;
            let attr;
            let level;

            if (typeof alpha === 'object') {
                name = alpha.name;
                attr = alpha.attr;
                level = alpha.level || 0;
            } else {
                name = alpha;
                attr = beta;
                level = gamma || 0;
            }

            this._skills[name] = new CharacterSkill(this, name, attr, level);
        }
    };
};
