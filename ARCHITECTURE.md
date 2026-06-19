# Boss System Architecture

## System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         GAME LOOP (game.js)                      │
│  States: menu | playing | gameover | victory                     │
└────────────┬────────────────────────────────────────────────────┘
             │
             ├─────────────────────────────────────────────────────┐
             │                                                      │
             ▼                                                      ▼
┌────────────────────────┐                          ┌──────────────────────┐
│   WAVE MANAGER         │                          │   PLAYER             │
│   (wave.js)            │                          │   (player.js)        │
│                        │                          │                      │
│ • Tracks wave number   │                          │ • Movement           │
│ • Detects boss waves   │                          │ • Jumping            │
│ • Spawns enemies/bosses│                          │ • Attacking          │
│ • Wave transitions     │                          │ • Blocking           │
└────────┬───────────────┘                          └──────────────────────┘
         │
         │ Wave % 3 === 0?
         │
         ├─── NO ──────────────────────────────────┐
         │                                          │
         │                                          ▼
         │                              ┌───────────────────────┐
         │                              │   REGULAR ENEMIES     │
         │                              │   (enemy.js)          │
         │                              │                       │
         │                              │ • Basic AI            │
         │                              │ • Melee attacks       │
         │                              │ • 40x60 size          │
         │                              └───────────────────────┘
         │
         └─── YES (Boss Wave) ─────────┐
                                       │
                                       ▼
                        ┌──────────────────────────────┐
                        │   BOSS FACTORY               │
                        │   (wave.js)                  │
                        │                              │
                        │ Wave 3  → Griffin            │
                        │ Wave 6  → Minotaur           │
                        │ Wave 9  → Cyclops            │
                        │ Wave 12 → Hydra              │
                        │ Wave 15 → Zeus               │
                        └──────────┬───────────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────────┐
                        │   BOSS BASE CLASS            │
                        │   (boss.js)                  │
                        │   extends Enemy              │
                        │                              │
                        │ • 80x120 size (2x)           │
                        │ • Higher health              │
                        │ • Special attack system      │
                        │ • Telegraph animations       │
                        └──────────┬───────────────────┘
                                   │
                ┌──────────────────┼──────────────────┐
                │                  │                  │
                ▼                  ▼                  ▼
    ┌───────────────────┐ ┌──────────────┐ ┌──────────────────┐
    │   GRIFFIN         │ │  MINOTAUR    │ │   CYCLOPS        │
    │   (griffin.js)    │ │(minotaur.js) │ │  (cyclops.js)    │
    │                   │ │              │ │                  │
    │ • Fast (3.5)      │ │ • Fast (3.0) │ │ • Slow (1.5)     │
    │ • 150 HP          │ │ • 250 HP     │ │ • 400 HP         │
    │ • Aerial Dive     │ │ • Bull Rush  │ │ • Ground Slam    │
    │ • 500 pts         │ │ • 1000 pts   │ │ • 2000 pts       │
    └───────────────────┘ └──────────────┘ └──────────────────┘
                │                  │
                ▼                  ▼
    ┌───────────────────┐ ┌──────────────────────┐
    │   HYDRA           │ │   ZEUS               │
    │   (hydra.js)      │ │   (zeus.js)          │
    │                   │ │                      │
    │ • Slow (1.8)      │ │ • Normal (2.5)       │
    │ • 600 HP          │ │ • 800 HP             │
    │ • Triple Strike   │ │ • Lightning Storm    │
    │ • 3500 pts        │ │ • 5000 pts           │
    └───────────────────┘ └──────────┬───────────┘
                                     │
                                     │ Defeated?
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │   VICTORY STATE      │
                          │   (game.js)          │
                          │                      │
                          │ • Victory screen     │
                          │ • Final stats        │
                          │ • Restart option     │
                          └──────────────────────┘
