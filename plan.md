# 🎮 Spartan Knight Defense - Updated Game Plan

## Game Overview
An endless 2D wave-based combat game where you control a medieval knight defending against infinite waves of enemy warriors in an ancient Greek setting. Survive as long as possible and rack up the highest score!

---

## 🎯 Core Game Mechanics (Updated)

### Player Controls
- **Arrow Left**: Move knight left
- **Arrow Right**: Move knight right
- **A Key**: Attack with pike (melee range)
- **S Key**: Raise shield to block incoming attacks

### Combat System
- **Player Health**: 100 HP
- **Enemy Health**: 50 HP per enemy
- **Player Attack**: 25 damage (2 hits to kill an enemy)
- **Enemy Attack**: 10 damage to player (if not blocked)
- **Attack Cooldown**: 0.5 seconds
- **Shield System**:
  - Can block 3 enemy attacks before breaking
  - Must be actively held (S key) to block
  - Visual feedback shows shield durability (3/3, 2/3, 1/3, 0/3 - broken)
  - Shield regenerates after completing a wave

### Infinite Wave System with Scaling Difficulty
- **Wave 1**: 2 enemies (alternating from left/right)
- **Wave 2**: 3 enemies (mixed spawns)
- **Wave 3**: 4 enemies (mixed spawns)
- **Wave 4+**: Enemies increase by 1 per wave
- **Difficulty Scaling**:
  - Enemy speed increases slightly every 3 waves
  - Enemy attack frequency increases every 5 waves
  - Only 1 enemy on screen at a time (queue system)
- **No End**: Game continues until player dies

### Scoring System
- **10 points** per enemy killed
- **30 points** bonus for completing each wave
- **High Score** tracking (displayed on game over screen)

---

## 🎨 Visual Design (Simple Shapes)

### Player Knight
- **Body**: Blue rectangle (40x60px)
- **Shield**: Gray circle on left side (15px radius)
  - Changes color based on durability:
    - 3 blocks: Bright silver/gray
    - 2 blocks: Medium gray (slight cracks)
    - 1 block: Dark gray (heavily damaged)
    - 0 blocks: Transparent/broken
- **Pike**: Brown line extending from right side (30px)
- **Attack Animation**: Pike extends forward when A is pressed
- **Shield Animation**: Shield glows/pulses when S is held

### Enemy Warriors
- **Body**: Red rectangle (35x55px)
- **Weapon**: Dark red line (sword, 25px)
- **Direction Indicator**: Faces toward player
- **Attack Animation**: Weapon swings when attacking

