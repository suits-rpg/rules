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

const charData = () => _.map(chars, char => ({
    name: char.name,
    reflexes: char.reflexes,
    body: char.body,
    mind: char.mind,
    spirit: char.spirit,
    team: char.team.name,
    shock: char.shock,
    wounds: char.wounds,
    state: char.state,
    health: char.health
}));

sim.onAny((event, data) => {
});

const doRound = () => {
    sim.doRound();
    console.log('sim round ', sim.round);
    const table = $('#characters').DataTable();
    table.clear()
        .rows.add(charData());
    table.draw();

    if (!teams.done) {
        setTimeout(doRound, 2000);
    } else {
        console.log('sim done');
    }
};

$(document)
    .ready(() => {
        $('#characters')
            .DataTable({
                data: charData(),
                paging: false,
                search: false,
                info: false,
                columns: [
                    {data: 'name', title: 'Name'},
                    {data: 'reflexes', title: 'REF'},
                    {data: 'body', title: 'BODY'},
                    {data: 'mind', title: 'MIND'},
                    {data: 'spirit', title: 'SPI'},
                    {data: 'team', title: 'Team'},
                    {data: 'health', title: 'Health'},
                    {data: 'shock', title: 'Shock'},
                    {data: 'wounds', title: 'Wounds'}
                ]
            }).column(5).order('asc');
        doRound();
    });

