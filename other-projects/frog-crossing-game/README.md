# 🐸 Frog Crossing Game

A classic arcade-style browser game where you help a frog cross a busy multi-lane street!

## 🎮 How to Play

1. Open `index.html` in your web browser
2. Press **SPACE** or click **START** to begin
3. Use **Arrow Keys** or **WASD** to move the frog
4. Avoid the traffic and reach the top of the screen
5. Complete levels to increase difficulty and score

## 🎯 Game Features

### Core Gameplay
- **Multiple Traffic Lanes**: 8 lanes with vehicles moving at different speeds
- **Lives System**: Start with 3 lives - lose one each time you get hit
- **Score Tracking**: Earn 100 points per successful crossing + bonus points
- **Progressive Difficulty**: Each level increases vehicle speed by 15%

### Visual Effects
- **Smooth Animations**: Frog hopping animation with easing
- **Particle Effects**: Explosion particles on collision
- **CSS Animations**: Glowing buttons, pulsing title, celebration effects
- **Responsive Design**: Works on different screen sizes

### Audio
- **Sound Effects**: 
  - Jump sound when moving
  - Collision sound when hit
  - Victory melody when completing a level
  - Game over sound
- **Sound Toggle**: Mute/unmute with the sound button

### Controls
- **Arrow Keys** or **WASD**: Move frog (Up, Down, Left, Right)
- **SPACE**: Start game
- **R**: Restart after game over
- **Sound Button**: Toggle sound on/off

## 🏆 Scoring System

- **Successful Crossing**: +100 points
- **Life Bonus**: +50 points per remaining life
- **Level Progression**: Automatic after reaching the top

## 🎨 Game Elements

### Frog (Player)
- Green frog with animated hopping
- Rotates based on movement direction
- Smooth movement with collision detection

### Vehicles
- Three types: Cars, Trucks, and Buses
- Random colors and sizes
- Different speeds per lane
- Alternating lane directions

### Lanes
- 8 traffic lanes with road markings
- Safe zones at top and bottom
- Yellow finish line at the top

## 🛠️ Technical Details

### Technologies Used
- **HTML5 Canvas**: For game rendering
- **CSS3**: Styling and animations
- **Vanilla JavaScript**: Game logic and engine
- **Web Audio API**: Sound effects generation

### Game Architecture
- Object-oriented design with classes
- Game loop using requestAnimationFrame
- Collision detection system
- Particle system for visual effects
- State management for game flow

### Performance
- Optimized rendering
- Efficient collision detection
- Smooth 60 FPS gameplay
- Responsive canvas scaling

## 📁 Project Structure

```
frog-crossing-game/
├── index.html          # Main HTML file
├── styles.css          # All styling and animations
├── game.js            # Complete game logic
├── sounds/            # Sound effects directory (optional)
└── README.md          # This file
```

## 🚀 Getting Started

### Option 1: Local File
Simply double-click `index.html` to open in your default browser.

### Option 2: Local Server
For better performance, use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 🎓 Tips for High Scores

1. **Plan Your Route**: Look ahead at traffic patterns
2. **Timing is Key**: Wait for gaps in traffic
3. **Stay Calm**: Don't rush - you have unlimited time
4. **Use Side Lanes**: Sometimes the edges are safer
5. **Preserve Lives**: Bonus points for remaining lives!

## 🐛 Troubleshooting

### Sound Not Working
- Make sure your browser allows audio
- Check if sound is toggled on (🔊 button)
- Some browsers require user interaction before playing audio

### Game Not Loading
- Ensure all three files are in the same directory
- Check browser console for errors (F12)
- Try a different browser (Chrome, Firefox, Safari, Edge)

### Performance Issues
- Close other browser tabs
- Update your browser to the latest version
- Try reducing browser zoom level

## 🎮 Game Mechanics

### Collision Detection
- Precise hitbox detection
- Small margin for fair gameplay
- Visual feedback on collision

### Level Progression
- Speed increases by 15% per level
- Vehicle spawn rate increases
- More challenging traffic patterns

### Animation System
- Smooth frog hopping with easing
- Particle explosions on collision
- CSS-based UI animations

## 📝 Credits

Created as a classic arcade game tribute. Inspired by the timeless Frogger arcade game.

## 📄 License

Free to use and modify for personal and educational purposes.

---

**Enjoy the game! 🐸🚗💨**