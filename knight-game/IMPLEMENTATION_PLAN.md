# Boss System Implementation Plan

## Phase 1: Core Boss Infrastructure

### 1.1 Create Boss Base Class
**File**: `knight-game/boss.js`

```javascript
class Boss extends Enemy {
    constructor(canvas, bossType, wave) {
        // 2x size, custom stats per boss
        // Special attack system
        // Boss-specific behavior
    }
}
```

**Key Features**:
- Extends Enemy class
- 2x size (80x120 pixels)
- Special attack timer and cooldown system
- Boss-specific stats (health, speed, damage)
- Telegraph animation system for special attacks

---

### 1.2 Create Individual Boss Classes
**Files**: 
- `knight-game/bosses/griffin.js`
- `knight-game/bosses/minotaur.js`
- `knight-game/bosses/cyclops.js`
- `knight-game/bosses/hydra.js`
- `knight-game/bosses/zeus.js`

Each boss class extends Boss and implements:
- Custom sprite generation
- Special attack logic
- Unique behavior patterns

---

### 1.3 Update Wave Manager
**File**: `knight-game/wave.js`

**Modifications**:
```javascript
isBossWave() {
    return this.currentWave % 3 === 0;
}

getBossType() {
    switch(this.currentWave) {
        case 3: return 'griffin';
        case 6: return 'minotaur';
        case 9: return 'cyclops';
        case 12: return 'hydra';
        case 15: return 'zeus';
    }
}

spawnBoss() {
    const bossType = this.getBossType();
    return new Boss(this.canvas, bossType, this.currentWave);
}
```

---

## Phase 2: Boss Sprites

### 2.1 Update Sprite Generator
**File**: `knight-game/sprites.js`

Add methods:
- `createGriffinSprite(facingRight)`
- `createMinotaurSprite(facingRight)`
- `createCyclopsSprite(facingRight)`
- `createHydraSprite(facingRight)`
- `createZeusSprite(facingRight)`

Each sprite should be 80x120 pixels with distinctive features.

---

## Phase 3: Special Attack Systems

### 3.1 Griffin - Aerial Dive
**Implementation**:
```javascript
class Griffin extends Boss {
    performSpecialAttack() {
        // Phase 1: Leap up (1 second)
        // Phase 2: Hover (1 second)
        // Phase 3: Dive down (0.5 seconds)
        // Phase 4: Impact with shockwave
    }
}
```

**Visual Effects**:
- Shadow on ground showing dive target
- Wing flapping animation during hover
- Speed lines during dive

---

### 3.2 Minotaur - Bull Rush
**Implementation**:
```javascript
class Minotaur extends Boss {
    performSpecialAttack() {
        // Phase 1: Telegraph (paw ground, 1 second)
        // Phase 2: Charge across screen (high speed)
        // Phase 3: Stop at screen edge
    }
}
```

**Visual Effects**:
- Ground dust during telegraph
- Red glow on horns
- Motion blur during charge
- Dust trail behind

---

### 3.3 Cyclops - Ground Slam
**Implementation**:
```javascript
class Cyclops extends Boss {
    performSpecialAttack() {
        // Phase 1: Raise club (1.5 seconds)
        // Phase 2: Slam down
        // Phase 3: Create shockwave projectiles
    }
}
```

**Shockwave Class**:
```javascript
class Shockwave {
    constructor(x, y, direction) {
        // Travels along ground
        // Damages player if not jumping
    }
}
```

**Visual Effects**:
- Club glows during raise
- Ground cracks at impact
- Visible shockwave ripples

---

### 3.4 Hydra - Triple Strike
**Implementation**:
```javascript
class Hydra extends Boss {
    performSpecialAttack() {
        // Phase 1: All heads rear back (1 second)
        // Phase 2: Sequential strikes
        //   - Left head (low)
        //   - Center head (middle)
        //   - Right head (high)
    }
}
```

**Visual Effects**:
- Three separate head sprites
- Independent head animations
- Strike trails for each head

---

### 3.5 Zeus - Lightning Storm
**Implementation**:
```javascript
class Zeus extends Boss {
    performSpecialAttack() {
        // Phase 1: Raise staff (1 second)
        // Phase 2: Sky darkens
        // Phase 3: Spawn 3-5 lightning bolts
    }
}
```

**Lightning Bolt Class**:
```javascript
class LightningBolt {
    constructor(targetX, targetY) {
        // Appears at top of screen
        // Strikes down at target
        // Jagged yellow/white visual
    }
}
```

**Visual Effects**:
- Staff glows
- Screen flash
- Jagged lightning animation
- Ground scorch marks

---

## Phase 4: Arrow System Modifications

### 4.1 Disable Arrows on Boss Waves
**File**: `knight-game/game.js`

```javascript
update() {
    // Check if current wave is boss wave
    const isBossWave = this.waveManager.isBossWave();
    const isZeusWave = this.waveManager.currentWave === 15;
    
    // Only spawn arrows if not boss wave OR if Zeus wave
    if (!isBossWave || isZeusWave) {
        // Arrow spawning logic
    }
}
```

