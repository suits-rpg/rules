export default {
  Character: require('./Character/Character'),
  weapons: require('./Character/Weapons').weapons,
  Teams: require('./simulation/Teams').Teams,
    SUITS: require('./deck/suits.json'),
    VALUES: require('./deck/values.json'),
    Deck: require('./deck/Deck'), 
    Sim: require('./simulation/Sim')
};
