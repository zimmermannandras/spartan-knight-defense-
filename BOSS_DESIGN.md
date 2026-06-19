# Boss System Design Document

## Overview
Every 3rd wave (3, 6, 9, 12, 15) spawns a mythological boss instead of regular enemies. After defeating Zeus on wave 15, the player wins the game.

## Boss Specifications

### Common Boss Properties
- **Size**: 2x player size (80x120 pixels vs player's 40x60)
- **Health**: Progressively increases with each boss
- **Points**: Each boss awards more points than regular enemies
- **Spawn**: Center of screen with dramatic entrance
- **No regular arrows**: Arrow projectiles disabled during boss waves (except Zeus)

---

## Boss #1: Griffin (Wave 3)

**Mythology**: Eagle-lion hybrid, swift aerial predator

**Stats**:
- Health: 150 HP
- Speed: 3.5 (Fast - 1.75x base enemy speed)
- Attack Damage: 15
- Points Reward: 500

**Appearance**:
- Eagle head with sharp beak
- Lion body with golden-brown fur
- Large wings (visible even when grounded)
- Talons for feet

**Special Attack: Aerial Dive**
- **Trigger**: Every 5-7 seconds
- **Animation**: 
  1. Griffin leaps into air (y position decreases)
  2. Hovers briefly (1 second)
  3. Dives down at player's position
  4. Creates small shockwave on impact
- **Damage**: 20 HP (area damage)
- **Counterplay**: Player must move away from dive target zone
- **Cooldown**: 8 seconds

---

## Boss #2: Minotaur (Wave 6)

**Mythology**: Bull-headed warrior, aggressive and powerful

**Stats**:
- Health: 250 HP
- Speed: 3.0 (Fast - 1.5x base enemy speed)
- Attack Damage: 20
- Points Reward: 1000

**Appearance**:
- Bull head with large horns
- Muscular humanoid body
- Wielding a large battle axe
- Brown fur and red eyes

**Special Attack: Bull Rush**
- **Trigger**: Every 6-8 seconds
- **Animation**:
  1. Minotaur paws ground (telegraph - 1 second)
  2. Charges across entire screen at high speed
  3. Horns glow red during charge
- **Damage**: 25 HP
- **Counterplay**: Player must jump over or dodge to side
- **Cooldown**: 10 seconds

---

## Boss #3: Cyclops (Wave 9)

**Mythology**: One-eyed giant, slow but devastating

**Stats**:
- Health: 400 HP
- Speed: 1.5 (Slow - 0.75x base enemy speed)
- Attack Damage: 25
- Points Reward: 2000

**Appearance**:
- Massive single eye in center of forehead
- Huge muscular body
- Carries a large club
- Gray-green skin

**Special Attack: Ground Slam**
- **Trigger**: Every 7-9 seconds
- **Animation**:
  1. Cyclops raises club high (telegraph - 1.5 seconds)
  2. Slams club into ground
  3. Shockwave travels along ground in both directions
- **Damage**: 30 HP
- **Counterplay**: Player must jump to avoid shockwave
- **Shockwave Speed**: 4 pixels/frame
- **Cooldown**: 12 seconds

---

## Boss #4: Hydra (Wave 12)

**Mythology**: Multi-headed serpent, relentless attacker

**Stats**:
- Health: 600 HP
- Speed: 1.8 (Slow - 0.9x base enemy speed)
- Attack Damage: 15 per head
- Points Reward: 3500

**Appearance**:
- Three serpent heads on long necks
- Scaled green body
- Each head can move independently
- Forked tongues

**Special Attack: Triple Strike**
- **Trigger**: Every 5-7 seconds
- **Animation**:
  1. All three heads rear back (telegraph - 1 second)
  2. Heads strike from different angles:
     - Left head: strikes low
     - Center head: strikes middle
     - Right head: strikes high
  3. Attacks come in rapid succession (0.3s apart)
- **Damage**: 15 HP per head hit (max 45 HP)
- **Counterplay**: Difficult to block all three, requires positioning and timing
- **Cooldown**: 9 seconds

---

## Boss #5: Zeus (Wave 15 - Final Boss)

**Mythology**: King of gods, master of lightning

**Stats**:
- Health: 800 HP
- Speed: 2.5 (Normal - 1.25x base enemy speed)
- Attack Damage: 20
- Points Reward: 5000

**Appearance**:
- Regal white beard and hair
- Golden crown and robes
- Glowing with divine energy
- Holds lightning bolt staff

**Special Attack: Lightning Storm**
- **Trigger**: Every 4-6 seconds
- **Animation**:
  1. Zeus raises staff (telegraph - 1 second)
  2. Sky darkens briefly
  3. 3-5 lightning bolts strike at player's position
  4. Lightning bolts have slight delay between strikes
- **Damage**: 25 HP per bolt
- **Counterplay**: Keep moving to avoid strikes
- **Visual**: Lightning bolts replace regular arrows during this wave
- **Cooldown**: 8 seconds

**Special Mechanic**: 
- Regular lightning projectiles (styled arrows) continue during Zeus fight
- Lightning bolts look like jagged yellow/white energy
- More frequent than regular arrows (every 2 seconds)

---

## Victory Condition

**After Defeating Zeus**:
1. Game state changes to 'victory'
2. Victory screen displays:
   - "VICTORY! THE GODS HAVE BEEN DEFEATED!"
   - Final score
   - Total waves completed (15)
   - Total enemies defeated
   - Time survived
   - Option to restart and try for higher score

---

## Implementation Architecture

### Boss Class Structure
```
Boss (extends Enemy)
├── Griffin
├── Minotaur
├── Cyclops
├── Hydra
└── Zeus
```

### Wave Manager Modifications
- Check if wave number is divisible by 3
- Spawn appropriate boss instead of regular enemies
- Disable arrow spawning (except wave 15)
- Display boss name on screen

### Game State Additions
- Add 'victory' state
- Track boss defeats
- Special scoring for bosses

### Point Rewards
- Griffin: 500 points
- Minotaur: 1000 points
- Cyclops: 2000 points
- Hydra: 3500 points
- Zeus: 5000 points

---

## Visual Design Guidelines

### Boss Sprites
- All bosses are 80x120 pixels (2x player size)
- Use distinct color schemes for each boss
- Animated special attack telegraphs
- Health bars scaled appropriately

### Special Effects
- Shockwave visual for Cyclops
- Charge trail for Minotaur
- Lightning effects for Zeus
- Dive shadow for Griffin
- Multiple head animations for Hydra

---

## Difficulty Balancing

### Health Progression
- Griffin: 150 HP (3x regular enemy)
- Minotaur: 250 HP (5x regular enemy)
- Cyclops: 400 HP (8x regular enemy)
- Hydra: 600 HP (12x regular enemy)
- Zeus: 800 HP (16x regular enemy)

### Attack Patterns
- Fast bosses (Griffin, Minotaur): More aggressive, less health
- Slow bosses (Cyclops, Hydra): More health, devastating attacks
- Zeus: Balanced, but most complex attack patterns

### Player Strategy
- Griffin: Stay mobile, avoid dive zones
- Minotaur: Time jumps carefully during charge
- Cyclops: Jump shockwaves, attack during cooldown
- Hydra: Position carefully, use shield strategically
- Zeus: Constant movement, manage lightning and melee

---

## Sound Design

### Boss Sounds
- Boss spawn: Deep dramatic sound
- Special attack telegraph: Unique sound per boss
- Special attack execution: Powerful impact sounds
- Boss defeat: Triumphant fanfare
- Victory: Epic victory theme

---

## Testing Checklist
- [ ] Each boss spawns on correct wave
- [ ] Boss health scales appropriately
- [ ] Special attacks work as designed
- [ ] Arrows disabled on boss waves (except Zeus)
- [ ] Lightning projectiles work on Zeus wave
- [ ] Victory screen appears after Zeus defeat
- [ ] Point rewards are correct
- [ ] Boss sprites render at 2x size
- [ ] All special attack animations work
- [ ] Game balance feels fair but challenging