```

## Projectile System

```
┌─────────────────────────────────────────────────────────────┐
│                    GAME UPDATE LOOP                          │
└────────────┬────────────────────────────────────────────────┘
             │
             │ Is Boss Wave?
             │
             ├─── NO (Regular Wave) ────────────────────┐
             │                                           │
             │                                           ▼
             │                              ┌────────────────────┐
             │                              │   ARROW SPAWNER    │
             │                              │   (game.js)        │
             │                              │                    │
             │                              │ • Every ~3 seconds │
             │                              │ • Random direction │
             │                              │ • Ground level     │
             │                              └─────────┬──────────┘
             │                                        │
             │                                        ▼
             │                              ┌────────────────────┐
             │                              │   ARROW            │
             │                              │   (arrow.js)       │
             │                              │                    │
             │                              │ • Flies horizontal │
             │                              │ • 15 damage        │
             │                              │ • Must jump over   │
             │                              └────────────────────┘
             │
             └─── YES (Boss Wave) ──────────────────┐
                                                    │
                                                    │ Wave 15 (Zeus)?
                                                    │
                                                    ├─── NO ────────┐
                                                    │               │
                                                    │               ▼
                                                    │    ┌──────────────────┐
                                                    │    │  NO PROJECTILES  │
                                                    │    │                  │
                                                    │    │  Arrows disabled │
                                                    │    │  during boss     │
                                                    │    └──────────────────┘
                                                    │
                                                    └─── YES (Zeus) ────┐
                                                                        │
                                                                        ▼
                                                          ┌──────────────────────┐
                                                          │ LIGHTNING SPAWNER    │
                                                          │ (game.js)            │
                                                          │                      │
                                                          │ • Every ~2 seconds   │
                                                          │ • Random direction   │
                                                          │ • Lightning styled   │
                                                          └─────────┬────────────┘
                                                                    │
                                                                    ▼
                                                          ┌──────────────────────┐
                                                          │ LIGHTNING            │
                                                          │ (lightning.js)       │
                                                          │ extends Arrow        │
                                                          │                      │
                                                          │ • Jagged yellow bolt │
                                                          │ • 20 damage          │
                                                          │ • Faster speed       │
                                                          └──────────────────────┘
```

## Special Attack System

```
┌─────────────────────────────────────────────────────────────┐
│                    BOSS UPDATE CYCLE                         │
└────────────┬────────────────────────────────────────────────┘
             │
             │ Special Attack Ready?
             │
             ├─── NO ────────────────────────────────────┐
             │                                            │
             │                                            ▼
             │                              ┌──────────────────────┐
             │                              │  NORMAL BEHAVIOR     │
             │                              │                      │
             │                              │ • Move toward player │
             │                              │ • Melee attacks      │
             │                              │ • Cooldown ticks     │
             │                              └──────────────────────┘
             │
             └─── YES ──────────────────────────────────┐
                                                        │
                                                        ▼
                                          ┌──────────────────────────┐
                                          │  SPECIAL ATTACK PHASES   │
                                          └────────────┬─────────────┘
                                                       │
                        ┌──────────────────────────────┼──────────────────────┐
                        │                              │                      │
                        ▼                              ▼                      ▼
            ┌───────────────────┐        ┌──────────────────┐    ┌──────────────────┐
            │  PHASE 1:         │        │  PHASE 2:        │    │  PHASE 3:        │
            │  TELEGRAPH        │───────▶│  EXECUTION       │───▶│  RECOVERY        │
            │                   │        │                  │    │                  │
            │ • Visual warning  │        │ • Attack happens │    │ • Return to      │
            │ • Sound cue       │        │ • Damage dealt   │    │   normal state   │
            │ • 1-1.5 seconds   │        │ • Effects shown  │    │ • Reset cooldown │
            └───────────────────┘        └──────────────────┘    └──────────────────┘
                    │
                    │ Player can react during telegraph
                    │
                    ▼
        ┌────────────────────────────┐
        │  COUNTERPLAY WINDOW        │
        │                            │
        │ • Move away (Griffin)      │
        │ • Jump (Minotaur, Cyclops) │
        │ • Position (Hydra)         │
        │ • Keep moving (Zeus)       │
        └────────────────────────────┘
```

## Sprite System

```
┌─────────────────────────────────────────────────────────────┐
│              SPRITE GENERATOR (sprites.js)                   │
└────────────┬────────────────────────────────────────────────┘
             │
             ├─── Player Sprites ────────────────────────────┐
             │                                                │
             │                                                ▼
             │                                  ┌──────────────────────┐
             │                                  │ • Knight (40x60)     │
             │                                  │ • Shield             │
             │                                  │ • Pike weapon        │
             │                                  └──────────────────────┘
             │
             ├─── Enemy Sprites ─────────────────────────────┐
             │                                                │
             │                                                ▼
             │                                  ┌──────────────────────┐
             │                                  │ • Warrior (35x55)    │
             │                                  │ • Sword weapon       │
             │                                  └──────────────────────┘
             │
             └─── Boss Sprites ──────────────────────────────┐
                                                             │
                                                             ▼
                                               ┌──────────────────────┐
                                               │ All 80x120 (2x size) │
                                               └─────────┬────────────┘
                                                         │
                    ┌────────────────────────────────────┼────────────────┐
                    │                                    │                │
                    ▼                                    ▼                ▼
        ┌───────────────────┐            ┌──────────────────┐  ┌──────────────┐
        │ GRIFFIN           │            │ MINOTAUR         │  │ CYCLOPS      │
        │                   │            │                  │  │              │
        │ • Eagle head      │            │ • Bull head      │  │ • One eye    │
        │ • Lion body       │            │ • Muscular body  │  │ • Giant size │
        │ • Wings           │            │ • Battle axe     │  │ • Club       │
        │ • Golden-brown    │            │ • Brown/red      │  │ • Gray-green │
        └───────────────────┘            └──────────────────┘  └──────────────┘
                    │                                    │
                    ▼                                    ▼
        ┌───────────────────┐            ┌──────────────────────┐
        │ HYDRA             │            │ ZEUS                 │
        │                   │            │                      │
        │ • Three heads     │            │ • White beard        │
        │ • Serpent necks   │            │ • Golden crown       │
        │ • Green scales    │            │ • Divine glow        │
        │ • Multiple anims  │            │ • Lightning staff    │
        └───────────────────┘            └──────────────────────┘
