class Boss extends Enemy {
    constructor(canvas, bossType, wave) {
        // Call super with center spawn
        super(canvas, 'left', 1);
        
        // IMMEDIATELY override with boss-specific properties
        this.bossType = bossType;
        this.wave = wave;
        this.isBoss = true;
        
        // Boss size (2x player size)
        this.width = 80;
        this.height = 120;
        
        // Center spawn position
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - 120 - this.height;
        
        // Set boss-specific stats - THIS MUST HAPPEN BEFORE ANYTHING ELSE
        this.setBossStats(bossType);
        
        // CRITICAL: Re-set health after setBossStats to ensure it sticks
        const tempHealth = this.maxHealth;
        this.health = tempHealth;
        
        // Special attack system
        this.specialAttackCooldown = 0;
        this.specialAttackCooldownMax = 120; // 2 seconds at 60 FPS
        this.isPerformingSpecialAttack = false;
        this.specialAttackPhase = 0; // 0: idle, 1: telegraph, 2: execute, 3: recovery
        this.specialAttackTimer = 0;
        
        // Update sprites for boss size
        this.updateSprites();
        
        console.log('Boss created:', this.bossName, 'Health:', this.health, '/', this.maxHealth);
    }
    
    setBossStats(bossType) {
        console.log('Setting boss stats for:', bossType);
        const stats = {
            griffin: {
                health: 300,
                speed: 3.5,
                attackDamage: 15,
                points: 500,
                name: 'Griffin',
                specialCooldown: 30 // Half of 60 (very fast attacks)
            },
            minotaur: {
                health: 250,
                speed: 3.0,
                attackDamage: 20,
                points: 1000,
                name: 'Minotaur',
                specialCooldown: 60 // Half the default cooldown
            },
            cyclops: {
                health: 400,
                speed: 1.5,
                attackDamage: 25,
                points: 2000,
                name: 'Cyclops',
                specialCooldown: 60 // Half the default cooldown
            },
            hydra: {
                health: 600,
                speed: 1.8,
                attackDamage: 15,
                points: 3500,
                name: 'Hydra',
                specialCooldown: 60 // Half the default cooldown
            },
            zeus: {
                health: 800,
                speed: 2.5,
                attackDamage: 20,
                points: 5000,
                name: 'Zeus',
                specialCooldown: 240 // Double the default cooldown (slower attacks)
            }
        };
        
        const bossStats = stats[bossType];
        if (!bossStats) {
            console.error('Boss type not found:', bossType);
            return;
        }
        this.maxHealth = bossStats.health;
        this.health = this.maxHealth;
        this.speed = bossStats.speed;
        this.attackDamage = bossStats.attackDamage;
        this.pointValue = bossStats.points;
        this.bossName = bossStats.name;
        
        // Set boss-specific special attack cooldown if defined
        if (bossStats.specialCooldown) {
            this.specialAttackCooldownMax = bossStats.specialCooldown;
        }
        console.log('Boss stats set:', {
            name: this.bossName,
            health: this.health,
            maxHealth: this.maxHealth,
            speed: this.speed,
            attackDamage: this.attackDamage
        });
    }
    
    takeDamage(amount) {
        console.log(`${this.bossName} taking damage:`, amount, 'Current health:', this.health);
        const result = super.takeDamage(amount);
        console.log(`${this.bossName} health after damage:`, this.health, 'Dead:', result);
        return result;
    }
    
