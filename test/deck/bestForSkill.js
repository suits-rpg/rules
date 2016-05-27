import chai from 'chai';
import bestForSkill from '../../lib/deck/bestForSkill';
const SUITS = require('../../lib/deck/suits.json');
// const VALUES = require('../../lib/deck/values.json');
import Card from '../../lib/deck/Card';
// import _ from 'lodash';

const assert = chai.assert;

describe('bestForSkill', () => {
    let best;
    describe('over', () => {

        beforeEach(() => {
            best = bestForSkill([
                new Card(8, SUITS[0]),
                new Card(10, SUITS[1])
            ], 6);
        });

        it('should be over', () => assert.ok(best.over, 'all cards are over rank'));
    });

    describe('one low card good', () => {

        beforeEach(() => {
            best = bestForSkill([
                new Card('J', SUITS[0]),
                new Card(10, SUITS[1])
            ], 8);
        });

        it('should be rank 2', () => assert.equal(best.rank, 2));
    });
    describe('one high card good', () => {

        beforeEach(() => {
            best = bestForSkill([
                new Card('J', SUITS[0]),
                new Card(10, SUITS[1])
            ], 12);
        });

        it('should be rank 12', () => assert.equal(best.rank, 12));
    });

    describe('two cards good', () => {

        beforeEach(() => {
            best = bestForSkill([
                new Card('J', SUITS[0]),
                new Card(4, SUITS[1])
            ], 8);
        });

        it('should be rank 6', () => assert.equal(best.rank, 6));
    });
});
