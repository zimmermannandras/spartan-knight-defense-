class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gameState = 'menu'; // menu, playing, gameover, victory
        this.player = null;
        this.currentEnemy = null;
        this.waveManager = null;
        this.scoreManager = null;
        
        // Arrow system
        this.arrows = [];
        this.arrowSpawnTimer = 0;
        this.arrowSpawnInterval = 180; // 3 seconds at 60 FPS
        
        // Input handling
        this.keys = {};
        
        // Audio systems
        this.soundManager = new SoundManager();
        this.musicManager = new MusicManager();
        this.audioControls = new AudioControls(
            this.canvas,
            this.soundManager,
            this.musicManager
        );
        
        // Sound effects
        this.sounds = {
            attack: this.createSound(200, 0.1, 'square'),
            hit: this.createSound(150, 0.15, 'sawtooth'),
            block: this.createSound(300, 0.1, 'triangle'),
            damage: this.createSound(100, 0.2, 'sawtooth'),
            arrowFired: this.createSound(400, 0.2, 'triangle')
        };
        
        // Initialize
        this.init();
    }
    
    createSound(frequency, duration, type = 'sine') {
        return () => {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = type;
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (e) {
                console.log('Audio not supported');
            }
        };
    }
    
    init() {
        // Set up input listeners
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Add click listener for audio controls
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        // Start game loop
        this.gameLoop();
    }
    
    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.audioControls.handleClick(x, y);
    }
    
    startGame() {
        this.gameState = 'playing';
        this.player = new Player(this.canvas);
        this.waveManager = new WaveManager(this.canvas);
        this.scoreManager = new ScoreManager();
        this.currentEnemy = this.waveManager.spawnNextEnemy();
        
        // Reset arrow system
        this.arrows = [];
        this.arrowSpawnTimer = 0;
        this.arrowSpawnInterval = 180;
        
        // Start music if enabled
        if (this.musicManager.musicEnabled && !this.musicManager.currentTrack) {
            this.musicManager.startMusic();
        }
        
        // Start with regular music
        this.musicManager.transitionToRegularMusic();
    }
    
    handleKeyDown(e) {
        this.keys[e.key.toLowerCase()] = true;
        
        // Menu state
        if (this.gameState === 'menu' && e.key === ' ') {
            this.startGame();
        }
        
        // Game over state
        if (this.gameState === 'gameover' && e.key === ' ') {
            this.startGame();
        }
        
        // Victory state
        if (this.gameState === 'victory' && e.key === ' ') {
            this.startGame();
        }
        
        // Playing state
        if (this.gameState === 'playing') {
            // Attack
            if (e.key.toLowerCase() === 'a') {
                if (this.player.attack()) {
                    this.soundManager.playSound(this.sounds.attack);
                }
            }
            
            // Jump
            if (e.key === 'ArrowUp') {
                this.player.jump();
            }
        }
    }
    
    handleKeyUp(e) {
        this.keys[e.key.toLowerCase()] = false;
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // Update player movement
        this.player.movingLeft = this.keys['arrowleft'] || false;
        this.player.movingRight = this.keys['arrowright'] || false;
        
        // Update player blocking
        this.player.block(this.keys['s'] || false);
        
        // Update player
        this.player.update();
        
        // Update current enemy
        if (this.currentEnemy) {
            const enemyAttacking = this.currentEnemy.update(this.player);
            
            // Check if enemy is attacking
            if (enemyAttacking) {
                const damageBlocked = !this.player.takeDamage(this.currentEnemy.attackDamage);
                if (damageBlocked) {
                    this.soundManager.playSound(this.sounds.block);
                } else {
                    this.soundManager.playSound(this.sounds.damage);
                }
            }
        }
        
        // Check for boss music transitions
        const isBossWave = this.waveManager.isBossWave();
        if (isBossWave && !this.musicManager.isBossMusic) {
            this.musicManager.transitionToBossMusic();
        } else if (!isBossWave && this.musicManager.isBossMusic) {
            this.musicManager.transitionToRegularMusic();
        }
        
        // Arrow/Lightning spawning system
        const isZeusWave = this.waveManager.currentWave === 15;
        
        // Only spawn projectiles if not boss wave OR if Zeus wave
        if (!isBossWave || isZeusWave) {
            this.arrowSpawnTimer++;
            if (this.arrowSpawnTimer >= this.arrowSpawnInterval) {
                // Spawn Lightning for Zeus, Arrow for others
                if (isZeusWave) {
                    this.arrows.push(new Lightning(this.canvas));
                } else {
                    this.arrows.push(new Arrow(this.canvas));
                }
                this.soundManager.playSound(this.sounds.arrowFired);
                this.arrowSpawnTimer = 0;
                // Add randomness: ±60 frames (±1 second)
                this.arrowSpawnInterval = 180 + Math.floor(Math.random() * 120 - 60);
            }
        }
        
        // Update arrows and check collisions
        this.arrows = this.arrows.filter(arrow => {
            arrow.update();
            
            // Check collision with player
            if (arrow.active && this.checkBoxCollision(
                arrow.getHitbox(),
                {
                    x: this.player.x,
                    y: this.player.y,
                    width: this.player.width,
                    height: this.player.height
                }
            )) {
                // Player hit by arrow
                this.player.takeDamage(15);
                this.soundManager.playSound(this.sounds.damage);
                arrow.active = false;
            }
            
            return arrow.active;
        });
        
        // Check collisions
        this.checkCollisions();
        
        // Update wave manager
        const waveState = this.waveManager.update();
        if (waveState === 'next_wave') {
            // Regenerate player shield for new wave
            this.player.regenerateShield();
            // Award wave bonus
            this.scoreManager.addWaveBonus();
            // Spawn first enemy of new wave
            this.currentEnemy = this.waveManager.spawnNextEnemy();
        }
        
        // Check if player is dead
        if (this.player.health <= 0) {
            this.gameState = 'gameover';
            this.musicManager.stopMusic();
        }
        
        // Check for victory (Zeus defeated on wave 15)
        if (this.waveManager.currentWave === 15 &&
            this.currentEnemy === null &&
            this.waveManager.isWaveComplete) {
            this.gameState = 'victory';
            this.musicManager.stopMusic();
        }
    }
    
    checkCollisions() {
        if (!this.currentEnemy || !this.player.isAttacking) return;
        
        // Skip if attack already hit this swing
        if (this.player.attackHitThisFrame) {
            console.log('Attack already hit - skipping collision check');
            return;
        }
        
        const attackBox = this.player.getAttackHitbox();
        if (!attackBox) return;
        
        // Check if attack hits enemy
        if (this.checkBoxCollision(attackBox, {
            x: this.currentEnemy.x,
            y: this.currentEnemy.y,
            width: this.currentEnemy.width,
            height: this.currentEnemy.height
        })) {
            // Mark that this attack has hit
            this.player.attackHitThisFrame = true;
            console.log('Attack hit! Flag set to prevent multiple hits');
            
            // Enemy takes damage
            const enemyDied = this.currentEnemy.takeDamage(this.player.attackDamage);
            
            // Play hit sound
            this.soundManager.playSound(this.sounds.hit);
            
            if (enemyDied) {
                // Award points based on enemy type
                if (this.currentEnemy.isBoss) {
                    this.scoreManager.addBossKillPoints(this.currentEnemy.bossType);
                    // Heal player for defeating boss
                    this.player.health = Math.min(this.player.maxHealth, this.player.health + 50);
                } else {
                    this.scoreManager.addKillPoints();
                }
                
                // Check if wave is complete
                const waveComplete = this.waveManager.enemyDefeated();
                
                // Spawn next enemy if available
                if (!waveComplete && this.waveManager.needsNewEnemy()) {
                    this.currentEnemy = this.waveManager.spawnNextEnemy();
                } else if (waveComplete) {
                    this.currentEnemy = null;
                }
            }
        }
    }
    
    checkBoxCollision(box1, box2) {
        return box1.x < box2.x + box2.width &&
               box1.x + box1.width > box2.x &&
               box1.y < box2.y + box2.height &&
               box1.y + box1.height > box2.y;
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.drawBackground();
        
        if (this.gameState === 'menu') {
            this.drawMenu();
        } else if (this.gameState === 'playing') {
            this.drawGame();
        } else if (this.gameState === 'gameover') {
            // Draw the game state first, then overlay game over screen
            this.drawGame();
            this.drawGameOver();
        } else if (this.gameState === 'victory') {
            // Draw the game state first, then overlay victory screen
            this.drawGame();
            this.drawVictory();
        }
        
        // Always draw audio controls on top of everything in all states
        this.audioControls.draw(this.ctx);
    }
    
    drawBackground() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#4A90E2');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Sun
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width - 80, 80, 40, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Ground
        this.ctx.fillStyle = '#D2B48C';
        this.ctx.fillRect(0, this.canvas.height - 120, this.canvas.width, 120);
        
        // Greek columns
        this.drawColumn(150, this.canvas.height - 120 - 150);
        this.drawColumn(400, this.canvas.height - 120 - 180);
        this.drawColumn(650, this.canvas.height - 120 - 160);
    }
    
    drawColumn(x, y) {
        const width = 40;
        const height = 150;
        
        // Column body
        this.ctx.fillStyle = '#F5F5F5';
        this.ctx.fillRect(x, y, width, height);
        
        // Column lines (fluting)
        this.ctx.strokeStyle = '#E0E0E0';
        this.ctx.lineWidth = 2;
        for (let i = 1; i < 4; i++) {
            const lineX = x + (width / 4) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(lineX, y);
            this.ctx.lineTo(lineX, y + height);
            this.ctx.stroke();
        }
        
        // Capital (top)
        this.ctx.fillStyle = '#DCDCDC';
        this.ctx.fillRect(x - 5, y - 15, width + 10, 15);
        
        // Base
        this.ctx.fillRect(x - 5, y + height, width + 10, 10);
    }
    
    drawMenu() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SPARTAN KNIGHT DEFENSE', this.canvas.width / 2, 200);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Defend against endless waves of enemies!', this.canvas.width / 2, 280);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillText('← → : Move', this.canvas.width / 2, 330);
        this.ctx.fillText('↑ : Jump', this.canvas.width / 2, 360);
        this.ctx.fillText('A : Attack', this.canvas.width / 2, 390);
        this.ctx.fillText('S : Shield (3 blocks)', this.canvas.width / 2, 420);
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText('Press SPACE to Start', this.canvas.width / 2, 480);
        
        // High score
        if (this.scoreManager && this.scoreManager.highScore > 0) {
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = '20px Arial';
            this.ctx.fillText(`High Score: ${this.scoreManager.highScore}`, this.canvas.width / 2, 540);
        }
    }
    
    drawGame() {
        // Draw arrows
        this.arrows.forEach(arrow => arrow.draw(this.ctx));
        
        // Draw player
        if (this.player) {
            this.player.draw(this.ctx);
        }
        
        // Draw current enemy
        if (this.currentEnemy) {
            this.currentEnemy.draw(this.ctx);
        }
        
        // Draw UI
        this.drawUI();
    }
    
    drawUI() {
        // Player health bar
        const healthBarWidth = 200;
        const healthBarHeight = 20;
        const healthBarX = 20;
        const healthBarY = 20;
        
        // Background
        this.ctx.fillStyle = '#8B0000';
        this.ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
        
        // Health
        const healthPercent = this.player.health / this.player.maxHealth;
        this.ctx.fillStyle = healthPercent > 0.5 ? '#00FF00' : (healthPercent > 0.25 ? '#FFA500' : '#FF0000');
        this.ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercent, healthBarHeight);
        
        // Border
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
        
        // Health text
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`HP: ${Math.ceil(this.player.health)}/${this.player.maxHealth}`, healthBarX + 5, healthBarY + 15);
        
        // Shield durability
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText(`Shield: ${this.player.shieldDurability}/3`, healthBarX, healthBarY + 40);
        
        // Wave counter
        const waveInfo = this.waveManager.getWaveInfo();
        this.ctx.textAlign = 'center';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText(`Wave ${waveInfo.currentWave}`, this.canvas.width / 2, 35);
        
        if (waveInfo.isTransitioning) {
            this.ctx.font = '20px Arial';
            this.ctx.fillStyle = '#FFF';
            this.ctx.fillText(`Next wave in ${waveInfo.transitionTimeLeft}...`, this.canvas.width / 2, 65);
        } else {
            this.ctx.font = '16px Arial';
            this.ctx.fillStyle = '#FFF';
            this.ctx.fillText(`Enemies: ${waveInfo.enemiesRemaining}/${waveInfo.totalEnemies}`, this.canvas.width / 2, 60);
        }
        
        // Score
        const stats = this.scoreManager.getStats();
        this.ctx.textAlign = 'right';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText(`Score: ${stats.score}`, this.canvas.width - 20, 30);
        
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillText(`Kills: ${stats.kills}`, this.canvas.width - 20, 50);
    }
    
    drawGameOver() {
        // Overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const stats = this.scoreManager.getStats();
        
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = 'bold 56px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, 200);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '28px Arial';
        this.ctx.fillText(`Final Score: ${stats.score}`, this.canvas.width / 2, 270);
        this.ctx.fillText(`Wave Reached: ${this.waveManager.currentWave}`, this.canvas.width / 2, 310);
        this.ctx.fillText(`Enemies Defeated: ${stats.kills}`, this.canvas.width / 2, 350);
        
        if (stats.score === stats.highScore && stats.score > 0) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.fillText('NEW HIGH SCORE!', this.canvas.width / 2, 400);
        } else if (stats.highScore > 0) {
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = '20px Arial';
            this.ctx.fillText(`High Score: ${stats.highScore}`, this.canvas.width / 2, 400);
        }
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText('Press SPACE to Restart', this.canvas.width / 2, 480);
    }
    
    drawVictory() {
        // Overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const stats = this.scoreManager.getStats();
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 56px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('VICTORY!', this.canvas.width / 2, 150);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '28px Arial';
        this.ctx.fillText('THE GODS HAVE BEEN DEFEATED!', this.canvas.width / 2, 200);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Final Score: ${stats.score}`, this.canvas.width / 2, 270);
        this.ctx.fillText(`Waves Completed: 15`, this.canvas.width / 2, 310);
        this.ctx.fillText(`Enemies Defeated: ${stats.kills}`, this.canvas.width / 2, 350);
        this.ctx.fillText(`Bosses Defeated: ${stats.bosses}`, this.canvas.width / 2, 390);
        
        if (stats.score === stats.highScore && stats.score > 0) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.fillText('NEW HIGH SCORE!', this.canvas.width / 2, 440);
        } else if (stats.highScore > 0) {
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = '20px Arial';
            this.ctx.fillText(`High Score: ${stats.highScore}`, this.canvas.width / 2, 440);
        }
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText('Press SPACE to Play Again', this.canvas.width / 2, 520);
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new Game();
});

// Made with Bob
