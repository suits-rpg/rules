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
const betanWeapons = [weapons['medium spear']];
const COUNT = 2;
const DELAY = 500;
const attr = (i, n) => n ? 5 - Math.floor(COUNT / 2) + i : 5 + Math.floor(COUNT / 2) - i;

for (let i of  _.range(0, COUNT)) {
    props = {
        name: 'Alphan ' + (i + 1),
        reflexes: attr(i, true),
        body: attr(i),
        mind: 5,
        Will: attr(i, true),
        team: teams.getTeam('Alphans'),
        skills: skills,
        weapons: alphanWeapons
    };

    chars.push(new Character(props));
}

// betans
for (let j of _.range(0, COUNT)) {
    props = {
        name: 'Betan ' + (j + 1),
        reflexes: attr(j, true),
        body: attr(j),
        mind: 5,
        Will: attr(j, true),
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
    health: char.health,
    weapon: char.currentWeapon ? char.currentWeapon.name : '(none)',
    target: char.target ? char.target.name : '(none)'
}));

let turn = 0;
sim.onAny((event, data) => {
    console.log(event, data);
    let notes = '';
    switch (event) {
        case 'round.start':
            turn = 1;
            break;

        case 'act.start':
            ++turn;
            break;

        case 'attack':
            notes = data.result.message;
            break;
        default:
    }
    const char = data.char ? data.char.name : '--';
    if (!/\.(start|end|chooseWeapon)/.test(event)) {
        $('#evts').DataTable()
            .row.add({
                event: event, turn: turn, round: sim.round, actor: char,
                notes: notes
            })
            .draw(true);
    }
});

const doRound = () => {
    sim.doRound();
    console.log('sim round ', sim.round);
    const table = $('#characters').DataTable();
    table.clear()
        .rows.add(charData());
    table.draw();

    if (!teams.done) {
        setTimeout(doRound, DELAY);
    } else {
        console.log('sim done');
    }
};
$.extend($.fn.dataTable.defaults, {
    paging: false,
    searching: false,
    info: false,
});

$(document)
    .ready(() => {
        $('#evts')
            .DataTable({
                data: [],
                columns: [
                    {data: 'round', title: 'Round', className: 'short'},
                    {data: 'turn', title: 'Turn', className: 'short'},
                    {data: 'event', title: 'Event', className: 'medium'},
                    {data: 'actor', title: 'Actor', className: 'medium'},
                    {data: 'notes', title: 'Notes', className: 'long'}
                ]
            });

        $('#characters')
            .DataTable({
                data: charData(),
                columns: [
                    {data: 'name', title: 'Name'},
                    {data: 'reflexes', title: 'REF'},
                    {data: 'body', title: 'BODY'},
                    {data: 'mind', title: 'MIND'},
                    {data: 'spirit', title: 'SPI'},
                    {data: 'team', title: 'Team'},
                    {data: 'health', title: 'Health'},
                    {data: 'shock', title: 'Shock'},
                    {data: 'wounds', title: 'Wounds'},
                    {data: 'weapon', title: 'Weapon'},
                    {data: 'target', title: 'Target'}
                ]
            }).column(5).order('asc');

        setTimeout(doRound, 2000);
    });
