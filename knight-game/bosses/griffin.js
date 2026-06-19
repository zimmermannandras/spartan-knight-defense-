class Griffin extends Boss {
    constructor(canvas, wave) {
        super(canvas, 'griffin', wave);
        
        // Aerial dive specific properties
        this.diveState = 'grounded'; // grounded, ascending, hovering, diving, landing
        this.originalY = this.y;
        this.hoverHeight = this.y - 100;
        this.diveTargetX = 0;
        this.diveShadowX = 0;
        this.diveShadowY = 0;
    }
    
    updateSprites() {
        // Griffin sprite will be created in sprites.js
        this.spriteCache.right = SpriteGenerator.createGriffinSprite(true);
        this.spriteCache.left = SpriteGenerator.createGriffinSprite(false);
    }
    
    executeSpecialAttack(player) {
        // Start aerial dive sequence
        this.diveState = 'ascending';
        this.diveTargetX = player.x;
        this.diveShadowX = player.x;
        this.diveShadowY = this.originalY + this.height;
        this.specialAttackTimer = 180; // 3 seconds for full dive sequence
    }
    
    updateSpecialAttack(player) {
        if (!this.isPerformingSpecialAttack) return;
        
        console.log('Griffin special attack update - Phase:', this.specialAttackPhase, 'Timer:', this.specialAttackTimer, 'Dive state:', this.diveState);
        
        this.specialAttackTimer--;
        
        if (this.specialAttackPhase === 1) {
            // Telegraph phase - just wait
            if (this.specialAttackTimer <= 0) {
                this.specialAttackPhase = 2;
                this.executeSpecialAttack(player);
            }
        } else if (this.specialAttackPhase === 2) {
            // Execute phase - perform the dive
            if (this.diveState === 'ascending') {
                // Ascend into air
                this.y -= 2;
                if (this.y <= this.hoverHeight) {
                    this.diveState = 'hovering';
                    this.specialAttackTimer = 60; // Hover for 1 second
                }
            } else if (this.diveState === 'hovering') {
                // Hover in place
                if (this.specialAttackTimer <= 30) {
                    this.diveState = 'diving';
                }
            } else if (this.diveState === 'diving') {
                // Dive down at target
                const dx = this.diveTargetX - this.x;
                this.x += dx * 0.1; // Move toward target horizontally
                this.y += 8; // Fast descent
                
                // Check if hit ground
                if (this.y >= this.originalY) {
                    this.y = this.originalY;
                    this.diveState = 'landing';
                    this.createShockwave(player);
                    // Transition to recovery phase
                    this.specialAttackPhase = 3;
                    this.specialAttackTimer = 30; // 0.5 second recovery
                }
            }
        } else if (this.specialAttackPhase === 3) {
            // Recovery phase
            this.diveState = 'grounded';
            if (this.specialAttackTimer <= 0) {
                console.log('Griffin special attack complete - resetting cooldown to', this.specialAttackCooldownMax);
                this.isPerformingSpecialAttack = false;
                this.specialAttackPhase = 0;
                this.specialAttackCooldown = this.specialAttackCooldownMax;
            }
        }
    }
    
    createShockwave(player) {
        // Check if player is near impact zone
        const distance = Math.abs(player.x - this.x);
        const shockwaveRadius = 80;
        
        if (distance < shockwaveRadius && !player.isJumping) {
            // Player takes damage if on ground
            player.takeDamage(20);
        }
    }
    
    draw(ctx) {
        // Draw dive shadow if diving
        if (this.diveState === 'hovering' || this.diveState === 'diving') {
            this.drawDiveShadow(ctx);
        }
        
        // Draw boss normally
        super.draw(ctx);
        
        // Draw shockwave effect if just landed
        if (this.diveState === 'landing' && this.specialAttackTimer > 20) {
            this.drawShockwaveEffect(ctx);
        }
    }
    
    drawDiveShadow(ctx) {
        // Draw shadow on ground showing where griffin will land
        const shadowAlpha = this.diveState === 'diving' ? 0.5 : 0.3;
        ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
        ctx.beginPath();
        ctx.ellipse(this.diveShadowX + this.width / 2, this.diveShadowY, 40, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Target indicator
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.diveShadowX + this.width / 2, this.diveShadowY, 50, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawShockwaveEffect(ctx) {
        // Expanding circle effect
        const radius = (30 - this.specialAttackTimer) * 3;
        const alpha = this.specialAttackTimer / 30;
        
        ctx.strokeStyle = `rgba(255, 200, 0, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// Made with Bob