const SHORT_ATTRS = {
    RE: 'reflexes',
    MI: 'mind',
    SP: 'spirit',
    BD: 'Body'
};

export class Skill {
    constructor(name, attr, notes) {
        this.name = name;
        this.attr = attr;
        this.notes = notes;
    }

    set name(val) {
        this._name = val;
    }

    get name() {
        return this._name;
    }

    set attr(val) {
        if (SHORT_ATTRS[val]) {
            val = SHORT_ATTRS[val];
        }
        this._attr = val;
    }

    get attr() {
        return this._attr;
    }
}
