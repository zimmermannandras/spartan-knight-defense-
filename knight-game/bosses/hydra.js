class Hydra extends Boss {
    constructor(canvas, wave) {
        super(canvas, 'hydra', wave);
        
        // Triple strike properties
        this.strikeState = 'idle'; // idle, rearing, striking
        this.currentHead = 0; // 0: left, 1: center, 2: right
        this.headStrikes = [];
    }
    
    updateSprites() {
        this.spriteCache.right = SpriteGenerator.createHydraSprite(true);
        this.spriteCache.left = SpriteGenerator.createHydraSprite(false);
    }
    
    executeSpecialAttack(player) {
        // Start triple strike sequence
        this.strikeState = 'rearing';
        this.currentHead = 0;
        this.headStrikes = [];
        this.specialAttackTimer = 60; // 1 second rearing
    }
    
    updateSpecialAttack(player) {
        if (!this.isPerformingSpecialAttack) return;
        
        this.specialAttackTimer--;
        
        if (this.specialAttackPhase === 1) {
            // Telegraph phase - just wait
            if (this.specialAttackTimer <= 0) {
                this.specialAttackPhase = 2;
                this.executeSpecialAttack(player);
            }
        } else if (this.specialAttackPhase === 2) {
            // Execute phase - perform triple strike
            if (this.strikeState === 'rearing') {
                if (this.specialAttackTimer <= 0) {
                    this.strikeState = 'striking';
                    this.performHeadStrike(player);
                }
            } else if (this.strikeState === 'striking') {
                // Wait between strikes
                if (this.specialAttackTimer <= 0 && this.currentHead < 3) {
                    this.performHeadStrike(player);
                }
                
                // End after all three heads strike
                if (this.currentHead >= 3 && this.specialAttackTimer <= 0) {
                    // Transition to recovery phase
                    this.specialAttackPhase = 3;
                    this.specialAttackTimer = 30; // 0.5 second recovery
                }
            }
        } else if (this.specialAttackPhase === 3) {
            // Recovery phase
            if (this.specialAttackTimer <= 0) {
                this.strikeState = 'idle';
                this.isPerformingSpecialAttack = false;
                this.specialAttackPhase = 0;
                this.specialAttackCooldown = this.specialAttackCooldownMax;
            }
        }
    }
    
    performHeadStrike(player) {
        const headPositions = [
            { name: 'left', height: 'low', y: player.y + 40 },
            { name: 'center', height: 'middle', y: player.y + 20 },
            { name: 'right', height: 'high', y: player.y }
        ];
        
        const head = headPositions[this.currentHead];
        
        // Check if player is hit by this head (tripled range from 100 to 300, attacks both sides)
        const distance = Math.abs(player.x - this.x);
        if (distance < 300 && Math.abs(player.y - head.y) < 30) {
            player.takeDamage(15);
        }
        
        // Record strikes for visual - one for each direction
        this.headStrikes.push({
            head: head.name,
            y: head.y,
            timer: 20,
            direction: 1 // right
        });
        this.headStrikes.push({
            head: head.name,
            y: head.y,
            timer: 20,
            direction: -1 // left
        });
        
        this.currentHead++;
        this.specialAttackTimer = 18; // 0.3 seconds between strikes
    }
    
    draw(ctx) {
        super.draw(ctx);
        
        // Draw head positions if rearing
        if (this.strikeState === 'rearing') {
            this.drawRearingHeads(ctx);
        }
        
        // Draw strike effects
        this.headStrikes = this.headStrikes.filter(strike => {
            strike.timer--;
            if (strike.timer > 0) {
                this.drawStrikeEffect(ctx, strike);
                return true;
            }
            return false;
        });
    }
    
    drawRearingHeads(ctx) {
        const pulseAlpha = 0.3 + Math.sin(Date.now() / 100) * 0.2;
        
        // Draw three head positions
        const headY = [this.y + 40, this.y + 20, this.y];
        const colors = ['#00FF00', '#00CC00', '#009900'];
        
        // Position heads based on direction
        const headX = this.direction === 1 ? this.x + this.width + 40 : this.x - 40;
        
        headY.forEach((y, i) => {
            ctx.fillStyle = `rgba(0, 255, 0, ${pulseAlpha})`;
            ctx.beginPath();
            ctx.arc(headX, y, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Head outline
            ctx.strokeStyle = colors[i];
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }
    
    drawStrikeEffect(ctx, strike) {
        const alpha = strike.timer / 20;
        
        // Calculate strike position based on strike's direction (tripled range from 80 to 240)
        let strikeX, strikeEndX;
        if (strike.direction === 1) {
            // Striking right
            strikeX = this.x + this.width;
            strikeEndX = strikeX + 240;
        } else {
            // Striking left
            strikeX = this.x;
            strikeEndX = strikeX - 240;
        }
        
        // Strike trail
        ctx.strokeStyle = `rgba(0, 255, 0, ${alpha})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(strikeX, strike.y);
        ctx.lineTo(strikeEndX, strike.y);
        ctx.stroke();
        
        // Strike head at end of trail
        ctx.fillStyle = `rgba(0, 200, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(strikeEndX, strike.y, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Fangs
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        const fangOffset = strike.direction === 1 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(strikeEndX, strike.y);
        ctx.lineTo(strikeEndX - 5 * fangOffset, strike.y + 8);
        ctx.lineTo(strikeEndX, strike.y + 6);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(strikeEndX, strike.y);
        ctx.lineTo(strikeEndX + 5 * fangOffset, strike.y + 8);
        ctx.lineTo(strikeEndX, strike.y + 6);
        ctx.fill();
    }
}

// Made with Bob