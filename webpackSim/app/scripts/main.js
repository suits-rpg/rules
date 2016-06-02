var suits = require('../../../dist');

const Sim = suits.Sim;
const Teams = suits.Teams;
const Character = suits.Character;
const Deck = suits.Deck;
const SUITS = suits.SUITS;
const VALUES = suits.VALUES;
const weapons = suits.weapons;

let deck;
let sim;
let teams;
let chars;
let props;

teams = new Teams();
teams.add('Alphans');
teams.add('Betans');

const pseudoRandom = String(Math.PI)
    .replace('.', '')
    .split('')
    .map(n => parseInt(n, 10) % SUITS.length);

deck = new Deck(index => {
    let n = index % VALUES.length;
    if (n % 2) {
        n = (VALUES.length - 1) - n;
    }
    const value = VALUES[n];
    const suitsIndex = pseudoRandom[index % pseudoRandom.length];
    const suit = SUITS[suitsIndex];
    return {value: value, suit: suit};
});

chars = [];

// alphans

const skills = [{
    name: 'Hand Weapons', levels: 2, attr: 'reflexes'
}];
const alphanWeapons = [weapons['medium blades']];
const betanWeapons = alphanWeapons;

for (let i of [0, 1, 2]) {
    props = {
        name: 'Alphan ' + (i + 1),
        reflexes: 6 + i,
        body: 6 - i,
        mind: 5,
        Will: 5 + i,
        team: teams.getTeam('Alphans'),
        skills: skills,
        weapons: alphanWeapons
    };

    chars.push(new Character(props));
}

// betans
for (let j of [0, 1, 2]) {
    props = {
        name: 'Betan ' + (j + 1),
        reflexes: 5 + j,
        body: 7 - j,
        mind: 5,
        Will: 5 + j,
        team: teams.getTeam('Betans'),
        skills: skills,
        weapons: betanWeapons
    };

    chars.push(new Character(props));
}

sim = new Sim(chars, teams, deck);

sim.doRound();

