class Arrow {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = 40;
        this.height = 8;
        this.speed = 8;
        
        // Random direction: left-to-right (1) or right-to-left (-1)
        this.direction = Math.random() < 0.5 ? 1 : -1;
        
        // Start position based on direction
        if (this.direction === 1) {
            this.x = -this.width;
        } else {
            this.x = canvas.width;
        }
        
        // Height slightly above ground (within jump range)
        // Ground is at canvas.height - 120, arrow flies 20-40 pixels above ground
        this.y = canvas.height - 120 - 20 - Math.random() * 20;
        
        this.active = true;
    }
    
    update() {
        this.x += this.speed * this.direction;
        
        // Deactivate when off screen
        if (this.x > this.canvas.width + this.width || this.x < -this.width) {
            this.active = false;
        }
    }
    
    draw(ctx) {
        // Arrow shaft
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Arrow tip (metallic point)
        ctx.fillStyle = '#C0C0C0';
        const tipX = this.direction === 1 ? this.x + this.width : this.x;
        ctx.beginPath();
        ctx.moveTo(tipX, this.y + this.height / 2);
        ctx.lineTo(tipX + (10 * this.direction), this.y);
        ctx.lineTo(tipX + (10 * this.direction), this.y + this.height);
        ctx.fill();
        
        // Fletching (feathers at back)
        ctx.fillStyle = '#FF6347';
        const fletchX = this.direction === 1 ? this.x : this.x + this.width;
        ctx.beginPath();
        ctx.moveTo(fletchX, this.y + this.height / 2);
        ctx.lineTo(fletchX - (8 * this.direction), this.y);
        ctx.lineTo(fletchX - (8 * this.direction), this.y + this.height);
        ctx.fill();
    }
    
    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width + 10, // Include arrow tip
            height: this.height
        };
    }
}

// Made with Bob