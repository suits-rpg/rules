import percent from './../util/percent';

class Armor {
    constructor(props) {
        this._absorption = props.absorption || 0;
        this._name = props.name;
    }

    /**
     * 
     * @returns {number}
     */
    get absorption() {
        return this._absorption || 0;
    }

    /**
     * @returns {String}
     */
    get name() {
        return this._name;
    }
}

const armors = require('./../data/json/armor-Armor.json')
    .map(params => {
        const out = {};
        for (let prop in params) {
            if (params.hasOwnProperty(prop)) {
                let lcProp = prop.toLowerCase();
                out[lcProp] = percent(params[prop]);
            }
        }
        return out;
    })
    .reduce((memo, params) => {
        const a = new Armor(params);
        memo[a.name] = a;
        return memo;
    }, {});

export {Armor, armors};
