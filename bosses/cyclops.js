class Cyclops extends Boss {
    constructor(canvas, wave) {
        super(canvas, 'cyclops', wave);
        
        // Ground slam properties
        this.slamState = 'idle'; // idle, raising, slamming, shockwave
        this.shockwaves = [];
        this.shockwaveHitPlayer = false; // Track if shockwave already hit player
    }
    
    updateSprites() {
        this.spriteCache.right = SpriteGenerator.createCyclopsSprite(true);
        this.spriteCache.left = SpriteGenerator.createCyclopsSprite(false);
    }
    
    executeSpecialAttack(player) {
        // Start ground slam sequence
        this.slamState = 'raising';
        this.shockwaveHitPlayer = false; // Reset hit flag for new slam
        this.specialAttackTimer = 90; // 1.5 seconds to raise club
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
            // Execute phase - perform the slam
            if (this.slamState === 'raising') {
                if (this.specialAttackTimer <= 0) {
                    this.slamState = 'slamming';
                    this.createShockwaves();
                    // Transition to recovery phase
                    this.specialAttackPhase = 3;
                    this.specialAttackTimer = 120; // 2 seconds for shockwaves to travel
                }
            }
        } else if (this.specialAttackPhase === 3) {
            // Recovery phase - update shockwaves
            this.updateShockwaves(player);
            
            if (this.specialAttackTimer <= 0 && this.shockwaves.length === 0) {
                this.slamState = 'idle';
                this.isPerformingSpecialAttack = false;
                this.specialAttackPhase = 0;
                this.specialAttackCooldown = this.specialAttackCooldownMax;
            }
        }
    }
    
    createShockwaves() {
        // Create shockwaves traveling in both directions
        const centerX = this.x + this.width / 2;
        const groundY = this.y + this.height;
        
        this.shockwaves = [
            { x: centerX, y: groundY, direction: 1, distance: 0 },  // Right
            { x: centerX, y: groundY, direction: -1, distance: 0 }  // Left
        ];
    }
    
    updateShockwaves(player) {
        this.shockwaves = this.shockwaves.filter(wave => {
            wave.distance += 4; // Shockwave speed
            wave.x += wave.direction * 4;
            
            // Check collision with player (only damage once per slam)
            if (!this.shockwaveHitPlayer && !player.isJumping && Math.abs(wave.x - player.x) < 40) {
                player.takeDamage(30);
                this.shockwaveHitPlayer = true;
                return false; // Remove shockwave after hit
            }
            
            // Remove if off screen
            return wave.x > -50 && wave.x < this.canvas.width + 50 && wave.distance < 400;
        });
    }
    
    draw(ctx) {
        // Draw club glow if raising
        if (this.slamState === 'raising') {
            this.drawClubGlow(ctx);
        }
        
        super.draw(ctx);
        
        // Draw shockwaves
        this.shockwaves.forEach(wave => this.drawShockwave(ctx, wave));
        
        // Draw ground cracks if just slammed
        if (this.slamState === 'slamming' && this.specialAttackPhase === 2) {
            this.drawGroundCracks(ctx);
        }
    }
    
    drawClubGlow(ctx) {
        const pulseAlpha = 0.4 + Math.sin(Date.now() / 100) * 0.3;
        ctx.fillStyle = `rgba(255, 200, 0, ${pulseAlpha})`;
        
        // Glow around club area (top right for right-facing)
        const clubX = this.direction === 1 ? this.x + this.width : this.x;
        const clubY = this.y - 20;
        
        ctx.beginPath();
        ctx.arc(clubX, clubY, 25, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawShockwave(ctx, wave) {
        const alpha = 1 - (wave.distance / 400);
        const outerRadius = wave.distance * 0.5;
        const innerRadius = Math.max(0, outerRadius - 5); // Prevent negative radius
        
        ctx.strokeStyle = `rgba(139, 69, 19, ${alpha})`;
        ctx.lineWidth = 4;
        
        // Draw ripple effect
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, outerRadius, 0, Math.PI);
        ctx.stroke();
        
        // Inner ripple (only if radius is positive)
        if (innerRadius > 0) {
            ctx.strokeStyle = `rgba(210, 180, 140, ${alpha * 0.7})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, innerRadius, 0, Math.PI);
            ctx.stroke();
        }
    }
    
    drawGroundCracks(ctx) {
        const centerX = this.x + this.width / 2;
        const groundY = this.y + this.height;
        
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        
        // Draw radiating cracks
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI / 6) * i - Math.PI / 3;
            const length = 40 + Math.random() * 20;
            
            ctx.beginPath();
            ctx.moveTo(centerX, groundY);
            ctx.lineTo(
                centerX + Math.cos(angle) * length,
                groundY + Math.sin(angle) * length
            );
            ctx.stroke();
        }
    }
}

// Made with Bob