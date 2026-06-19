class Enemy {
    constructor(canvas, spawnSide, difficultyMultiplier = 1) {
        this.canvas = canvas;
        this.width = 35;
        this.height = 55;
        this.baseSpeed = 2;
        this.speed = this.baseSpeed * difficultyMultiplier;
        this.maxHealth = 25;
        this.health = this.maxHealth;
        this.attackDamage = 10;
        this.attackCooldown = 0;
        this.baseAttackCooldownMax = 90; // 1.5 seconds at 60 FPS
        this.attackCooldownMax = Math.floor(this.baseAttackCooldownMax / difficultyMultiplier);
        this.attackRange = 60;
        this.isAttacking = false;
        
        // Spawn from left or right
        if (spawnSide === 'left') {
            this.x = -this.width;
            this.direction = 1; // Moving right
        } else {
            this.x = canvas.width;
            this.direction = -1; // Moving left
        }
        
        this.y = canvas.height - 120 - this.height; // Above ground, same as player
        
        // Sprites
        this.spriteCache = {};
        this.updateSprites();
    }
    
    updateSprites() {
        this.spriteCache.right = SpriteGenerator.createEnemySprite(true);
        this.spriteCache.left = SpriteGenerator.createEnemySprite(false);
    }
    
    update(player) {
        // Move toward player
        const distanceToPlayer = Math.abs(this.x - player.x);
        
        if (distanceToPlayer > this.attackRange) {
            // Move toward player
            if (this.x < player.x) {
                this.x += this.speed;
                this.direction = 1;
            } else {
                this.x -= this.speed;
                this.direction = -1;
            }
            this.isAttacking = false;
        } else {
            // In attack range
            if (this.attackCooldown === 0) {
                this.isAttacking = true;
                this.attackCooldown = this.attackCooldownMax;
                return true; // Signal that enemy is attacking
            }
        }
        
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
            if (this.attackCooldown === 0) {
                this.isAttacking = false;
            }
        }
        
        return false;
    }
    
    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        return this.health <= 0; // Return true if enemy is dead
    }
    
    isInAttackRange(player) {
        const distance = Math.abs(this.x - player.x);
        return distance <= this.attackRange;
    }
    
    draw(ctx) {
        // Draw enemy sprite
        const sprite = this.direction === 1 ? this.spriteCache.right : this.spriteCache.left;
        ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
        
        // Draw weapon (sword)
        this.drawWeapon(ctx);
        
        // Draw health bar above enemy
        this.drawHealthBar(ctx);
    }
    
    drawWeapon(ctx) {
        const weaponSprite = SpriteGenerator.createWeaponSprite('sword', this.isAttacking, this.direction === 1);
        const weaponY = this.y + this.height / 2 - 10;
        
        if (this.direction === 1) {
            // Facing right
            const weaponX = this.x + this.width - 5;
            ctx.drawImage(weaponSprite, weaponX, weaponY);
        } else {
            // Facing left
            const weaponX = this.x - weaponSprite.width + 5;
            ctx.save();
            ctx.translate(weaponX + weaponSprite.width, weaponY);
            ctx.scale(-1, 1);
            ctx.drawImage(weaponSprite, 0, 0);
            ctx.restore();
        }
    }
    
    drawHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 5;
        const barX = this.x;
        const barY = this.y - 10;
        
        // Background (red)
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health (red to green gradient based on health)
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#FF0000' : '#FF4500';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}

// Made with Bob
