# Challenges

Challenges are contests between two or more players in which each take turns attempting
to wear down the others' power pool. The skills involved, and the power pool in question, depends
on the nature of the challenge. Physical challenges use combat skills for challenge ranks
and Body as the power pool. A sales negotiation uses Merchantry as the challenge skill and Will as the power pool. 

There are three components to the contest:

1. **Your action card:** Each player has an action card that determines on which turn they act. 

2. **Your hand:** Each player has a hand of four cards they use on their turn for attacks on other players.

3. **Your power pool:** Each player has a pool of power that is diminished when they lose a contest.

## Turns and Rounds

Play is resolved in turns and rounds. Each Turn is one second of game time. 
It has 10 rounds from 10 to 1(A). Within a round, if you have an (untilted) Action Card equal to the Round's rank,
you can act; resolve ties in descending order of Speed, resolving ties with a random draw from the deck.

### Your action card

Everyone at the start of the game places an action card from their hand that determines the order in which thery act.
Characters act in descending order (10 ... 1) of their acton card.
Face cards (Jack, Queen, King) are always taken as low value (1, 2, 3).
If you place an action card that is above your speed, you lose your first action and must keep it flipped down until the next round. 

Players act in descending order of Action cards; 
then, in descending order of the number of cards they have left; 
then in descending order of Speed - Encumbrance.
In a final tie, draw randomly to determine who acts first, in descending order of random cards.

### Your action

You can do one of the following on your action:

* Perform a task or challenge, as described below
* Prepare for a long action
* Replenish your deck
* Attempt to recover stun (see damage)
* Do any other activity -- move, get equipment, talk, etc. 

When you have acted, flip your action card face over. 

## The challenge

<div class="text-sidebar-right">
<h2 class="text-sidebar-right__head">Offensive vs. Defensive defaults</h2>

<p>As mentioned in <a href="#/Characters">Characters</a> 
your default/untrained skill score equals half a skills' base attribute. 
This is true for all offensive or task based use of a skill. 

<p>Defense rank has a more generous default; your worst/default defensive rank is equal to your base attribute.

<p class="example">
Professor Barnes is dropped into a fight club. He has no training and a Speed of 4. 
He throws his first punch, with a default skill of 2, failing predictably.
<p class="example">
His opponent then throws a punch. 
Barnes' defensive rank is equal to his full Speed of 4, despite his lack of training. 
</div>

A challenge happens when a player on their action phase attacks another players' power pool. 

### Attacker challenge value 

The attacker places one or more cards face down to initiate the attack. 
The sum of those cards (when revealed), *plus their skill level*, is the attackers' challenge value. 
If asked they must reveal how many cards they are playing.

The value of the cards (individually and in sum) must not be greater than the player's skill level.
The value of your challenge is the sum of:

* your base skill level
* the value of all the cards under or equal to your skill level, up to twice your skill
* +1 for each boost card. 

Thus your maximum challenge value, assuming you have three cards, is twice your skill level + 2;
this assumes you have one card exactly equal to your skill level and use the other two cards to boost. 

<p class="example">
A boxer has a fighting skill of 6; he has a hand that includes a Queen, a 3, and an 8. 
They can place the 3, *or* the Queen (value 2), for a skill level of 9 or 8 respectively. 
Or they can place both the three *and* the 2 since their sum (5) is also under their skill level.
This results in a challenge value of 11. 
</p>

#### Weak challenges

You *can* challenge an opponent even if all your cards are above your skill level.
A challenge in which the player's card(s) are above their skill is a weak challenge. 
Its value is *half* the player's skill level (round up), plus any boost cards. 
This can happen in two situations; 

1. All your cards are above your skill level and you want to bluff so you place one (or even more) down anyway
2. You draw a random card from the deck and it's value is above your skill level. 