---

### 4.2 Lightning Projectiles for Zeus
**File**: `knight-game/lightning.js`

```javascript
class Lightning extends Arrow {
    constructor(canvas) {
        super(canvas);
        // Override appearance
        // Jagged yellow/white visual
        // Faster speed
        // More damage
    }
    
    draw(ctx) {
        // Draw lightning bolt instead of arrow
        // Animated jagged line
        // Glow effect
    }
}
```

---

## Phase 5: Victory System

### 5.1 Add Victory Game State
**File**: `knight-game/game.js`

```javascript
constructor() {
    this.gameState = 'menu'; // menu, playing, gameover, victory
}

checkVictory() {
    if (this.waveManager.currentWave === 15 && 
        this.currentEnemy === null && 
        this.waveManager.isWaveComplete) {
        this.gameState = 'victory';
    }
}
```

---

### 5.2 Victory Screen
**File**: `knight-game/game.js`

```javascript
drawVictory() {
    // Dark overlay
    // "VICTORY!" title
    // "THE GODS HAVE BEEN DEFEATED!"
    // Final statistics:
    //   - Final Score
    //   - Waves Completed: 15
    //   - Enemies Defeated
    //   - Bosses Defeated: 5
    // "Press A to Play Again"
}
```

---

## Phase 6: Scoring System Updates

### 6.1 Boss Point Rewards
**File**: `knight-game/score.js`

```javascript
addBossKillPoints(bossType) {
    const points = {
        'griffin': 500,
        'minotaur': 1000,
        'cyclops': 2000,
        'hydra': 3500,
        'zeus': 5000
    };
    this.score += points[bossType];
}
```

---

## Phase 7: UI Enhancements

### 7.1 Boss Health Bar
- Larger health bar for bosses
- Boss name displayed above health bar
- Different color scheme (gold/red)

### 7.2 Boss Wave Announcement
- "BOSS WAVE!" text appears
- Boss name displayed
- Dramatic entrance animation

---

## Implementation Order

### Step 1: Foundation (Code Mode)
1. Create `boss.js` base class
2. Update `wave.js` to detect boss waves
3. Create boss folder structure

### Step 2: First Boss - Griffin (Code Mode)
1. Create `griffin.js`
2. Implement basic Griffin sprite
3. Implement aerial dive attack
4. Test Griffin encounter

### Step 3: Remaining Bosses (Code Mode)
1. Implement Minotaur with charge attack
2. Implement Cyclops with ground slam
3. Implement Hydra with triple strike
4. Implement Zeus with lightning storm

### Step 4: Arrow System (Code Mode)
1. Modify arrow spawning logic
2. Create Lightning class for Zeus wave
3. Test arrow behavior on all waves

### Step 5: Victory System (Code Mode)
1. Add victory game state
2. Implement victory screen
3. Add victory condition check
4. Test complete game flow

### Step 6: Polish (Code Mode)
1. Add boss point rewards
2. Enhance UI for boss waves
3. Add sound effects
4. Balance difficulty
5. Final testing

---

## File Structure

```
knight-game/
├── index.html (update script includes)
├── game.js (add victory state, boss logic)
├── player.js (existing)
├── enemy.js (existing)
├── arrow.js (existing)
├── wave.js (update for boss detection)
├── score.js (add boss points)
├── sprites.js (add boss sprites)
├── boss.js (new - base boss class)
├── lightning.js (new - Zeus projectiles)
├── bosses/
│   ├── griffin.js (new)
│   ├── minotaur.js (new)
│   ├── cyclops.js (new)
│   ├── hydra.js (new)
│   └── zeus.js (new)
├── BOSS_DESIGN.md (design document)
└── IMPLEMENTATION_PLAN.md (this file)
```

---

## Testing Strategy

### Unit Testing
- Each boss special attack works correctly
- Arrow spawning logic correct for each wave
- Victory condition triggers properly
- Point rewards calculate correctly

### Integration Testing
- Boss waves spawn at correct intervals
- Transitions between regular and boss waves smooth
- Victory screen appears after Zeus defeat
- All boss sprites render correctly

### Balance Testing
- Boss health feels appropriate
- Special attacks are challenging but fair
- Player has time to react to telegraphs
- Victory is achievable but difficult

---

## Success Criteria

✅ All 5 bosses implemented with unique sprites
✅ Each boss has working special attack
✅ Bosses spawn on waves 3, 6, 9, 12, 15
✅ Arrows disabled on boss waves (except Zeus)
✅ Lightning projectiles work on Zeus wave
✅ Victory screen appears after defeating Zeus
✅ Boss point rewards implemented
✅ Game is balanced and fun to play

---

## Next Steps

Ready to switch to Code mode and begin implementation?

The recommended approach is to implement bosses one at a time, testing each thoroughly before moving to the next. This ensures each boss works correctly and allows for iterative balance adjustments.