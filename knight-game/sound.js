class SoundManager {
    constructor() {
        this.volumeLevel = 4; // 0-4, where 0 is off
    }
    
    get soundsEnabled() {
        return this.volumeLevel > 0;
    }
    
    get volume() {
        // Convert level (0-4) to volume (0.0-1.0)
        return this.volumeLevel / 4;
    }
    
    playSound(soundFunction) {
        if (this.soundsEnabled && soundFunction) {
            soundFunction();
        }
    }
    
    setVolumeLevel(level) {
        this.volumeLevel = Math.max(0, Math.min(4, level));
        return this.volumeLevel;
    }
    
    increaseVolume() {
        return this.setVolumeLevel(this.volumeLevel + 1);
    }
    
    decreaseVolume() {
        return this.setVolumeLevel(this.volumeLevel - 1);
    }
    
    toggleSounds() {
        // Legacy support: toggle between off (0) and max (4)
        this.volumeLevel = this.volumeLevel > 0 ? 0 : 4;
        return this.soundsEnabled;
    }
}

// Made with Bob