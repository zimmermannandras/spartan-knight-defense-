# Spartan Knight Defense

A 2D wave-based combat game where you control a medieval knight defending against endless waves of enemy warriors in an ancient Greek setting.

## How to Play

1. Open `index.html` in a web browser
2. Press **A** to start the game
3. Survive as long as possible!

## Controls

- **Arrow Left (←)**: Move knight left
- **Arrow Right (→)**: Move knight right
- **A Key**: Attack with pike
- **S Key**: Raise shield to block attacks

## Game Mechanics

### Combat
- Your knight has **100 HP**
- Each attack deals **25 damage** to enemies (2 hits to kill)
- Enemies deal **10 damage** per attack
- Attack has a cooldown of 0.5 seconds

### Shield System
- Shield can block **3 enemy attacks** before breaking
- Must hold **S** to actively block
- Shield regenerates to full durability after completing each wave
- Visual feedback shows shield condition (bright → dark → broken)

### Wave System
- **Infinite waves** with increasing difficulty
- Wave 1: 2 enemies
- Wave 2: 3 enemies
- Wave 3+: Enemies increase by 1 each wave
- Only **1 enemy on screen** at a time
- Enemies spawn from left or right sides

### Difficulty Scaling
- **Every 3 waves**: Enemy speed increases by 10%
- **Every 5 waves**: Enemy attack frequency increases by 15%
- Game continues until you die!

### Scoring
- **10 points** per enemy killed
- **30 points** bonus for completing each wave
- High score is saved in your browser

## Tips

- Use your shield strategically - it only has 3 blocks per wave
- Keep moving to avoid enemy attacks
- Time your attacks carefully due to cooldown
- Position yourself to face enemies as they spawn
- Shield regenerates between waves, so use it freely!

## Technical Details

- Built with HTML5 Canvas and vanilla JavaScript
- No external dependencies required
- Runs at 60 FPS
- High score persists using localStorage

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and layout
- `game.js` - Core game engine and loop
- `player.js` - Player knight class
- `enemy.js` - Enemy warrior class
- `wave.js` - Wave management system
- `score.js` - Scoring and high score tracking

## Browser Compatibility

Works in all modern browsers that support HTML5 Canvas:
- Chrome/Edge
- Firefox
- Safari
- Opera

Enjoy defending the realm! 🛡️⚔️