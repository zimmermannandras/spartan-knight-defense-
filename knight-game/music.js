class MusicManager {
    constructor() {
        this.audioContext = null;
        this.volumeLevel = 4; // 0-4, where 0 is off
        this.currentTrack = null;
        this.isBossMusic = false;
        
        // Timing
        this.regularTempo = 1600;  // ms per beat (slow drums for normal waves)
        this.bossTempo = 600;      // ms per beat (fast drums for boss)
        this.currentTempo = this.regularTempo;
        
        // Drum pattern (same for both, tempo changes the speed)
        this.drumPattern = [
            { time: 0, type: 'bass' },
            { time: 0.25, type: 'snare' },
            { time: 0.5, type: 'bass' },
            { time: 0.75, type: 'snare' }
        ];
        
        this.currentBeatIndex = 0;
    }
    
    get musicEnabled() {
        return this.volumeLevel > 0;
    }
    
    get volume() {
        // Convert level (0-4) to volume (0.0-1.0)
        return this.volumeLevel / 4;
    }
    
    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    playDrum(type) {
        if (!this.musicEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        const now = this.audioContext.currentTime;
        
        if (type === 'bass') {
            // Bass drum: low frequency, quick decay, scaled by volume
            oscillator.frequency.setValueAtTime(150, now);
            oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.1);
            gainNode.gain.setValueAtTime(0.3 * this.volume, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
        } else if (type === 'snare') {
            // Snare: noise-like, sharp attack, scaled by volume
            oscillator.type = 'triangle';
            oscillator.frequency.value = 200;
            gainNode.gain.setValueAtTime(0.2 * this.volume, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            oscillator.start(now);
            oscillator.stop(now + 0.08);
        }
    }
    
    startMusic() {
        this.initAudioContext();
        if (!this.musicEnabled) return;
        
        this.stopMusic();
        this.currentBeatIndex = 0;
        this.playNextBeat();
    }
    
    playNextBeat() {
        if (!this.musicEnabled) return;
        
        // Play drum pattern
        this.playDrumPattern();
        
        // Schedule next beat
        this.currentTrack = setTimeout(() => this.playNextBeat(), this.currentTempo);
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
    
    setVolumeLevel(level) {
        this.volumeLevel = Math.max(0, Math.min(4, level));
        if (this.volumeLevel === 0) {
            this.stopMusic();
        } else if (!this.currentTrack) {
            this.startMusic();
        }
        return this.volumeLevel;
    }
    
    increaseVolume() {
        return this.setVolumeLevel(this.volumeLevel + 1);
    }
    
    decreaseVolume() {
        return this.setVolumeLevel(this.volumeLevel - 1);
    }
    
    toggleMusic() {
        // Legacy support: toggle between off (0) and max (4)
        this.volumeLevel = this.volumeLevel > 0 ? 0 : 4;
        if (this.musicEnabled) {
            this.startMusic();
        } else {
            this.stopMusic();
        }
        return this.musicEnabled;
    }
}

// Made with Bob