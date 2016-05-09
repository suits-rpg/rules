# Combat

Combat has several factors that make the challenges unique:

* Combatants wear *armor* that reduce damage taken and deflect blows
* Your choice of *weapon* alters the damage you can do and the frequency with which you can attack, as well as adding a range component
* You take both short term *impact* and long term *damage* and can even die. 
  
## Weapons

Hand to hand combat usually involves weapons which have unique characteristics:

* They have *leverage* which increases your effect 
* They have a variety of impact point shapes and materials that add to your effect 
* Some weapons are less balanced or require reloading, reducing the frequency with which you can attack
* Some weapons are armor piercing, reducing the effect of armor against them.

### Leverage and strength

Hand weapons leverage depending on its size and manner of use. Leverage ranges from 1 to 2 depending on weapon length and usage.

Weapons also have a strength which is added in after the leverage multiplier, reflecting the nature and lethality of the head. 
Weapon strength varies from -1 to 4. 

Some weapons -- guns and bombs -- have fixed strengths as they don't depend on musclepower.

### Penetration

Penetration reflects a weapons ability to pierce into the body and cause permanant damage even with less base impact. 
Penetration ranges from -1 to 3. 

### Ready Time

Some weapons take one or more rounds to ready after use. You can still defend with them while unready
but you cannot defend with them until you've spent the requred rounds readying them. 

<weapons-table></weapons-table>

## Armor

Armor has two qualities that make it useful in combat:

* It absorbs a measure of incoming impact 
* It deflects some blows completely, adding to your defensive rank

<armor-table></armor-table>

## Attacks

Attacks are contests of weapon skill vs. defense. 

### Defense Skill

Hand weapons can be defended against using hand weapons, even if they are unready, or dodged using your base Body. 
Ranged weapons can only be dodged using Body. 

## Impact of Blows

The effect of a blow are calculated from the basic Impact/effect as described in Challenges. 

1. Subtract Armor from the Impact. 
2. Take Impact past (Body - Penetration) as Damage; take the rest as Shock. 
3. If the Damage from a single blow is greater than your Body you are instantly Dead. 
4. If you are not dead, and the accumulated sum of your Damage is your Body,
   the remained is taken as Trauma and you are Bleeding Out.

### Shock

Shock is short term pain. You can accumulate up to 2x your Body in Shock, past that all impact is Damage. 
However *for a single blow* you can only take up to Body - Penetration Impact in Shock: the remainder of the Impact is Damage.

Shock is recovered at a rate of 1 point per round, at the end of your round. 
You cannot recover shock automatically if you have any Damage.
You can recover 1 point of Shock at the end of a round if you do not act (or are unconscious), unless you bleed out.

#### Knockout

If you accumulate Body Wounds (Stun + Damage) and fail a Will check on your round you are knocked out. 
Your Will is halved if your Injuries are above Body &times; 2

Knockout lasts for an hour per point of Damage plus 15 minutes per point of Shock. 

Anyone knocked out (or sleeping) can be killed in two rounds. 

### Damage

Damage takes longer to recover. It cannot be recovered in the timespan of a battle. 

### Trauma

If you accumulate Damage past your Body it is converted to Trauma.
You are bleeding out, and will ultimately die without aid. 

### Injury

Injury is the sum of your Damage and Trauma. 
If your Injury is greater than 2 &times; your Body, you die. 
Ordinarily, this situation is equal to your trauma being equal to your Body; however with bleedout and medical care,
that equation won't always be equivalent. 

#### Bleeding Out

If you have any Trauma at the start of every round, draw a card. 
If the card is below your current Trauma you bleed out, and cannot recover any Shock that round. 
You are not necessarily unconscious, but you will be soon. 

* If it is red, take an extra point of Damage.
* If it is a Face Card take an extra point of Trauma.
* If it is black, take an extra point of Shock.  

### Wounds

Your Wounds are the sum of your accumulated Shock, Trauma and Damage. 

* If your accumulated Wounds are greater than your Body you must make a Will check every round or pass out. 
  You cannot act other than to attempt to reduce your Shock. 
* If your accumulated Wounds are greater than twice your Body, you are automatically knocked out.

<wounds></wounds>

## Death

You can die if:

* You take Damage from a single blow equal to your Body
* You accumulate your Body in Trauma

A surgeon can cure death, as described below. 

### Destruction

Destruction is a special kind of death where the body is so ripped apart that you are unmistakably, permanantly dead. 

### Your Hand and Injury

You must discard all cards in your hand if you take any Injury past Armor's absorption. 
You cannot replenish your hand if you have any Wounds. 

## Emergency Medicine

To provide emergency medicine, you must be:

1. Out of the line of fire for ranged weapons
2. At least 5 meters from enemy combatants and either out of direct line of sight or with your forces between you and your enemy. 
3. Able to get at the wounds 
4. Have bandages ready

Armor takes 1 round to remove for every 2 points of deflection, rounded down. 
Bandages can be jury-rigged from clothing, but it takes an extra round per point of Trauma to rip up the bandages.
Which can be done by assistants. 

Up to two EMTs can work on a single patient at once. 

### Healing Damage

An EMT can bandage up to 1/2 your damage (round up) if you have not taken Trauma on a successful contest of 
EMT skill vs. Damage. Once this contest has been made, 
the remaining damage cannot be fixed with short term EMT aid, so track damage taken at each battle separately. 

### Stabilizing Trauma

When you have Trauma your greatest threat is moment by moment bleeding. 
With a successful contest of EMT vs. Trauma, you can stabilize 2 points of Trauma per round. 
This contest can be made multiple times until the all Trauma is converted to Damage.

Once the EMT is successful, the victim does not have to make continued blood loss checks. 
However, the patient cannot have damage actually reduced by an EMT through EMT Care if they have Damage above their Body.

### Self Care

You can provde self care if you must at half your EMT (or 1/4 your Mind), if you can stay conscious. 

<p class="example">
Bob gets hit for four points of damage; his Body is 6. Rick the EMT successfully heals two points of damage; leaving two 
points that Bob must keep til he rests. </p>
<p class="example">
Bob is then hit for three more points of damage. 
His total damage is five, including the two non-healed points from before.
Rick again heals him successfully curing two of the three new points of damage. note that's 3/2, not 5/2. </p>
<p class="example">Rick is now at 3 points of Damage. He takes 5 points of damage and now has 8 points of Damage. He takes four points of damage. Since one of those is Trauma
he can no longer get patched up with short term EMT care.</p>
Fixing Light Damage takes one second per accumulated Wounds, and also removes all Shock. 
It must be done outside of direct combat. 

Once someone has taken Trauma an EMT cannot reduce their damage at all.
However they can convert Trauma to regular damage to stop the bleeding. 

## Long Term Healing

You can recover from shock after battle in a few seconds. Damage takes longer to heal. 

In good care you automatically heal one point of damage if you make a contest of Body vs. Damage. 

If you have competent healers looking after you, every day you fail to heal a point of damage, they can make a second 
contest of their EMT skills vs. your Damage to heal a point of damage. 

### Healing Trauma

If a surgeon is present within a half hour of an injury, they can heal up to 1/2 of Trauma (once it is stabilized)
through a contest of Surgery vs. Trauma. 

#### Getting Worse

If you have Injury greater than your Body, the margin is considered Major Damage. 
You have to draw over your Major Damage to avoid bleeding for a point of Damage,
and if you do, you have no opportunity to heal that day (as above). This can kill you. 

### Healing in Difficult Circumstances

Healing requires safety, warmth, food and occasional care. 
Without these conditions, you will at minimum not get an automatic point of healing.
In the worst conditions you may only get a chance to heal every other day,
and will have to make a contest vs. half your Damage (all of it, not just Trauma) 
to avoid bleeding out for an extra point of Damage every day. 

### Cheating Death

A dead person who is brought to a surgeon within a 1/2 hour can be brought back from the dead. 
The surgeon must make a successful contest between their skill and your Injury.
If this check fails, a hero can make a final check against their base Will to reover long enough for a Dramatic last speech. 

A surgeon's skill at fixing death is halved in primitive times, 
or if they don't have access to modern tools and a supply of blood and drugs.
and a support team (at least one other EMT or Surgeon. 

It takes at least 1/2 hour to fix death, plus an extra 1/2 hour for every point of trauma.
