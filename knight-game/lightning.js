class Lightning extends Arrow {
    constructor(canvas) {
        super(canvas);
        
        // Override arrow properties for lightning
        this.width = 30;
        this.height = 12;
        this.speed = 10; // Faster than regular arrows
        this.damage = 20; // More damage than arrows
        
        // Lightning-specific properties
        this.segments = this.generateLightningSegments();
        this.flicker = 0;
    }
    
    generateLightningSegments() {
        // Create jagged lightning bolt shape
        const segments = [];
        const numSegments = 3 + Math.floor(Math.random() * 3);
        let currentX = 0;
        let currentY = this.height / 2;
        
        for (let i = 0; i < numSegments; i++) {
            const nextX = currentX + this.width / numSegments;
            const nextY = currentY + (Math.random() - 0.5) * this.height;
            
            segments.push({
                x1: currentX,
                y1: currentY,
                x2: nextX,
                y2: nextY
            });
            
            currentX = nextX;
            currentY = nextY;
        }
        
        return segments;
    }
    
    update() {
        super.update();
        
        // Regenerate segments occasionally for flicker effect
        this.flicker++;
        if (this.flicker % 3 === 0) {
            this.segments = this.generateLightningSegments();
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Rotate if moving left
        if (this.direction === -1) {
            ctx.scale(-1, 1);
            ctx.translate(-this.width, 0);
        }
        
        // Draw lightning bolt
        ctx.strokeStyle = '#FFFF00'; // Bright yellow
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FFFF00';
        
        // Main bolt
        ctx.beginPath();
        this.segments.forEach((seg, i) => {
            if (i === 0) {
                ctx.moveTo(seg.x1, seg.y1);
            }
            ctx.lineTo(seg.x2, seg.y2);
        });
        ctx.stroke();
        
        // Inner white core
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.segments.forEach((seg, i) => {
            if (i === 0) {
                ctx.moveTo(seg.x1, seg.y1);
            }
            ctx.lineTo(seg.x2, seg.y2);
        });
        ctx.stroke();
        
        // Glow effect
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.width / 2, this.height / 2, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.restore();
    }
    
    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Made with Bob