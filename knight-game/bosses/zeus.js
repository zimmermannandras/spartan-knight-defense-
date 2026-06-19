class Zeus extends Boss {
    constructor(canvas, wave) {
        super(canvas, 'zeus', wave);
        
        // Lightning storm properties
        this.stormState = 'idle'; // idle, raising, storming
        this.lightningBolts = [];
        this.boltCount = 0;
        this.maxBolts = 5;
    }
    
    updateSprites() {
        this.spriteCache.right = SpriteGenerator.createZeusSprite(true);
        this.spriteCache.left = SpriteGenerator.createZeusSprite(false);
    }
    
    executeSpecialAttack(player) {
        // Start lightning storm sequence
        this.stormState = 'raising';
        this.boltCount = 0;
        this.lightningBolts = [];
        this.specialAttackTimer = 60; // 1 second to raise staff
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
            // Execute phase - summon lightning bolts
            if (this.stormState === 'raising') {
                if (this.specialAttackTimer <= 0) {
                    this.stormState = 'storming';
                    this.summonLightningBolt(player);
                }
            } else if (this.stormState === 'storming') {
                // Summon bolts with delay
                if (this.specialAttackTimer <= 0 && this.boltCount < this.maxBolts) {
                    this.summonLightningBolt(player);
                    this.specialAttackTimer = 20; // 0.33 seconds between bolts
                }
                
                // Update existing bolts
                this.updateLightningBolts(player);
                
                // End when all bolts done
                if (this.boltCount >= this.maxBolts && this.lightningBolts.length === 0) {
                    // Transition to recovery phase
                    this.specialAttackPhase = 3;
                    this.specialAttackTimer = 30; // 0.5 second recovery
                }
            }
        } else if (this.specialAttackPhase === 3) {
            // Recovery phase
            if (this.specialAttackTimer <= 0) {
                this.stormState = 'idle';
                this.isPerformingSpecialAttack = false;
                this.specialAttackPhase = 0;
                this.specialAttackCooldown = this.specialAttackCooldownMax;
            }
        }
    }
    
    summonLightningBolt(player) {
        // Target player's current position with some randomness
        const targetX = player.x + (Math.random() - 0.5) * 60;
        const targetY = player.y;
        
        this.lightningBolts.push({
            x: targetX,
            y: 0,
            targetY: targetY,
            phase: 'warning', // warning, striking, fading
            timer: 30, // Warning phase duration
            segments: this.generateLightningSegments(targetX)
        });
        
        this.boltCount++;
    }
    
    generateLightningSegments(targetX) {
        // Create jagged lightning path
        const segments = [];
        let currentX = targetX;
        let currentY = 0;
        const targetY = this.canvas.height - 120;
        
        while (currentY < targetY) {
            const nextY = currentY + 20 + Math.random() * 20;
            const nextX = currentX + (Math.random() - 0.5) * 30;
            
            segments.push({ x1: currentX, y1: currentY, x2: nextX, y2: nextY });
            currentX = nextX;
            currentY = nextY;
        }
        
        return segments;
    }
    
    updateLightningBolts(player) {
        this.lightningBolts = this.lightningBolts.filter(bolt => {
            bolt.timer--;
            
            if (bolt.phase === 'warning') {
                if (bolt.timer <= 0) {
                    bolt.phase = 'striking';
                    bolt.timer = 10; // Strike duration
                    
                    // Check if player is hit
                    if (Math.abs(player.x - bolt.x) < 40) {
                        player.takeDamage(25);
                    }
                }
            } else if (bolt.phase === 'striking') {
                if (bolt.timer <= 0) {
                    bolt.phase = 'fading';
                    bolt.timer = 10; // Fade duration
                }
            } else if (bolt.phase === 'fading') {
                if (bolt.timer <= 0) {
                    return false; // Remove bolt
                }
            }
            
            return true;
        });
    }
    
    draw(ctx) {
        // Draw staff glow if raising
        if (this.stormState === 'raising') {
            this.drawStaffGlow(ctx);
        }
        
        // Draw sky darkening if storming
        if (this.stormState === 'storming') {
            this.drawDarkenedSky(ctx);
        }
        
        super.draw(ctx);
        
        // Draw lightning bolts
        this.lightningBolts.forEach(bolt => this.drawLightningBolt(ctx, bolt));
    }
    
    drawStaffGlow(ctx) {
        const pulseAlpha = 0.5 + Math.sin(Date.now() / 100) * 0.3;
        ctx.fillStyle = `rgba(255, 255, 0, ${pulseAlpha})`;
        
        // Glow around staff (top of Zeus)
        const staffX = this.direction === 1 ? this.x + this.width : this.x;
        const staffY = this.y - 10;
        
        ctx.beginPath();
        ctx.arc(staffX, staffY, 30, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawDarkenedSky(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height - 120);
    }
    
    drawLightningBolt(ctx, bolt) {
        if (bolt.phase === 'warning') {
            // Draw warning indicator
            const alpha = 0.3 + (bolt.timer % 10) / 10 * 0.4;
            ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
            ctx.fillRect(bolt.x - 20, 0, 40, this.canvas.height - 120);
            
            // Target marker
            ctx.strokeStyle = `rgba(255, 0, 0, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(bolt.x, bolt.targetY + 30, 25, 0, Math.PI * 2);
            ctx.stroke();
        } else if (bolt.phase === 'striking' || bolt.phase === 'fading') {
            // Draw jagged lightning
            const alpha = bolt.phase === 'striking' ? 1 : bolt.timer / 10;
            
            // Main bolt
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 4;
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(255, 255, 0, ${alpha})`;
            
            ctx.beginPath();
            bolt.segments.forEach((seg, i) => {
                if (i === 0) {
                    ctx.moveTo(seg.x1, seg.y1);
                }
                ctx.lineTo(seg.x2, seg.y2);
            });
            ctx.stroke();
            
            // Inner glow
            ctx.strokeStyle = `rgba(255, 255, 0, ${alpha * 0.8})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.shadowBlur = 0;
            
            // Ground impact flash
            if (bolt.phase === 'striking') {
                const lastSeg = bolt.segments[bolt.segments.length - 1];
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
                ctx.beginPath();
                ctx.arc(lastSeg.x2, lastSeg.y2, 20, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// Made with Bob