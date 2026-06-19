# Audio System Design Document

## Overview
The game features a dynamic audio system with background music that adapts to gameplay, sound effects for actions, and user controls to toggle audio on/off.

---

## Background Music System

### Regular Wave Music
**Style**: Slow, simple flute melody
**Tempo**: 80-100 BPM
**Characteristics**:
- Peaceful, ancient Greek atmosphere
- Simple melodic pattern that loops
- Uses Web Audio API oscillators to emulate flute sound
- Sine wave with slight vibrato for flute-like quality

**Implementation**:
```javascript
class MusicManager {
    createFluteMelody() {
        // Pentatonic scale for ancient Greek feel
        // Notes: C, D, E, G, A (simplified)
        // Frequencies: 261.63, 293.66, 329.63, 392.00, 440.00 Hz
        
        // Slow tempo: each note ~0.5-1 second
        // Simple repeating pattern
    }
}
```

---

### Boss Wave Music
**Style**: Intense battle music with drums
**Tempo**: 140-160 BPM (faster)
**Characteristics**:
- Same flute melody but sped up (1.5-2x speed)
- Add drum beat (bass drum + snare pattern)
- More aggressive, urgent feel
- Maintains recognizable melody

**Drum Pattern**:
```
Bass Drum:  |X---|X---|X---|X---|  (quarter notes)
Snare:      |--X-|--X-|--X-|--X-|  (on beats 2 and 4)
```

**Implementation**:
```javascript
class MusicManager {
    transitionToBossMusic() {
        // Speed up melody playback
        // Add drum track
        // Increase volume slightly
        // Smooth transition (fade/crossfade)
    }
}
```

---

## Sound Effects

### Existing Sounds
- Attack: 200 Hz square wave, 0.1s
- Hit: 150 Hz sawtooth, 0.15s
- Block: 300 Hz triangle, 0.1s
- Damage: 100 Hz sawtooth, 0.2s
- Arrow Fired: 400 Hz triangle, 0.2s

### New Boss Sounds
- **Boss Spawn**: Deep dramatic chord (100-150 Hz), 1s
- **Special Attack Telegraph**: Rising pitch sweep, 0.5s
- **Special Attack Impact**: Heavy bass thump (80 Hz), 0.3s
- **Boss Defeat**: Triumphant fanfare, 2s
- **Victory**: Epic victory theme, 3s

---

## UI Controls

### Toggle Buttons Design

