const _sr = {
    club: 0,
    spade: 1,
    diamond: 2,
    heart: 3
};

const suitRank = suit => {
    return suit ? _sr[suit.toLowerCase()] : 0;
};

export default suitRank;
