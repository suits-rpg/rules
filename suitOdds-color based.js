'use strict';

const _ = require('lodash');
const comb = require('js-combinatorics');
const util = require('util');

const suits = [
    {
        name: 'H',
        color: 'R'
    },
    {
        name: 'D',
        color: 'R'
    },
    {
        name: 'C',
        color: 'B'
    },
    {
        name: 'S',
        color: 'B'
    }
];
const RANK = ['', 'A'].concat(_.range(2, 11)).concat('JQK'.split(''));
const RANK_RANGE = _.range(1, 14);

const deck = _.flatten(RANK_RANGE.reduce((memo, rank) => {
    return memo.concat(suits.map(suit => Object.assign({rank}, suit)));
}, []));
const deck2 = deck.slice(0);
console.log('deck: ', deck);
var possibilities = comb.cartesianProduct(deck, deck2);

let tally = new Map();
let count = 0;
possibilities.forEach(hand => {
    let value = 0;
    ++count;
    let colors = _.map(hand, 'color').join('');
    let suits = _.map(hand, 'name').join('');
    let sameRank = (hand[0].rank > 10 || hand[1].rank > 10);
    if (colors == 'RR') {
        if (sameRank) {
            value = 2;
        } else if (suits == 'HH' || suits == 'DD') {
            value = 1.66;
        } else {
            value = 1.33;
        }
    } else if (colors == 'BB') {
        if (sameRank) {
            value = 0.33
        } else if (suits == 'SS' || suits == 'CC') {
            value = 0.5;
        } else {
            value = 0.66;
        }
    } else {
        value = 1;
    }

    console.log('hand: ', hand.map(c => _.values(c).join('')), 'value:', value);
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