```
┌─────────────────────────────────────────────────┐
│  Game Canvas                                    │
│                                                 │
│  ┌──────────┐  ┌──────────┐                   │
│  │  🔊 SFX  │  │  🎵 Music │  (Top-right)     │
│  │   ON     │  │    ON     │                   │
│  └──────────┘  └──────────┘                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Position**: Top-right corner of canvas
**Size**: 80x30 pixels each
**Spacing**: 10 pixels between buttons

**States**:
- ON: Green background, white text
- OFF: Red background, white text

**Icons**:
- SFX: 🔊 (speaker icon)
- Music: 🎵 (music note icon)

---

## Implementation Details

### Music Manager Class

```javascript
class MusicManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.musicEnabled = true;
        this.currentTrack = null;
        this.isBossMusic = false;
        
        // Melody notes (pentatonic scale)
        this.melodyNotes = [
            261.63, // C4
            293.66, // D4
            329.63, // E4
            392.00, // G4
            440.00  // A4
        ];
        
        // Simple melody pattern (indices into melodyNotes)
        this.melodyPattern = [0, 2, 4, 3, 2, 0, 1, 0]; // C-E-A-G-E-C-D-C
        this.currentNoteIndex = 0;
        
        // Timing
        this.regularTempo = 600; // ms per note (slow)
        this.bossTempo = 300;    // ms per note (fast)
        this.currentTempo = this.regularTempo;
        
        // Drum pattern for boss music
        this.drumPattern = [
            { time: 0, type: 'bass' },
            { time: 0.25, type: 'snare' },
            { time: 0.5, type: 'bass' },
            { time: 0.75, type: 'snare' }
        ];
    }
    
    playFlute(frequency, duration) {
        if (!this.musicEnabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // Flute-like sound: sine wave with slight vibrato
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        // Add vibrato (slight frequency modulation)
        const vibrato = this.audioContext.createOscillator();
        const vibratoGain = this.audioContext.createGain();
        vibrato.frequency.value = 5; // 5 Hz vibrato
        vibratoGain.gain.value = 10; // Slight pitch variation
        
        vibrato.connect(vibratoGain);
        vibratoGain.connect(oscillator.frequency);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Envelope: soft attack and release for flute
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05); // Soft attack
        gainNode.gain.linearRampToValueAtTime(0.12, now + duration - 0.1);
        gainNode.gain.linearRampToValueAtTime(0, now + duration); // Soft release
        
        oscillator.start(now);
        vibrato.start(now);
        oscillator.stop(now + duration);
        vibrato.stop(now + duration);
    }
    
    playDrum(type) {
        if (!this.musicEnabled || !this.isBossMusic) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        const now = this.audioContext.currentTime;
        
        if (type === 'bass') {
            // Bass drum: low frequency, quick decay
            oscillator.frequency.setValueAtTime(150, now);
            oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.1);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
        } else if (type === 'snare') {
            // Snare: noise-like, sharp attack
            oscillator.type = 'triangle';
            oscillator.frequency.value = 200;
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            oscillator.start(now);
            oscillator.stop(now + 0.08);
        }
    }
    
    startMusic() {
        if (!this.musicEnabled) return;
        
        this.stopMusic();
        this.playNextNote();
    }
    
    playNextNote() {
        if (!this.musicEnabled) return;
        
        // Play current note
        const noteIndex = this.melodyPattern[this.currentNoteIndex];
        const frequency = this.melodyNotes[noteIndex];
        const duration = this.currentTempo / 1000;
        
        this.playFlute(frequency, duration);
        
        // Play drums if boss music
        if (this.isBossMusic) {
            this.playDrumPattern();
        }
        
        // Move to next note
        this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melodyPattern.length;
        
        // Schedule next note
        this.currentTrack = setTimeout(() => this.playNextNote(), this.currentTempo);
    }
    
    playDrumPattern() {
        this.drumPattern.forEach(drum => {
            setTimeout(() => this.playDrum(drum.type), drum.time * this.currentTempo);
        });
    }
    
    transitionToBossMusic() {
        this.isBossMusic = true;
        this.currentTempo = this.bossTempo;
        // Music will speed up on next note
    }
    
    transitionToRegularMusic() {
        this.isBossMusic = false;
        this.currentTempo = this.regularTempo;
        // Music will slow down on next note
    }
    
    stopMusic() {
        if (this.currentTrack) {
            clearTimeout(this.currentTrack);
            this.currentTrack = null;
        }
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            this.startMusic();
        } else {
            this.stopMusic();
        }
        return this.musicEnabled;
    }
}
```

---

### Sound Manager Class

```javascript
class SoundManager {
    constructor() {
        this.soundsEnabled = true;
    }
    
    playSound(soundFunction) {
        if (this.soundsEnabled) {
            soundFunction();
        }
    }
    
    toggleSounds() {
        this.soundsEnabled = !this.soundsEnabled;
        return this.soundsEnabled;
    }
}
```

---

### UI Toggle Buttons

```javascript
class AudioControls {
    constructor(canvas, soundManager, musicManager) {
        this.canvas = canvas;
        this.soundManager = soundManager;
        this.musicManager = musicManager;
        
        // Button dimensions and positions
        this.buttonWidth = 80;
        this.buttonHeight = 30;
        this.buttonSpacing = 10;
        this.buttonPadding = 10;
        
        // SFX button (right-most)
        this.sfxButton = {
            x: canvas.width - this.buttonPadding - this.buttonWidth,
            y: this.buttonPadding,
            width: this.buttonWidth,
            height: this.buttonHeight,
            label: 'SFX',
            icon: '🔊'
        };
        
        // Music button (left of SFX button)
        this.musicButton = {
            x: this.sfxButton.x - this.buttonWidth - this.buttonSpacing,
            y: this.buttonPadding,
            width: this.buttonWidth,
            height: this.buttonHeight,
            label: 'Music',
            icon: '🎵'
        };
    }
    
    draw(ctx) {
        // Draw SFX button
        this.drawButton(ctx, this.sfxButton, this.soundManager.soundsEnabled);
        
        // Draw Music button
        this.drawButton(ctx, this.musicButton, this.musicManager.musicEnabled);
    }
    
    drawButton(ctx, button, isEnabled) {
        // Background
        ctx.fillStyle = isEnabled ? '#4CAF50' : '#F44336'; // Green if ON, Red if OFF
        ctx.fillRect(button.x, button.y, button.width, button.height);
        
        // Border
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(button.x, button.y, button.width, button.height);
        
        // Icon and text
        ctx.fillStyle = '#FFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const centerX = button.x + button.width / 2;
        const centerY = button.y + button.height / 2;
        
        // Draw icon and label
        ctx.fillText(`${button.icon} ${button.label}`, centerX, centerY - 5);
        ctx.font = 'bold 10px Arial';
        ctx.fillText(isEnabled ? 'ON' : 'OFF', centerX, centerY + 8);
    }
    
