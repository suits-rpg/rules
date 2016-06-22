var suits = require('../../../dist');
var _ = require('lodash');

const Sim = suits.Sim;
const Teams = suits.Teams;
const Character = suits.Character;
const Deck = suits.Deck;
const armors = suits.armors;
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
const alphanWeapons = [weapons['large blades']];
const betanWeapons = [weapons['large spear']];
const COUNT = 10;
const DELAY = 200;
const N = 3;
const attr = (i, n) => n ? 5 + (i % N) : 4 + N - i % N;

for (let i of  _.range(0, COUNT)) {
    props = {
        name: 'Alphan ' + (i + 1),
        reflexes: attr(i, true),
        body: attr(i),
        mind: 5,
        Will: attr(i, true),
        team: teams.getTeam('Alphans'),
        skills: skills,
        armor: [armors['Heavy Plate']],
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
        armor: [armors['Heavy Plate']],
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
    armor: char.currentArmor ? char.currentArmor.name : '(none)',
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

        case 'setTarget':
            return;
            break;

        case 'act.noop':
            return;
            break;

        case 'attack':
            let damageReport = '';
            if (/hits/.test(data.result.message)) {
                damageReport = `<br /><b>base power</b>: ${data.result.basePower}
                <br /><b>ratio</b>: ${Math.floor(data.result.ratio * 100)}% <b>boosted power</b>: ${data.result.boostedPower}
                <br /><b>after armor</b>: ${data.result.power}`;
            }
            notes = `${data.result.message} ${damageReport}`;
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
                    {data: 'name', title: 'Name', className: 'long'},
                    {data: 'team', title: 'Team', className: 'long'},
                    {data: 'weapon', title: 'Weapon', className: 'medium'},
                    {data: 'armor', title: 'Armor', className: 'medium'},
                    {data: 'target', title: 'Target', className: 'long'},
                    {data: 'reflexes', title: 'REF', className: 'short'},
                    {data: 'body', title: 'BODY', className: 'vShort'},
                    {data: 'mind', title: 'MIND', className: 'vShort'},
                    {data: 'spirit', title: 'SPI', className: 'vShort'},
                    {data: 'health', title: 'Health', className: 'medium'},
                    {data: 'state', title: 'State', className: 'medium'},
                    {data: 'shock', title: 'SHK', className: 'vShort'},
                    {data: 'wounds', title: 'WND', className: 'vShort'}
                ]
            }).column(1).order('asc');

        setTimeout(doRound, 2000);
    });
