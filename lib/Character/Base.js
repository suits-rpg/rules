let nameInc = 0;
const nameStub = () => 'unnamed ' + (nameInc++);
import _ from 'lodash';
import * as attrs from './attributes';

export default class Base {
    
    constructor(props) {
        this._initName(props.name);
        this._initAttrs(props);
    }

    _initName(name) {
        this.name = name || nameStub();
    }

    _initAttrs(props) {
        this._attrs = {};
        for (let attr of _.values(attrs)) {
            this[attr] = props.hasOwnProperty(attr) ? props[attr] : 5;
        }
    }
    
    /**
     *
     * @returns {String}
     */
    get name() {
        return this._name;
    }

    /**
     * Name must be a nonempty string.
     * At this point characters cannot be renamed.
     * @param val {String}
     */
    set name(val) {
        if (!val) {
            throw new Error('name cannot be empty');
        }
        if (typeof val !== 'string') {
            throw new Error("non string passed to name");
        }
        if (this._name) {
            throw new Error('cannot rename character');
        }
        this._name = val;
    }

    get body() {
        return this._attrs.body;
    }

    set body(val) {
        this._attrs.body = val;
    }

    get mind() {
        return this._attrs.mind;
    }

    set mind(val) {
        this._attrs.mind = val;
    }

    get reflexes() {
        return this._attrs.reflexes;
    }

    set reflexes(val) {
        this._attrs.reflexes = val;
    }

    get spirit() {
        return this._attrs.spirit;
    }

    set spirit(val) {
        this._attrs.spirit = val;
    }
}
