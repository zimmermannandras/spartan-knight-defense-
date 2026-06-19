class WaveManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.currentWave = 1;
        this.enemiesInWave = 0;
        this.enemiesSpawned = 0;
        this.enemiesDefeated = 0;
        this.enemyQueue = [];
        this.isWaveComplete = false;
        this.waveTransitionTimer = 0;
        this.waveTransitionDuration = 120; // 2 seconds at 60 FPS
        
        this.initializeWave();
    }
    
    initializeWave() {
        // Check if this is a boss wave
        if (this.isBossWave()) {
            this.enemiesInWave = 1; // Boss waves have only the boss
        } else {
            // Calculate enemies for this wave (wave number + 1), capped at 7
            this.enemiesInWave = Math.min(7, this.currentWave + 1);
        }
        
        this.enemiesSpawned = 0;
        this.enemiesDefeated = 0;
        this.isWaveComplete = false;
        
        // Create enemy spawn queue
        this.enemyQueue = [];
        for (let i = 0; i < this.enemiesInWave; i++) {
            // Alternate spawn sides, with some randomization
            const spawnSide = Math.random() > 0.5 ? 'left' : 'right';
            this.enemyQueue.push(spawnSide);
        }
    }
    
    isBossWave() {
        return this.currentWave % 3 === 0 && this.currentWave <= 15;
    }
    
    getBossType() {
        switch(this.currentWave) {
            case 3: return 'griffin';
            case 6: return 'minotaur';
            case 9: return 'cyclops';
            case 12: return 'hydra';
            case 15: return 'zeus';
            default: return null;
        }
    }
    
    getDifficultyMultiplier() {
        // Speed increases every 3 waves
        const speedMultiplier = 1 + Math.floor(this.currentWave / 3) * 0.1;
        
        // Attack speed increases every 5 waves
        const attackMultiplier = 1 + Math.floor(this.currentWave / 5) * 0.15;
        
        return Math.max(speedMultiplier, attackMultiplier);
    }
    
    spawnNextEnemy() {
        if (this.enemiesSpawned < this.enemiesInWave) {
            this.enemiesSpawned++;
            
            // Spawn boss if this is a boss wave
            if (this.isBossWave()) {
                return this.spawnBoss();
            }
            
            // Spawn regular enemy
            const spawnSide = this.enemyQueue[this.enemiesSpawned - 1];
            const difficultyMultiplier = this.getDifficultyMultiplier();
            return new Enemy(this.canvas, spawnSide, difficultyMultiplier);
        }
        return null;
    }
    
    spawnBoss() {
        const bossType = this.getBossType();
        
        switch(bossType) {
            case 'griffin':
                return new Griffin(this.canvas, this.currentWave);
            case 'minotaur':
                return new Minotaur(this.canvas, this.currentWave);
            case 'cyclops':
                return new Cyclops(this.canvas, this.currentWave);
            case 'hydra':
                return new Hydra(this.canvas, this.currentWave);
            case 'zeus':
                return new Zeus(this.canvas, this.currentWave);
            default:
                return null;
        }
    }
    
    enemyDefeated() {
        this.enemiesDefeated++;
        
        // Check if wave is complete
        if (this.enemiesDefeated >= this.enemiesInWave) {
            this.isWaveComplete = true;
            this.waveTransitionTimer = this.waveTransitionDuration;
            return true; // Wave complete
        }
        return false; // Wave continues
    }
    
    update() {
        if (this.isWaveComplete && this.waveTransitionTimer > 0) {
            this.waveTransitionTimer--;
            
            if (this.waveTransitionTimer === 0) {
                // Start next wave
                this.currentWave++;
                this.initializeWave();
                return 'next_wave';
            }
            return 'transition';
        }
        return 'active';
    }
    
    needsNewEnemy() {
        return this.enemiesSpawned < this.enemiesInWave;
    }
    
    getWaveInfo() {
        return {
            currentWave: this.currentWave,
            enemiesRemaining: this.enemiesInWave - this.enemiesDefeated,
            totalEnemies: this.enemiesInWave,
            isTransitioning: this.isWaveComplete && this.waveTransitionTimer > 0,
            transitionTimeLeft: Math.ceil(this.waveTransitionTimer / 60)
        };
    }
}

// Made with Bob
