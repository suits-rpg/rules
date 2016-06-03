var suits = require('../../../dist');
var _ = require('lodash');

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

deck = new Deck();

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

var charData = _.map(chars, char => ({
    name: char.name,
    reflexes: char.reflexes,
    body: char.body,
    mind: char.mind,
    team: char.team.name
}));

var container = document.getElementById('characters');
var hot = new Handsontable(container,
    {
        data: charData
    });

while(!teams.done) {
    sim.doRound();
    
}

