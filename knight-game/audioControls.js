class AudioControls {
    constructor(canvas, soundManager, musicManager) {
        this.canvas = canvas;
        this.soundManager = soundManager;
        this.musicManager = musicManager;
        
        // Slider dimensions and positions
        this.sliderWidth = 120;
        this.sliderHeight = 40;
        this.sliderSpacing = 10;
        this.sliderPadding = 10;
        
        // Bar dimensions
        this.barWidth = 80;
        this.barHeight = 8;
        this.segmentWidth = 16; // 5 segments: 0, 1, 2, 3, 4
        this.segmentSpacing = 2;
        
        // SFX slider (right-most)
        this.sfxSlider = {
            x: canvas.width - this.sliderPadding - this.sliderWidth,
            y: this.sliderPadding,
            width: this.sliderWidth,
            height: this.sliderHeight,
            label: 'SFX',
            icon: '🔊'
        };
        
        // Music slider (left of SFX slider)
        this.musicSlider = {
            x: this.sfxSlider.x - this.sliderWidth - this.sliderSpacing,
            y: this.sliderPadding,
            width: this.sliderWidth,
            height: this.sliderHeight,
            label: 'Music',
            icon: '🎵'
        };
    }
    
    draw(ctx) {
        // Draw Music slider
        this.drawSlider(ctx, this.musicSlider, this.musicManager.volumeLevel);
        
        // Draw SFX slider
        this.drawSlider(ctx, this.sfxSlider, this.soundManager.volumeLevel);
    }
    
    drawSlider(ctx, slider, volumeLevel) {
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(slider.x, slider.y, slider.width, slider.height);
        
        // Border
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(slider.x, slider.y, slider.width, slider.height);
        
        // Label
        ctx.fillStyle = '#FFF';
        ctx.font = '11px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`${slider.icon} ${slider.label}`, slider.x + 5, slider.y + 3);
        
        // Volume bar
        const barX = slider.x + (slider.width - this.barWidth) / 2;
        const barY = slider.y + slider.height - this.barHeight - 5;
        
        // Draw 5 segments (levels 0-4)
        for (let i = 0; i < 5; i++) {
            const segX = barX + i * (this.segmentWidth + this.segmentSpacing);
            
            if (i < volumeLevel) {
                // Filled segment - gradient from green to yellow to red
                if (i < 2) {
                    ctx.fillStyle = '#4CAF50'; // Green for low levels
                } else if (i < 4) {
                    ctx.fillStyle = '#FFC107'; // Yellow for mid levels
                } else {
                    ctx.fillStyle = '#FF5722'; // Red for max level
                }
            } else {
                // Empty segment
                ctx.fillStyle = '#333';
            }
            
            ctx.fillRect(segX, barY, this.segmentWidth, this.barHeight);
            
            // Segment border
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 1;
            ctx.strokeRect(segX, barY, this.segmentWidth, this.barHeight);
        }
    }
    
    handleClick(x, y) {
        // Check Music slider
        if (this.isPointInSlider(x, y, this.musicSlider)) {
            const level = this.getClickedLevel(x, this.musicSlider);
            this.musicManager.setVolumeLevel(level);
            return true;
        }
        
        // Check SFX slider
        if (this.isPointInSlider(x, y, this.sfxSlider)) {
            const level = this.getClickedLevel(x, this.sfxSlider);
            this.soundManager.setVolumeLevel(level);
            return true;
        }
        
        return false;
    }
    
    getClickedLevel(x, slider) {
        // Calculate which segment was clicked
        const barX = slider.x + (slider.width - this.barWidth) / 2;
        const relativeX = x - barX;
        
        // Determine which segment (0-4)
        const segmentIndex = Math.floor(relativeX / (this.segmentWidth + this.segmentSpacing));
        
        // Clamp to valid range and add 1 (clicking segment 0 sets level 1, etc.)
        // Clicking before first segment sets to 0 (off)
        if (relativeX < 0) return 0;
        return Math.min(4, Math.max(0, segmentIndex + 1));
    }
    
    isPointInSlider(x, y, slider) {
        return x >= slider.x &&
               x <= slider.x + slider.width &&
               y >= slider.y &&
               y <= slider.y + slider.height;
    }
}

// Made with Bob