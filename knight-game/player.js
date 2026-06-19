class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = 40;
        this.height = 60;
        this.x = canvas.width / 2 - this.width / 2;
        this.groundY = canvas.height - 120 - this.height; // Ground level
        this.y = this.groundY;
        this.speed = 5;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        
        // Shield system
        this.maxShieldDurability = 3;
        this.shieldDurability = this.maxShieldDurability;
        this.isBlocking = false;
        
        // Attack system
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.attackCooldownMax = 30; // 0.5 seconds at 60 FPS
        this.attackRange = 50;
        this.attackDamage = 25;
        this.attackHitThisFrame = false; // Track if attack already hit this swing
        
        // Jump system
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.gravity = 0.8;
        this.jumpStrength = -15;
        
        // Movement and facing direction
        this.movingLeft = false;
        this.movingRight = false;
        this.facingRight = true; // Default facing right
        
        // Sprites
        this.spriteCache = {};
        this.updateSprites();
    }
    
    updateSprites() {
        this.spriteCache.right = SpriteGenerator.createKnightSprite(true);
        this.spriteCache.left = SpriteGenerator.createKnightSprite(false);
    }
    
    update() {
        // Movement and update facing direction
        if (this.movingLeft && this.x > 0) {
            this.x -= this.speed;
            this.facingRight = false;
        }
        if (this.movingRight && this.x < this.canvas.width - this.width) {
            this.x += this.speed;
            this.facingRight = true;
        }
        
        // Jump physics
        if (this.isJumping) {
            this.jumpVelocity += this.gravity;
            this.y += this.jumpVelocity;
            
            // Land on ground
            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.isJumping = false;
                this.jumpVelocity = 0;
            }
        }
        
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
        
        // Reset attack animation
        if (this.isAttacking && this.attackCooldown === 0) {
            this.isAttacking = false;
        }
    }
    
    attack() {
        if (this.attackCooldown === 0) {
            this.isAttacking = true;
            this.attackCooldown = this.attackCooldownMax;
            this.attackHitThisFrame = false; // Reset hit flag for new attack
            return true;
        }
        return false;
    }
    
    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpVelocity = this.jumpStrength;
            return true;
        }
        return false;
    }
    
    block(isBlocking) {
        this.isBlocking = isBlocking && this.shieldDurability > 0;
    }
    
    takeDamage(amount) {
        if (this.isBlocking && this.shieldDurability > 0) {
            // Shield blocks the attack
            this.shieldDurability--;
            return false; // Damage blocked
        } else {
            // Take damage
            this.health -= amount;
            if (this.health < 0) this.health = 0;
            return true; // Damage taken
        }
    }
    
    regenerateShield() {
        this.shieldDurability = this.maxShieldDurability;
    }
    
    getAttackHitbox() {
        if (!this.isAttacking) return null;
        
        if (this.facingRight) {
            return {
                x: this.x + this.width,
                y: this.y,
                width: this.attackRange,
                height: this.height
            };
        } else {
            return {
                x: this.x - this.attackRange,
                y: this.y,
                width: this.attackRange,
                height: this.height
            };
        }
    }
    
    draw(ctx) {
        // Draw knight sprite
        const sprite = this.facingRight ? this.spriteCache.right : this.spriteCache.left;
        ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
        
        // Draw shield
        this.drawShield(ctx);
        
        // Draw pike
        this.drawPike(ctx);
    }
    
    drawShield(ctx) {
        const shieldSprite = SpriteGenerator.createShieldSprite(this.shieldDurability, this.facingRight);
        const shieldX = this.facingRight ? this.x - 20 : this.x + this.width - 10;
        const shieldY = this.y + this.height / 2 - 15;
        
        ctx.drawImage(shieldSprite, shieldX, shieldY);
        
        // Shield glow when blocking
        if (this.isBlocking && this.shieldDurability > 0) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(shieldX + 15, shieldY + 15, 17, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    drawPike(ctx) {
        const pikeSprite = SpriteGenerator.createWeaponSprite('pike', this.isAttacking, this.facingRight);
        const pikeY = this.y + this.height / 2 - 10;
        
        if (this.facingRight) {
            const pikeX = this.x + this.width - 5;
            ctx.drawImage(pikeSprite, pikeX, pikeY);
        } else {
            // Pike sprite is already created facing left, just draw it
            const pikeX = this.x - pikeSprite.width + 5;
            ctx.drawImage(pikeSprite, pikeX, pikeY);
        }
    }
}

// Made with Bob
