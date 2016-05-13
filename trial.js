var suits = require('./dist/index');

var c = new suits.Character({name: 'bob'});

var teams = new suits.Teams();
teams.add('A').add('B');

c.team = teams.getTeam('A');

console.log('character', c.toString());