### Background (Ancient Greek Theme)
- **Sky**: Light blue gradient (#87CEEB to #4A90E2)
- **Ground**: Sandy brown rectangle (bottom 20%, #D2B48C)
- **Greek Columns**: 3-4 white rectangles with capitals (scattered)
- **Sun**: Yellow circle (top right corner)
- **Decorative Elements**: Simple geometric patterns on ground

### UI Elements
- **Player Health Bar**: Green bar (top left) with red background
- **Shield Durability**: Icon with number (top left, below health)
- **Wave Counter**: "Wave: X" (top center)
- **Score**: "Score: XXXX" (top right)
- **High Score**: Displayed on game over screen

---

## 🔧 Technical Implementation

### Project Structure
```
c:\Bobs\knight-game\
├── index.html          # Main HTML file with canvas
├── styles.css          # Styling for UI and layout
├── game.js             # Core game engine and loop
├── player.js           # Player knight class with shield
├── enemy.js            # Enemy warrior class
├── wave.js             # Infinite wave management with scaling
├── score.js            # Scoring and high score system
└── README.md           # Game instructions
```

### Game State Machine
```
[Start Menu] → [Playing] → [Game Over]
                    ↑            ↓
                    └────────────┘
                   (Restart Game)
```

### Class Structure

**Player Class**
- Properties: `x`, `y`, `width`, `height`, `health`, `speed`, `attackCooldown`, `shieldDurability`, `isBlocking`
- Methods: 
  - `moveLeft()`, `moveRight()`
  - `attack()` - A key
  - `block()` - S key (active blocking)
  - `takeDamage(amount)` - reduced if blocking
  - `draw()` - includes shield state visualization

**Enemy Class**
- Properties: `x`, `y`, `width`, `height`, `health`, `speed`, `direction`, `attackCooldown`
- Methods: 
  - `moveTowardPlayer()`
  - `attack()` - can be blocked by shield
  - `takeDamage(amount)`
  - `draw()`

**Wave Class**
- Properties: `currentWave`, `enemiesInWave`, `enemiesDefeated`, `enemyQueue`, `difficultyMultiplier`
- Methods: 
  - `spawnNextEnemy()` - spawns from left or right
  - `isWaveComplete()` - checks if all enemies defeated
  - `nextWave()` - increases difficulty
  - `calculateDifficulty()` - scales enemy stats

**Score Class**
- Properties: `currentScore`, `highScore`, `enemiesKilled`, `wavesCompleted`
- Methods:
  - `addKillPoints()` - +10 points
  - `addWaveBonus()` - +30 points
  - `saveHighScore()` - localStorage
  - `loadHighScore()`

**Game Class**
- Properties: `canvas`, `ctx`, `player`, `currentEnemy`, `wave`, `score`, `gameState`
- Methods: 
  - `init()`
  - `update()` - game loop
  - `render()` - draw everything
  - `handleInput()` - keyboard events
  - `checkCollisions()` - attack/block detection

---

## 🎮 Gameplay Flow

1. **Start Screen**: 
   - Display title: "Spartan Knight Defense"
   - Show controls
   - "Press A to Start"

2. **Wave Begins**: 
   - Display "Wave X" message
   - Spawn first enemy from random side
   - Player must defeat enemy
   - Next enemy spawns immediately
   - Continue until all wave enemies defeated

3. **Wave Complete**:
   - Award 30 bonus points
   - Regenerate shield to 3/3
   - Brief 2-second pause
   - Display "Wave X Complete!"
   - Next wave begins with more enemies

4. **Difficulty Progression**:
   - Every 3 waves: Enemy speed +10%
   - Every 5 waves: Enemy attack frequency +15%
   - Enemies per wave: Wave number + 1

5. **Game Over** (when player dies):
   - Display final score
   - Display high score
   - Show wave reached
   - "Press A to Restart"

---

## 🎯 Difficulty Scaling Formula

```javascript
// Wave difficulty calculation
enemiesInWave = currentWave + 1
enemySpeed = baseSpeed * (1 + Math.floor(currentWave / 3) * 0.1)
enemyAttackSpeed = baseAttackSpeed * (1 + Math.floor(currentWave / 5) * 0.15)
```

---

## ✅ Success Criteria

- [ ] Player can move left and right smoothly with arrow keys
- [ ] A key attack works with visual feedback and cooldown
- [ ] S key shield blocks enemy attacks (3 blocks max)
- [ ] Shield visual shows durability state clearly
- [ ] Enemies spawn correctly with increasing difficulty
- [ ] Only one enemy on screen at a time
- [ ] Combat system works (damage, blocking, health bars)
- [ ] Infinite wave progression with proper scaling
- [ ] Scoring system tracks kills and wave bonuses
- [ ] High score persists between sessions
- [ ] Game over state shows statistics
- [ ] Game runs smoothly at 60 FPS

---

## 🚀 Future Enhancement Ideas (Optional)

- Different enemy types (fast, tanky, ranged)
- Power-ups (health potion, shield repair, damage boost)
- Special attacks (charged pike thrust)
- Combo system for consecutive kills
- Particle effects for attacks and blocks
- Background music and sound effects
- Leaderboard system
- Achievements system
- Mobile touch controls

---

## 📊 Balancing Notes

- Shield regeneration only between waves encourages strategic blocking
- 3-block limit prevents infinite defense
- Increasing enemy count creates pressure
- Speed scaling keeps gameplay challenging
- Score system rewards both survival and aggression
- One enemy at a time keeps combat focused and readable
