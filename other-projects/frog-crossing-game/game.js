// Game Configuration
const CONFIG = {
    canvas: {
        width: 800,
        height: 600
    },
    frog: {
        size: 40,
        speed: 50,
        startX: 380,
        startY: 550
    },
    lane: {
        height: 60,
        count: 8,
        safeZoneTop: 60,
        safeZoneBottom: 60
    },
    vehicle: {
        minWidth: 60,
        maxWidth: 120,
        height: 40,
        baseSpeed: 2,
        spawnInterval: 2000
    },
    game: {
        startingLives: 3,
        pointsPerCrossing: 100,
        bonusPerLife: 50,
        levelSpeedIncrease: 0.15
    }
};

// Game State
class GameState {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.lives = CONFIG.game.startingLives;
        this.isPlaying = false;
        this.isPaused = false;
        this.soundEnabled = true;
    }

    reset() {
        this.score = 0;
        this.level = 1;
        this.lives = CONFIG.game.startingLives;
        this.isPlaying = false;
        this.isPaused = false;
    }

    addScore(points) {
        this.score += points;
    }

    loseLife() {
        this.lives--;
        return this.lives > 0;
    }

    nextLevel() {
        this.level++;
    }
}

// Sound Manager
class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.musicEnabled = true;
        this.initSounds();
        this.backgroundMusicPlaying = false;
        this.musicGainNode = null;
        this.musicTimeouts = []; // Track all music timeouts
        this.activeOscillators = []; // Track active oscillators
    }

    initSounds() {
        // Create simple sound effects using Web Audio API
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    startBackgroundMusic() {
        // Always stop any existing music first
        this.stopBackgroundMusic();
        
        if (!this.enabled || !this.musicEnabled) return;
        
        this.backgroundMusicPlaying = true;
        this.playBackgroundLoop();
    }

    stopBackgroundMusic() {
        this.backgroundMusicPlaying = false;
        
        // Clear all scheduled timeouts
        this.musicTimeouts.forEach(timeout => clearTimeout(timeout));
        this.musicTimeouts = [];
        
        // Stop all active oscillators
        this.activeOscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {
                // Oscillator may already be stopped
            }
        });
        this.activeOscillators = [];
        
        if (this.musicGainNode) {
            try {
                this.musicGainNode.gain.exponentialRampToValueAtTime(
                    0.01,
                    this.audioContext.currentTime + 0.1
                );
            } catch (e) {
                // Gain node may not exist
            }
        }
    }

    playBackgroundLoop() {
        if (!this.backgroundMusicPlaying) return;

        // Classic arcade-style melody (inspired by retro games)
        const melody = [
            { freq: 523, duration: 0.2 },  // C5
            { freq: 659, duration: 0.2 },  // E5
            { freq: 784, duration: 0.2 },  // G5
            { freq: 659, duration: 0.2 },  // E5
            { freq: 523, duration: 0.2 },  // C5
            { freq: 392, duration: 0.2 },  // G4
            { freq: 523, duration: 0.2 },  // C5
            { freq: 659, duration: 0.4 },  // E5
            { freq: 587, duration: 0.2 },  // D5
            { freq: 523, duration: 0.2 },  // C5
            { freq: 494, duration: 0.2 },  // B4
            { freq: 440, duration: 0.2 },  // A4
            { freq: 494, duration: 0.2 },  // B4
            { freq: 523, duration: 0.4 },  // C5
        ];

        let time = 0;
        melody.forEach((note, index) => {
            const timeout = setTimeout(() => {
                if (this.backgroundMusicPlaying) {
                    this.playMusicNote(note.freq, note.duration);
                }
            }, time * 1000);
            this.musicTimeouts.push(timeout);
            time += note.duration;
        });

        // Loop the melody
        const loopTimeout = setTimeout(() => {
            if (this.backgroundMusicPlaying) {
                this.playBackgroundLoop();
            }
        }, time * 1000);
        this.musicTimeouts.push(loopTimeout);
    }

    playMusicNote(frequency, duration) {
        if (!this.enabled || !this.musicEnabled || !this.backgroundMusicPlaying) return;

        const oscillator = this.audioContext.createOscillator();
        this.musicGainNode = this.audioContext.createGain();
        
        oscillator.connect(this.musicGainNode);
        this.musicGainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'square'; // Retro sound
        
        // Lower volume for background music
        this.musicGainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
        this.musicGainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration
        );
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
        
        // Track this oscillator
        this.activeOscillators.push(oscillator);
        
        // Remove from tracking after it stops
        setTimeout(() => {
            const index = this.activeOscillators.indexOf(oscillator);
            if (index > -1) {
                this.activeOscillators.splice(index, 1);
            }
        }, duration * 1000 + 100);
    }

    playJump() {
        if (!this.enabled) return;
        this.playTone(200, 0.1, 'sine');
    }

    playCollision() {
        if (!this.enabled) return;
        this.playTone(100, 0.3, 'sawtooth');
    }

    playWin() {
        if (!this.enabled) return;
        this.playMelody([
            { freq: 523, duration: 0.1 },
            { freq: 659, duration: 0.1 },
            { freq: 784, duration: 0.2 }
        ]);
    }

    playGameOver() {
        if (!this.enabled) return;
        this.playMelody([
            { freq: 392, duration: 0.2 },
            { freq: 349, duration: 0.2 },
            { freq: 294, duration: 0.4 }
        ]);
    }

    playSplash() {
        if (!this.enabled) return;
        // Water splash sound - descending bubbles
        this.playMelody([
            { freq: 800, duration: 0.05 },
            { freq: 600, duration: 0.05 },
            { freq: 400, duration: 0.1 },
            { freq: 200, duration: 0.15 }
        ]);
    }

    playTone(frequency, duration, type = 'sine') {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playMelody(notes) {
        let time = 0;
        notes.forEach(note => {
            setTimeout(() => this.playTone(note.freq, note.duration), time * 1000);
            time += note.duration;
        });
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Particle System
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.life = 1;
        this.decay = 0.02;
        this.size = Math.random() * 6 + 2;
        this.color = `hsl(${Math.random() * 60}, 100%, 50%)`;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // gravity
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

// Frog Class
class Frog {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = CONFIG.frog.size;
        this.targetX = x;
        this.targetY = y;
        this.isMoving = false;
        this.animationProgress = 0;
        this.direction = 0; // 0: up, 1: right, 2: down, 3: left
        this.ridingLog = null; // Track which log the frog is on
    }

    move(dx, dy) {
        if (this.isMoving) return;

        const newX = this.x + dx * CONFIG.frog.speed;
        const newY = this.y + dy * CONFIG.frog.speed;

        // Boundary checking
        if (newX < 0 || newX > CONFIG.canvas.width - this.size) return;
        if (newY < 0 || newY > CONFIG.canvas.height - this.size) return;

        this.targetX = newX;
        this.targetY = newY;
        this.isMoving = true;
        this.animationProgress = 0;
        this.ridingLog = null; // Stop riding when moving

        // Set direction
        if (dy < 0) this.direction = 0;
        else if (dx > 0) this.direction = 1;
        else if (dy > 0) this.direction = 2;
        else if (dx < 0) this.direction = 3;
    }

    update() {
        if (this.isMoving) {
            this.animationProgress += 0.15;
            
            const t = Math.min(this.animationProgress, 1);
            const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease in-out
            
            this.x = this.x + (this.targetX - this.x) * 0.2;
            this.y = this.y + (this.targetY - this.y) * 0.2;

            if (this.animationProgress >= 1) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.isMoving = false;
            }
        } else if (this.ridingLog) {
            // Move with the log
            this.x += this.ridingLog.speed * this.ridingLog.direction;
            this.targetX = this.x;
            
            // Check if frog went off screen while riding
            if (this.x < -this.size || this.x > CONFIG.canvas.width) {
                this.ridingLog = null;
            }
        }
    }

    setRidingLog(log) {
        this.ridingLog = log;
    }

    isOffScreen() {
        return this.x < -this.size || this.x > CONFIG.canvas.width;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate((this.direction * Math.PI) / 2);

        // Hop animation
        const hopOffset = this.isMoving ? Math.sin(this.animationProgress * Math.PI) * 10 : 0;
        ctx.translate(0, -hopOffset);

        // Draw frog body
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size / 2, this.size / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-8, -8, 6, 0, Math.PI * 2);
        ctx.arc(8, -8, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-8, -8, 3, 0, Math.PI * 2);
        ctx.arc(8, -8, 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw smile
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI);
        ctx.stroke();

        ctx.restore();
    }

    reset() {
        this.x = CONFIG.frog.startX;
        this.y = CONFIG.frog.startY;
        this.targetX = this.x;
        this.targetY = this.y;
        this.isMoving = false;
        this.direction = 0;
    }

    hasReachedTop() {
        return this.y < CONFIG.lane.safeZoneTop;
    }

    getBounds() {
        return {
            x: this.x + 5,
            y: this.y + 5,
            width: this.size - 10,
            height: this.size - 10
        };
    }
}