    update(player) {
        // Update special attack cooldown
        if (this.specialAttackCooldown > 0) {
            this.specialAttackCooldown--;
            if (this.specialAttackCooldown % 60 === 0) {
                console.log(`${this.bossName} cooldown:`, this.specialAttackCooldown);
            }
        }
        
        // Handle special attack if in progress
        if (this.isPerformingSpecialAttack) {
            this.updateSpecialAttack(player);
            // Still do normal movement during special attack
            const distanceToPlayer = Math.abs(this.x - player.x);
            if (distanceToPlayer > this.attackRange && this.specialAttackPhase !== 2) {
                if (this.x < player.x) {
                    this.x += this.speed * 0.5; // Slower during special
                    this.direction = 1;
                } else {
                    this.x -= this.speed * 0.5;
                    this.direction = -1;
                }
            }
            return false; // Don't do normal attack during special
        }
        
        // Check if should start special attack
        if (this.specialAttackCooldown === 0 && !this.isPerformingSpecialAttack) {
            console.log(`${this.bossName} starting special attack! Cooldown was 0`);
            this.startSpecialAttack();
            return false; // Don't do normal attack when starting special
        } else if (this.specialAttackCooldown === 0) {
            console.log(`${this.bossName} cooldown is 0 but isPerformingSpecialAttack is`, this.isPerformingSpecialAttack);
        }
        
        // Boss movement (follow player but don't attack normally)
        const distanceToPlayer = Math.abs(this.x - player.x);
        if (distanceToPlayer > this.attackRange) {
            if (this.x < player.x) {
                this.x += this.speed;
                this.direction = 1;
            } else {
                this.x -= this.speed;
                this.direction = -1;
            }
        }
        
        // Bosses don't do normal attacks, only special attacks
        return false;
    }
    
    startSpecialAttack() {
        this.isPerformingSpecialAttack = true;
        this.specialAttackPhase = 1; // Telegraph phase
        this.specialAttackTimer = 60; // 1 second telegraph
    }
    
    updateSpecialAttack(player) {
        this.specialAttackTimer--;
        
        if (this.specialAttackTimer <= 0) {
            // Move to next phase
            this.specialAttackPhase++;
            
            if (this.specialAttackPhase === 2) {
                // Execute phase
                this.executeSpecialAttack(player);
                this.specialAttackTimer = 30; // 0.5 seconds
            } else if (this.specialAttackPhase === 3) {
                // Recovery phase
                this.specialAttackTimer = 30; // 0.5 seconds
            } else {
                // End special attack
                this.isPerformingSpecialAttack = false;
                this.specialAttackPhase = 0;
                this.specialAttackCooldown = this.specialAttackCooldownMax;
            }
        }
    }
    
    executeSpecialAttack(player) {
        // Override in subclasses
        console.log(`${this.bossName} performs special attack!`);
    }
    
    draw(ctx) {
        // Draw boss sprite
        const sprite = this.direction === 1 ? this.spriteCache.right : this.spriteCache.left;
        ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
        
        // Bosses don't draw weapons (they use special attacks)
        
        // Draw boss health bar (larger)
        this.drawBossHealthBar(ctx);
        
        // Draw boss name
        this.drawBossName(ctx);
        
        // Draw special attack telegraph if in phase 1
        if (this.specialAttackPhase === 1) {
            this.drawTelegraph(ctx);
        }
    }
    
    drawBossHealthBar(ctx) {
        const barWidth = this.width * 1.5;
        const barHeight = 8;
        const barX = this.x - (barWidth - this.width) / 2;
        const barY = this.y - 25;
        
        // Background (dark red)
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health (gradient based on health)
        const healthPercent = this.health / this.maxHealth;
        if (healthPercent > 0.5) {
            ctx.fillStyle = '#FF0000';
        } else if (healthPercent > 0.25) {
            ctx.fillStyle = '#FF4500';
        } else {
            ctx.fillStyle = '#FF6347';
        }
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Border (gold for boss)
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Health text
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.ceil(this.health)}/${this.maxHealth}`, barX + barWidth / 2, barY + barHeight + 12);
    }
    
    drawBossName(ctx) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        
        const nameX = this.x + this.width / 2;
        const nameY = this.y - 35;
        
        // Outline
        ctx.strokeText(this.bossName, nameX, nameY);
        // Fill
        ctx.fillText(this.bossName, nameX, nameY);
    }
    
    drawTelegraph(ctx) {
        // Pulsing warning indicator
        const pulseAlpha = 0.3 + Math.sin(Date.now() / 100) * 0.2;
        ctx.fillStyle = `rgba(255, 0, 0, ${pulseAlpha})`;
        ctx.fillRect(this.x - 10, this.y - 10, this.width + 20, this.height + 20);
        
        // Warning text
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 2;
        ctx.strokeText('!', this.x + this.width / 2, this.y - 50);
        ctx.fillText('!', this.x + this.width / 2, this.y - 50);
    }
}

// Made with Bob