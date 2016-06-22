'use strict';

const _ = require('lodash');
const comb = require('js-combinatorics');
const util = require('util');

const suits = [
    {
        name: 'H',
        color: 'R',
        value: 3
    },
    {
        name: 'D',
        color: 'R',
        value: 2
    },
    {
        name: 'C',
        color: 'B',
        value: 2
    },
    {
        name: 'S',
        color: 'B',
        value: 1
    }
];
const RANK = ['', 'A'].concat(_.range(2, 11)).concat('JQK'.split(''));
const RANK_RANGE = _.range(1, 14);

const deck = _.flatten(RANK_RANGE.reduce((memo, rank) => {
    return memo.concat(suits.map(suit => Object.assign({rank}, suit)));
}, []));
var possibilities = comb.baseN(deck, 4);

let tally = new Map();
let count = 0;
possibilities.forEach(hand => {
    ++count;

    let pairs = _(hand).groupBy( card => card.name)
        .values()
        .sortBy(a => a.length)
        .value();
    var l = pairs[0].length;
    var ofThose = pairs.filter(a => a.length === count)
        .length;

    const value = l;

    if (tally.has(value)) {
        tally.set(value, 1 + tally.get(value));
    } else {
        tally.set(value, 1);
    }
});

const keys = _.sortBy(Array.from(tally.keys()));
var chanceOfOrLower = 0;
var mean = 0;
var meanSum = 0;
console.log('tally: ', util.inspect(tally));
for (let key of keys) {
    let value = tally.get(key);
    mean += key * value;
    meanSum += value;
    let chance = 100 * value / count;
    chanceOfOrLower += chance;
    if (chance) {
        console.log(`chance of ${key}: ${Math.floor(chance)}% (${Math.floor(chanceOfOrLower)}%}`);
    }
}
console.log('mean: ', mean / meanSum);