// Vehicle Class
class Vehicle {
    constructor(lane, direction, speed) {
        this.lane = lane;
        this.direction = direction; // 1: right, -1: left
        this.speed = speed;
        this.width = Math.random() * (CONFIG.vehicle.maxWidth - CONFIG.vehicle.minWidth) + CONFIG.vehicle.minWidth;
        this.height = CONFIG.vehicle.height;
        this.y = CONFIG.lane.safeZoneTop + lane * CONFIG.lane.height + (CONFIG.lane.height - this.height) / 2;
        
        if (direction > 0) {
            this.x = -this.width;
        } else {
            this.x = CONFIG.canvas.width;
        }

        this.color = this.getRandomColor();
        this.type = Math.floor(Math.random() * 3); // 0: car, 1: truck, 2: bus
    }

    getRandomColor() {
        const colors = ['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speed * this.direction;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Add details based on type
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        if (this.type === 0) { // Car
            ctx.fillRect(this.x + this.width * 0.3, this.y + 5, this.width * 0.4, this.height - 10);
        } else if (this.type === 1) { // Truck
            ctx.fillRect(this.x + this.width * 0.7, this.y + 5, this.width * 0.25, this.height - 10);
        } else { // Bus
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(this.x + this.width * (0.2 + i * 0.25), this.y + 5, this.width * 0.15, this.height - 10);
            }
        }

        // Wheels
        ctx.fillStyle = '#1f2937';
        const wheelY = this.y + this.height - 5;
        ctx.beginPath();
        ctx.arc(this.x + 15, wheelY, 5, 0, Math.PI * 2);
        ctx.arc(this.x + this.width - 15, wheelY, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    isOffScreen() {
        return (this.direction > 0 && this.x > CONFIG.canvas.width) ||
               (this.direction < 0 && this.x + this.width < 0);
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Log Class (for river lanes)
class Log {
    constructor(lane, direction, speed) {
        this.lane = lane;
        this.direction = direction; // 1: right, -1: left
        this.speed = speed;
        this.width = Math.random() * 100 + 80; // Logs are 80-180 pixels wide
        this.height = CONFIG.vehicle.height;
        this.y = CONFIG.lane.safeZoneTop + lane * CONFIG.lane.height + (CONFIG.lane.height - this.height) / 2;
        this.isCrocodile = false;
        
        if (direction > 0) {
            this.x = -this.width;
        } else {
            this.x = CONFIG.canvas.width;
        }
    }

    update() {
        this.x += this.speed * this.direction;
    }

    draw(ctx) {
        // Draw log (brown with texture)
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add wood texture lines
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        for (let i = 0; i < this.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(this.x + i, this.y);
            ctx.lineTo(this.x + i, this.y + this.height);
            ctx.stroke();
        }
        
        // Add highlight
        ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
        ctx.fillRect(this.x, this.y, this.width, this.height / 3);
    }

    isOffScreen() {
        return (this.direction > 0 && this.x > CONFIG.canvas.width) ||
               (this.direction < 0 && this.x + this.width < 0);
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    getHeadBounds() {
        // Only relevant for crocodiles
        return null;
    }
}

// Crocodile Class (dangerous logs from level 4+)
class Crocodile extends Log {
    constructor(lane, direction, speed) {
        super(lane, direction, speed);
        this.isCrocodile = true;
        this.segmentWidth = 40; // Each segment is 40 pixels
        this.width = this.segmentWidth * 3; // 3 segments total (120 pixels)
    }

    draw(ctx) {
        // Draw crocodile body (green)
        ctx.fillStyle = '#2d5016';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw segments
        for (let i = 0; i < 3; i++) {
            const segX = this.direction > 0 ? this.x + i * this.segmentWidth : this.x + (2 - i) * this.segmentWidth;
            
            // Segment outline
            ctx.strokeStyle = '#1a3010';
            ctx.lineWidth = 2;
            ctx.strokeRect(segX, this.y, this.segmentWidth, this.height);
            
            // Scales/texture
            ctx.fillStyle = '#3d6020';
            for (let j = 0; j < 3; j++) {
                ctx.fillRect(segX + 5 + j * 10, this.y + 5, 8, this.height - 10);
            }
        }
        
        // Draw head (first segment in direction of movement)
        const headX = this.direction > 0 ? this.x : this.x + this.segmentWidth * 2;
        
        // Head is darker/more detailed
        ctx.fillStyle = '#1a3010';
        ctx.fillRect(headX, this.y, this.segmentWidth, this.height);
        
        // Eyes
        ctx.fillStyle = '#ff0000';
        const eyeY = this.y + this.height / 3;
        if (this.direction > 0) {
            ctx.beginPath();
            ctx.arc(headX + 30, eyeY, 4, 0, Math.PI * 2);
            ctx.arc(headX + 30, eyeY + 15, 4, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(headX + 10, eyeY, 4, 0, Math.PI * 2);
            ctx.arc(headX + 10, eyeY + 15, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Teeth
        ctx.fillStyle = '#ffffff';
        const teethY = this.y + this.height - 5;
        for (let i = 0; i < 4; i++) {
            const teethX = this.direction > 0 ? headX + 5 + i * 8 : headX + 5 + i * 8;
            ctx.fillRect(teethX, teethY, 3, 5);
        }
    }

    getHeadBounds() {
        // Return bounds for the dangerous head segment
        const headX = this.direction > 0 ? this.x : this.x + this.segmentWidth * 2;
        return {
            x: headX,
            y: this.y,
            width: this.segmentWidth,
            height: this.height
        };
    }
}

// Lane Manager
class LaneManager {
    constructor(level) {
        this.lanes = [];
        this.level = level;
        this.initLanes();
    }

    initLanes() {
        // From level 3 onwards, last 3 lanes are river with logs
        const hasRiver = this.level >= 3;
        const riverLanes = hasRiver ? 3 : 0;
        const roadLanes = CONFIG.lane.count - riverLanes;

        for (let i = 0; i < CONFIG.lane.count; i++) {
            const direction = i % 2 === 0 ? 1 : -1;
            const baseSpeed = CONFIG.vehicle.baseSpeed + Math.random() * 2;
            // Apply 20% speed reduction (multiply by 0.8) while maintaining progressive difficulty
            const speed = baseSpeed * (1 + (this.level - 1) * CONFIG.game.levelSpeedIncrease) * 0.8;
            
            const isRiver = hasRiver && i < riverLanes;
            
            this.lanes.push({
                index: i,
                direction: direction,
                speed: speed,
                vehicles: [],
                logs: [],
                isRiver: isRiver,
                lastSpawn: 0,
                spawnInterval: CONFIG.vehicle.spawnInterval + Math.random() * 1000
            });
        }
    }

    update(timestamp) {
        this.lanes.forEach(lane => {
            // Spawn vehicles or logs
            if (timestamp - lane.lastSpawn > lane.spawnInterval) {
                if (lane.isRiver) {
                    // From level 4 onwards, 30% chance of spawning a crocodile instead of a log
                    const spawnCrocodile = this.level >= 4 && Math.random() < 0.3;
                    if (spawnCrocodile) {
                        lane.logs.push(new Crocodile(lane.index, lane.direction, lane.speed));
                    } else {
                        lane.logs.push(new Log(lane.index, lane.direction, lane.speed));
                    }
                } else {
                    lane.vehicles.push(new Vehicle(lane.index, lane.direction, lane.speed));
                }
                lane.lastSpawn = timestamp;
                lane.spawnInterval = CONFIG.vehicle.spawnInterval + Math.random() * 1000 - (this.level * 100);
            }

            // Update vehicles and logs
            lane.vehicles.forEach(vehicle => vehicle.update());
            lane.logs.forEach(log => log.update());

            // Remove off-screen items
            lane.vehicles = lane.vehicles.filter(vehicle => !vehicle.isOffScreen());
            lane.logs = lane.logs.filter(log => !log.isOffScreen());
        });
    }

    draw(ctx) {
        // Draw lanes
        for (let i = 0; i < CONFIG.lane.count; i++) {
            const y = CONFIG.lane.safeZoneTop + i * CONFIG.lane.height;
            const lane = this.lanes[i];
            
            if (lane.isRiver) {
                // Draw water
                ctx.fillStyle = '#1e40af';
                ctx.fillRect(0, y, CONFIG.canvas.width, CONFIG.lane.height);
                
                // Add water wave effect
                ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
                for (let x = 0; x < CONFIG.canvas.width; x += 40) {
                    ctx.beginPath();
                    ctx.arc(x + (Date.now() / 50) % 40, y + CONFIG.lane.height / 2, 10, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else {
                // Draw road
                ctx.fillStyle = i % 2 === 0 ? '#374151' : '#4b5563';
                ctx.fillRect(0, y, CONFIG.canvas.width, CONFIG.lane.height);

                // Lane markings
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 2;
                ctx.setLineDash([20, 10]);
                ctx.beginPath();
                ctx.moveTo(0, y + CONFIG.lane.height / 2);
                ctx.lineTo(CONFIG.canvas.width, y + CONFIG.lane.height / 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        // Draw vehicles and logs
        this.lanes.forEach(lane => {
            lane.vehicles.forEach(vehicle => vehicle.draw(ctx));
            lane.logs.forEach(log => log.draw(ctx));
        });
    }

    getAllVehicles() {
        return this.lanes.flatMap(lane => lane.vehicles);
    }

    getAllLogs() {
        return this.lanes.flatMap(lane => lane.logs);
    }

    isRiverLane(laneIndex) {
        return this.lanes[laneIndex] && this.lanes[laneIndex].isRiver;
    }

    reset(level) {
        this.level = level;
        this.lanes = [];
        this.initLanes();
    }
}

// Collision Detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Main Game Class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = new GameState();
        this.soundManager = new SoundManager();
        this.frog = new Frog(CONFIG.frog.startX, CONFIG.frog.startY);
        this.laneManager = new LaneManager(1);
        this.particles = [];
        this.lastTimestamp = 0;
        
        this.setupEventListeners();
        this.updateHUD();
        this.gameLoop();
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            // Handle restart key (works when game is over)
            if (e.code === 'KeyR' && !this.state.isPlaying) {
                this.restartGame();
                e.preventDefault();
                return;
            }

            if (!this.state.isPlaying) {
                if (e.code === 'Space') {
                    this.startGame();
                }
                return;
            }

            if (this.state.isPaused) return;

            switch(e.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.frog.move(0, -1);
                    this.soundManager.playJump();
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.frog.move(0, 1);
                    this.soundManager.playJump();
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.frog.move(-1, 0);
                    this.soundManager.playJump();
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.frog.move(1, 0);
                    this.soundManager.playJump();
                    e.preventDefault();
                    break;
            }
        });

        // Button controls
        document.getElementById('startButton').addEventListener('click', () => this.startGame());
        document.getElementById('restartButton').addEventListener('click', () => this.restartGame());
        document.getElementById('soundToggle').addEventListener('click', () => this.toggleSound());
    }

    startGame() {
        document.getElementById('startScreen').classList.add('hidden');
        this.state.isPlaying = true;
        this.state.isPaused = false;
        this.soundManager.startBackgroundMusic();
    }

    restartGame() {
        document.getElementById('gameOverScreen').classList.add('hidden');
        this.state.reset();
        this.frog.reset();
        this.laneManager.reset(1);
        this.particles = [];
        this.updateHUD();
        this.state.isPlaying = true;
        this.soundManager.startBackgroundMusic();
    }

    toggleSound() {
        const btn = document.getElementById('soundToggle');
        const enabled = this.soundManager.toggle();
        btn.textContent = enabled ? '🔊 Sound ON' : '🔇 Sound OFF';
        btn.classList.toggle('muted', !enabled);
    }

    handleCollision(isDrowning = false) {
        if (isDrowning) {
            this.soundManager.playSplash();
        } else {
            this.soundManager.playCollision();
        }
        this.createParticles(this.frog.x + this.frog.size / 2, this.frog.y + this.frog.size / 2);
        
        if (this.state.loseLife()) {
            this.frog.reset();
            this.updateHUD();
        } else {
            this.gameOver();
        }
    }

    handleLevelComplete() {
        this.soundManager.playWin();
        this.state.isPaused = true;
        
        const bonus = this.state.lives * CONFIG.game.bonusPerLife;
        this.state.addScore(CONFIG.game.pointsPerCrossing + bonus);
        
        document.getElementById('completedLevel').textContent = this.state.level;
        document.getElementById('bonusPoints').textContent = bonus;
        document.getElementById('nextLevel').textContent = this.state.level + 1;
        document.getElementById('levelCompleteScreen').classList.remove('hidden');
        
        setTimeout(() => {
            document.getElementById('levelCompleteScreen').classList.add('hidden');
            this.state.nextLevel();
            this.frog.reset();
            this.laneManager.reset(this.state.level);
            this.updateHUD();
            this.state.isPaused = false;
        }, 3000);
    }

    gameOver() {
        this.soundManager.playGameOver();
        this.soundManager.stopBackgroundMusic();
        this.state.isPlaying = false;
        document.getElementById('finalScore').textContent = this.state.score;
        document.getElementById('finalLevel').textContent = this.state.level;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }

    createParticles(x, y) {
        for (let i = 0; i < 20; i++) {
            this.particles.push(new Particle(x, y));
        }
    }

    updateHUD() {
        document.getElementById('score').textContent = this.state.score;
        document.getElementById('level').textContent = this.state.level;
        document.getElementById('lives').textContent = '❤️'.repeat(this.state.lives);
    }

    update(timestamp) {
        if (!this.state.isPlaying || this.state.isPaused) return;

        this.frog.update();
        this.laneManager.update(timestamp);

        // Update particles
        this.particles.forEach(particle => particle.update());
        this.particles = this.particles.filter(particle => !particle.isDead());

        // Check for level completion
        if (this.frog.hasReachedTop() && !this.frog.isMoving) {
            this.handleLevelComplete();
            return;
        }

        // Check if frog went off screen while riding a log
        if (this.frog.isOffScreen()) {
            this.handleCollision(true); // Drowning
            return;
        }

        // Determine which lane the frog is in
        const frogBounds = this.frog.getBounds();
        const frogCenterY = this.frog.y + this.frog.size / 2;
        const laneIndex = Math.floor((frogCenterY - CONFIG.lane.safeZoneTop) / CONFIG.lane.height);

        // Check if frog is in a river lane
        if (laneIndex >= 0 && laneIndex < CONFIG.lane.count && this.laneManager.isRiverLane(laneIndex)) {
            // In river - must be on a log
            const logs = this.laneManager.getAllLogs();
            let onLog = false;
            let onCrocodileHead = false;

            for (let log of logs) {
                if (checkCollision(frogBounds, log.getBounds())) {
                    onLog = true;
                    
                    // Check if it's a crocodile and if frog is on the head
                    if (log.isCrocodile && log.getHeadBounds()) {
                        if (checkCollision(frogBounds, log.getHeadBounds())) {
                            onCrocodileHead = true;
                            break;
                        }
                    }
                    
                    if (!this.frog.isMoving) {
                        this.frog.setRidingLog(log);
                    }
                    break;
                }
            }

            // If on crocodile head, frog gets eaten
            if (onCrocodileHead && !this.frog.isMoving) {
                this.handleCollision(false); // Eaten by crocodile (use collision sound)
                return;
            }

            // If not on a log and not moving, frog drowns
            if (!onLog && !this.frog.isMoving) {
                this.handleCollision(true); // Drowning
                return;
            }
        } else {
            // On road - check vehicle collisions
            this.frog.setRidingLog(null); // Not in river
            const vehicles = this.laneManager.getAllVehicles();
            
            for (let vehicle of vehicles) {
                if (checkCollision(frogBounds, vehicle.getBounds())) {
                    this.handleCollision(false); // Hit by vehicle
                    break;
                }
            }
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a202c';
        this.ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

        // Draw safe zones
        this.ctx.fillStyle = '#10b981';
        this.ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.lane.safeZoneTop);
        this.ctx.fillRect(0, CONFIG.canvas.height - CONFIG.lane.safeZoneBottom, 
                         CONFIG.canvas.width, CONFIG.lane.safeZoneBottom);

        // Draw finish line
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.fillRect(0, CONFIG.lane.safeZoneTop - 10, CONFIG.canvas.width, 10);
        for (let i = 0; i < CONFIG.canvas.width; i += 40) {
            this.ctx.fillStyle = i % 80 === 0 ? '#000' : '#fff';
            this.ctx.fillRect(i, CONFIG.lane.safeZoneTop - 10, 20, 10);
        }

        // Draw lanes and vehicles
        this.laneManager.draw(this.ctx);

        // Draw frog
        this.frog.draw(this.ctx);

        // Draw particles
        this.particles.forEach(particle => particle.draw(this.ctx));
    }

    gameLoop(timestamp = 0) {
        this.update(timestamp);
        this.draw();
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new Game();
});

// Made with Bob