```

## Score System

```
┌─────────────────────────────────────────────────────────────┐
│              SCORE MANAGER (score.js)                        │
└────────────┬────────────────────────────────────────────────┘
             │
             ├─── Regular Enemy Kill ──────────────────────────┐
             │                                                  │
             │                                                  ▼
             │                                    ┌──────────────────┐
             │                                    │ +100 points      │
             │                                    └──────────────────┘
             │
             ├─── Boss Kills ──────────────────────────────────┐
             │                                                  │
             │                                                  ▼
             │                                    ┌──────────────────┐
             │                                    │ Griffin:  +500   │
             │                                    │ Minotaur: +1000  │
             │                                    │ Cyclops:  +2000  │
             │                                    │ Hydra:    +3500  │
             │                                    │ Zeus:     +5000  │
             │                                    └──────────────────┘
             │
             └─── Wave Completion ─────────────────────────────┐
                                                                │
                                                                ▼
                                                  ┌──────────────────┐
                                                  │ +200 bonus       │
                                                  └──────────────────┘
```

## Data Flow Example: Zeus Fight

```
1. Wave 15 Starts
   │
   ├─→ WaveManager.isBossWave() → true
   │
   ├─→ WaveManager.getBossType() → 'zeus'
   │
   └─→ WaveManager.spawnBoss() → new Zeus(canvas)

2. Zeus Spawned
   │
   ├─→ Zeus appears at center (dramatic entrance)
   │
   ├─→ "BOSS WAVE: ZEUS" displayed
   │
   └─→ Lightning projectiles start spawning (not regular arrows)

3. Combat Loop
   │
   ├─→ Player attacks Zeus
   │   └─→ Zeus.takeDamage(25)
   │
   ├─→ Zeus moves toward player
   │
   ├─→ Zeus special attack timer reaches 0
   │   │
   │   ├─→ Phase 1: Telegraph (raise staff, 1 second)
   │   │
   │   ├─→ Phase 2: Lightning Storm
   │   │   └─→ Spawn 3-5 LightningBolt objects
   │   │       └─→ Each targets player's position
   │   │
   │   └─→ Phase 3: Reset cooldown (8 seconds)
   │
   └─→ Lightning projectiles continue spawning

4. Zeus Defeated
   │
   ├─→ Zeus.health <= 0
   │
   ├─→ ScoreManager.addBossKillPoints('zeus') → +5000
   │
   ├─→ Game.checkVictory() → true
   │
   └─→ Game.gameState = 'victory'

5. Victory Screen
   │
   ├─→ Display "VICTORY! THE GODS HAVE BEEN DEFEATED!"
   │
   ├─→ Show final statistics
   │
   └─→ Offer restart option
```

## Key Design Patterns

### 1. Inheritance Hierarchy
```
Enemy (base class)
  └─→ Boss (extends Enemy)
      ├─→ Griffin
      ├─→ Minotaur
      ├─→ Cyclops
      ├─→ Hydra
      └─→ Zeus

Arrow (base class)
  └─→ Lightning (extends Arrow)
```

### 2. State Machine (Boss Special Attacks)
```
IDLE → TELEGRAPH → EXECUTING → RECOVERY → IDLE
```

### 3. Factory Pattern (Boss Creation)
```
WaveManager.spawnBoss(type) {
    switch(type) {
        case 'griffin': return new Griffin();
        case 'minotaur': return new Minotaur();
        // etc.
    }
}
```

### 4. Observer Pattern (Victory Condition)
```
Game watches WaveManager and currentEnemy
  → When wave 15 complete and Zeus defeated
  → Trigger victory state
```

---

## File Dependencies

```
index.html
  ├─→ sprites.js
  ├─→ player.js
  ├─→ enemy.js
  ├─→ arrow.js
  ├─→ lightning.js (new)
  ├─→ boss.js (new)
  ├─→ bosses/griffin.js (new)
  ├─→ bosses/minotaur.js (new)
  ├─→ bosses/cyclops.js (new)
  ├─→ bosses/hydra.js (new)
  ├─→ bosses/zeus.js (new)
  ├─→ wave.js
  ├─→ score.js
  └─→ game.js
```

---

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Easy to add new bosses
- ✅ Maintainable code structure
- ✅ Clear data flow
- ✅ Testable components