    handleClick(x, y) {
        // Check SFX button
        if (this.isPointInButton(x, y, this.sfxButton)) {
            this.soundManager.toggleSounds();
            return true;
        }
        
        // Check Music button
        if (this.isPointInButton(x, y, this.musicButton)) {
            this.musicManager.toggleMusic();
            return true;
        }
        
        return false;
    }
    
    isPointInButton(x, y, button) {
        return x >= button.x && 
               x <= button.x + button.width &&
               y >= button.y && 
               y <= button.y + button.height;
    }
}
```

---

### Integration with Game Class

```javascript
class Game {
    constructor() {
        // ... existing code ...
        
        // Audio systems
        this.soundManager = new SoundManager();
        this.musicManager = new MusicManager();
        this.audioControls = new AudioControls(
            this.canvas, 
            this.soundManager, 
            this.musicManager
        );
        
        // Start music when game starts
        this.musicManager.startMusic();
        
        // Add click listener for audio controls
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    }
    
    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.audioControls.handleClick(x, y);
    }
    
    startGame() {
        // ... existing code ...
        
        // Ensure music is playing
        if (this.musicManager.musicEnabled && !this.musicManager.currentTrack) {
            this.musicManager.startMusic();
        }
        
        // Start with regular music
        this.musicManager.transitionToRegularMusic();
    }
    
    update() {
        // ... existing code ...
        
        // Check if entering/leaving boss wave
        const isBossWave = this.waveManager.isBossWave();
        
        if (isBossWave && !this.musicManager.isBossMusic) {
            this.musicManager.transitionToBossMusic();
        } else if (!isBossWave && this.musicManager.isBossMusic) {
            this.musicManager.transitionToRegularMusic();
        }
    }
    
    render() {
        // ... existing code ...
        
        // Draw audio controls on top of everything
        this.audioControls.draw(this.ctx);
    }
    
    // Wrap all sound calls with soundManager
    playAttackSound() {
        this.soundManager.playSound(this.sounds.attack);
    }
    
    playHitSound() {
        this.soundManager.playSound(this.sounds.hit);
    }
    
    // ... etc for all sounds ...
}
```

---

## Music Patterns

### Regular Wave Melody
```
Pattern: C - E - A - G - E - C - D - C
Tempo: 600ms per note (slow, peaceful)
Loop: Continuous
Feel: Ancient, contemplative
```

### Boss Wave Melody
```
Pattern: Same as regular (C - E - A - G - E - C - D - C)
Tempo: 300ms per note (2x faster, urgent)
Drums: Added bass and snare pattern
Loop: Continuous
Feel: Intense, battle-ready
```

---

## User Experience

### Audio Feedback
- **Game Start**: Music begins automatically
- **Boss Wave Start**: Music speeds up, drums added
- **Boss Defeated**: Music returns to normal tempo
- **Victory**: Special victory music plays
- **Toggle Buttons**: Visual feedback (color change) when clicked

### Accessibility
- Clear visual indicators (ON/OFF states)
- Buttons always visible in top-right
- Can toggle independently (music without SFX, or vice versa)
- Settings persist during gameplay

---

## Technical Considerations

### Web Audio API
- All sounds generated procedurally (no audio files needed)
- Low latency for responsive feedback
- Cross-browser compatible
- Lightweight implementation

### Performance
- Music runs on separate timer (doesn't block game loop)
- Minimal CPU usage (simple waveforms)
- No audio file loading delays

### Browser Compatibility
- Fallback for browsers without Web Audio API
- Graceful degradation (game still playable without audio)

---

## Implementation Checklist

- [ ] Create MusicManager class
- [ ] Create SoundManager class
- [ ] Create AudioControls class
- [ ] Implement flute melody generation
- [ ] Implement drum pattern for boss music
- [ ] Add music tempo transitions
- [ ] Create UI toggle buttons
- [ ] Add click handlers for buttons
- [ ] Integrate with game state changes
- [ ] Wrap existing sound calls with SoundManager
- [ ] Test audio on/off functionality
- [ ] Test music transitions during boss waves
- [ ] Ensure audio works across browsers

---

## Future Enhancements

- Volume sliders for fine-tuned control
- Different melodies for different boss types
- Victory fanfare with more complex composition
- Menu music (different from gameplay music)
- Audio settings persistence (localStorage)