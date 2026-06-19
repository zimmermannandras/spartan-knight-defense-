class ScoreManager {
    constructor() {
        this.currentScore = 0;
        this.highScore = this.loadHighScore();
        this.enemiesKilled = 0;
        this.bossesDefeated = 0;
        this.wavesCompleted = 0;
        this.killPoints = 10;
        this.waveBonus = 30;
        
        // Boss point values
        this.bossPoints = {
            'griffin': 500,
            'minotaur': 1000,
            'cyclops': 2000,
            'hydra': 3500,
            'zeus': 5000
        };
    }
    
    addKillPoints() {
        this.currentScore += this.killPoints;
        this.enemiesKilled++;
        this.updateHighScore();
    }
    
    addBossKillPoints(bossType) {
        const points = this.bossPoints[bossType] || 500;
        this.currentScore += points;
        this.enemiesKilled++;
        this.bossesDefeated++;
        this.updateHighScore();
    }
    
    addWaveBonus() {
        this.currentScore += this.waveBonus;
        this.wavesCompleted++;
        this.updateHighScore();
    }
    
    updateHighScore() {
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScore();
        }
    }
    
    saveHighScore() {
        try {
            localStorage.setItem('spartanKnightHighScore', this.highScore.toString());
        } catch (e) {
            console.log('Could not save high score');
        }
    }
    
    loadHighScore() {
        try {
            const saved = localStorage.getItem('spartanKnightHighScore');
            return saved ? parseInt(saved) : 0;
        } catch (e) {
            return 0;
        }
    }
    
    reset() {
        this.currentScore = 0;
        this.enemiesKilled = 0;
        this.bossesDefeated = 0;
        this.wavesCompleted = 0;
    }
    
    getStats() {
        return {
            score: this.currentScore,
            highScore: this.highScore,
            kills: this.enemiesKilled,
            bosses: this.bossesDefeated,
            waves: this.wavesCompleted
        };
    }
}

// Made with Bob