<p class="example">
The boxer above has a hand that is `(7, 9, and 10)'. 
He does a weak attack by using the 9 as the attack card and places the 7 as a boost card. 
His total attack value is `(3 +1) = 4`. 
Not a great attack but the defender doesn't know this and might toss away good cards in defense.
</p>

#### Boost cards

If you have high cards in your hand you cannot use, you can burn them as "Boost cards". 
Boost cards add one ot the value of your challenge. 
They can be used in combination with cards from your hand but you can't make an action entirely using boost cards. 
Boost cards are played sideways (tilted) and announced by the attacker first.

Boost cards increase the value of a challenge, not your skill rank. 
That is, a boost doesn't increase the range of cards you can play, individually or in sum.
If the attacker uses boost cards, they must be placed separately and noted as boost cards before the defender chooses their defense.

You don't have to reveal the boost cards' face value. 

<p class="example">
Tam has a hand of `9`, `7`, and `Q`. He has a Cooking skill of 6, and is competing in a reality cooking show. 
On his round he can only place the `Queen`, whose value is 2. 
However he really wants to win, so he plays all three cards, using the `9` and the `7` as Boost Cards.
His rank for this challenge is `(6 +2 +1 + 1) = 10`. He must reveal that the 9 and 7 are Boost Cards.
</p>

<p class="example">
Chris has a hand of `7`, `8`, and `9` and a Cooking skill of 5. 
His hand is useless; he can draw from the deck, but he can't add his boost cards to the result, 
nor can he combine all his hand cards (for a total of 3) and use that as a rank. Time to draw again...
</p>

#### Drawing from the deck for a challenge

Alternately, you can draw a single card from the deck. 
This card can't be boosted, and the attacker has to declare that they are playing from the deck, not their hand.
This is risky as if the card is 
 
### Defense value

The defender then places one or more cards from their hand in defense face up,
or at their option, draws a single card their defense. 
The sum of their cards is their defensive value.

### Resolution

The attacker then reveals their card(s).
If the attack value is higher than the defense value, the attack is successful.
On a tie, if the attacker has a higher card, or more cards than the defender, they are successful.

## Impact

To determine the effect of an action multiply the attacker's Power by the Effect Percent. 

<div class="text-sidebar-right">

<h2 class="text-sidebar-right__head">Challenge margin</h2>

<p>The difference between the attackers' skill and their attack sum is their Challenge Margin. 

<p class="example">
For instance, if your skill is 8 and you place a 2 and a King (vaule 3) as your attack rank, 
your challenge margin is (8 - (2 + 3)) = 3.
</p>

</div>

### Effect Percent

Effect percent is the amount of your base Power that is translated as Impact. 
Effect is measured in 10% increments.
Effect *can be larger than 100%*; when using the table below, add the base power to (percent - 100) on the table
to figure the effect of the excess percent. 

Draw a card, taking the value of face cards as the low value (1, 2, and 3 for Jacks, Queens and Kings). 
Add the **challenge margin** (see sidebar) to this value, and multiply by 10%; that is your effect percent.
Values below 0.5 are rounded up to 1/2. 
Half values have no effect until another half value comes along, in which case it adds up to 1. 
Note the effect percent card is always drawn from the deck; you can't use a card from your hand for it. 

<p class="example">
If the attacker draws a 4, and has a challenge margin of 3, their total effect is (4 + 3) * 10% = 70%. 
Their attack Power is 6, for a net attack of 4.2, or 4.
</p>

<p class="example">
</p>

<effect-table></effect-table>


##Long actions

Some actions, like using unbalanced weapons, aiming raged weapons, casting long spells, bows, etc., 
require more than one action to execute. 
To perform long actions, place a card from the deck below your action card. You can use poker chips
if you have them instead of cards to track long actions.

When you have enough cards/chips to act you act as usual on the phase of the action card, discarding
your extra cards/tokens. 

Whether a long action can be maintained from turn to turn 
or must be used as soon as the minimum number of turns has elapsed depends on the circumstance. 
Aiming, for instance, can be maintained over subsequent turns, as can a readied weapon. 
Bandaging a wound must be executed immediately or the effort is lost. 

### Winning

Note these rules describe direct contests like fights, chess games, etc. 
In general contests, the victor is the person that does effect to their opponent that is higher than
the targets' Power. Physical contests has more detailed damage resolution rules, described in another section. 

#### Indirect Contests

Indirect contests like pie eating contests or beauty pagents may involve parallel task contests,
and may have more regimented action rounds. 
Indirect contests are resolved with tests, not contests. 

The target effect number for for indirect contests is absolute -- i.e., both players do tasks and must get an effect 
total of a fixed value (say, 10) to win. 

An archery contest would be a straightforward series of tests, with contestants taking turns or 
acting in parallel. 

## Henchmen Rules

Giving opponents individual hands and action cards is fine in small numbers. 
To increase the efficiency of play against large numbers of opponents, 
two levels of rule streamlining can be used.
 
### No hands for henchmen

Henchmen always draw from the deck when they act. 
If the card is a face card, they can draw a second card and use either or both cards.
This is true up until the Henchman takes any Damage. 
A henchman with Wounds (Stun or Damage) draws a single card.

### Shared action card between squads

If the henchmen are particularly numerous, you can share an action card between squads of four 
henchmen.
