class Minotaur extends Boss {
    constructor(canvas, wave) {
        super(canvas, 'minotaur', wave);
        
        // Charge attack properties
        this.chargeState = 'idle'; // idle, telegraphing, charging, recovering
        this.chargeDirection = 1;
        this.chargeSpeed = 12;
        this.chargeStartX = 0;
        this.chargeHitPlayer = false; // Track if charge already hit player
    }
    
    updateSprites() {
        this.spriteCache.right = SpriteGenerator.createMinotaurSprite(true);
        this.spriteCache.left = SpriteGenerator.createMinotaurSprite(false);
    }
    
    executeSpecialAttack(player) {
        // Start charge sequence
        this.chargeState = 'telegraphing';
        this.chargeDirection = player.x > this.x ? 1 : -1;
        this.chargeStartX = this.x;
        this.chargeHitPlayer = false; // Reset hit flag for new charge
        this.specialAttackTimer = 60; // 1 second telegraph
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
            // Execute phase - perform the charge
            if (this.chargeState === 'telegraphing') {
                if (this.specialAttackTimer <= 0) {
                    this.chargeState = 'charging';
                    this.specialAttackTimer = 120; // 2 seconds to charge across screen
                }
            } else if (this.chargeState === 'charging') {
                // Charge across screen
                this.x += this.chargeSpeed * this.chargeDirection;
                
                // Check collision with player (only damage once per charge)
                if (!this.chargeHitPlayer && this.checkChargeCollision(player)) {
                    player.takeDamage(25);
                    this.chargeHitPlayer = true;
                }
                
                // Stop at screen edge or after time
                if (this.x < -this.width || this.x > this.canvas.width || this.specialAttackTimer <= 0) {
                    this.chargeState = 'recovering';
                    // Transition to recovery phase
                    this.specialAttackPhase = 3;
                    this.specialAttackTimer = 60; // 1 second to return to center
                }
            }
        } else if (this.specialAttackPhase === 3) {
            // Recovery phase - return to center
            const centerX = this.canvas.width / 2 - this.width / 2;
            const dx = centerX - this.x;
            if (Math.abs(dx) > 5) {
                this.x += dx * 0.1;
            } else {
                // Close enough to center, end recovery early
                this.specialAttackTimer = 0;
            }
            
            if (this.specialAttackTimer <= 0) {
                this.chargeState = 'idle';
                this.isPerformingSpecialAttack = false;
                this.specialAttackPhase = 0;
                this.specialAttackCooldown = this.specialAttackCooldownMax;
            }
        }
    }
    
    checkChargeCollision(player) {
        return Math.abs(this.x - player.x) < 60 && 
               Math.abs(this.y - player.y) < 80 &&
               !player.isJumping;
    }
    
    draw(ctx) {
        // Draw charge trail if charging
        if (this.chargeState === 'charging') {
            this.drawChargeTrail(ctx);
        }
        
        // Draw horns glow if telegraphing
        if (this.chargeState === 'telegraphing') {
            this.drawHornsGlow(ctx);
        }
        
        super.draw(ctx);
    }
    
    drawChargeTrail(ctx) {
        // Motion blur effect
        for (let i = 1; i <= 3; i++) {
            const alpha = 0.3 - (i * 0.1);
            const offsetX = -this.chargeDirection * i * 15;
            ctx.fillStyle = `rgba(139, 69, 19, ${alpha})`;
            ctx.fillRect(this.x + offsetX, this.y, this.width, this.height);
        }
    }
    
    drawHornsGlow(ctx) {
        const pulseAlpha = 0.4 + Math.sin(Date.now() / 100) * 0.3;
        ctx.fillStyle = `rgba(255, 0, 0, ${pulseAlpha})`;
        
        // Glow on horns (top of head)
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 10, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + this.width - 20, this.y + 10, 15, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Made with Bob