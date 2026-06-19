// Sprite generator for creating simple pixel art characters
class SpriteGenerator {
    static createKnightSprite(facingRight = true) {
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 60;
        const ctx = canvas.getContext('2d');
        
        // Flip context if facing left
        if (!facingRight) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        
        // Helmet (gold)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(12, 5, 16, 12);
        
        // Visor (dark)
        ctx.fillStyle = '#333';
        ctx.fillRect(14, 10, 12, 4);
        
        // Body armor (blue)
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(10, 20, 20, 25);
        
        // Belt
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(10, 35, 20, 3);
        
        // Legs (blue)
        ctx.fillStyle = '#2E5090';
        ctx.fillRect(12, 45, 7, 15);
        ctx.fillRect(21, 45, 7, 15);
        
        // Arms
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(6, 22, 4, 15);
        ctx.fillRect(30, 22, 4, 15);
        
        // Shoulder plates
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(6, 20, 5, 4);
        ctx.fillRect(29, 20, 5, 4);
        
        return canvas;
    }
    
    static createEnemySprite(facingRight = true) {
        const canvas = document.createElement('canvas');
        canvas.width = 35;
        canvas.height = 55;
        const ctx = canvas.getContext('2d');
        
        // Flip context if facing left
        if (!facingRight) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        
        // Helmet (dark red)
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(10, 5, 15, 10);
        
        // Face opening
        ctx.fillStyle = '#333';
        ctx.fillRect(12, 9, 11, 4);
        
        // Body armor (red)
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(8, 18, 19, 22);
        
        // Belt
        ctx.fillStyle = '#000';
        ctx.fillRect(8, 32, 19, 2);
        
        // Legs (dark red)
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(10, 40, 6, 15);
        ctx.fillRect(19, 40, 6, 15);
        
        // Arms
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(4, 20, 4, 13);
        ctx.fillRect(27, 20, 4, 13);
        
        // Shoulder spikes
        ctx.fillStyle = '#696969';
        ctx.fillRect(4, 18, 4, 3);
        ctx.fillRect(27, 18, 4, 3);
        
        return canvas;
    }
    
    static createShieldSprite(durability, facingRight = true) {
        const canvas = document.createElement('canvas');
        canvas.width = 30;
        canvas.height = 30;
        const ctx = canvas.getContext('2d');
        
        const centerX = 15;
        const centerY = 15;
        const radius = 14;
        
        // Shield color based on durability
        let shieldColor;
        if (durability === 3) {
            shieldColor = '#C0C0C0'; // Bright silver
        } else if (durability === 2) {
            shieldColor = '#A9A9A9'; // Medium gray
        } else if (durability === 1) {
            shieldColor = '#696969'; // Dark gray
        } else {
            shieldColor = 'rgba(192, 192, 192, 0.3)'; // Broken
        }
        
        // Shield body
        ctx.fillStyle = shieldColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Shield border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Cross pattern
        if (durability > 0) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - 8);
            ctx.lineTo(centerX, centerY + 8);
            ctx.moveTo(centerX - 8, centerY);
            ctx.lineTo(centerX + 8, centerY);
            ctx.stroke();
        }
        
        // Damage cracks
        if (durability === 2) {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centerX - 5, centerY - 8);
            ctx.lineTo(centerX + 3, centerY - 2);
            ctx.stroke();
        } else if (durability === 1) {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centerX - 5, centerY - 8);
            ctx.lineTo(centerX + 3, centerY - 2);
            ctx.moveTo(centerX + 4, centerY + 2);
            ctx.lineTo(centerX - 4, centerY + 8);
            ctx.stroke();
        }
        
        return canvas;
    }
    
    static createWeaponSprite(type = 'pike', isAttacking = false, facingRight = true) {
        const length = isAttacking ? 50 : 40;
        const canvas = document.createElement('canvas');
        canvas.width = length + 15;
        canvas.height = 20;
        const ctx = canvas.getContext('2d');
        
        if (type === 'pike') {
            if (facingRight) {
                // Pike shaft (pointing right)
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(0, 10);
                ctx.lineTo(length, 10);
                ctx.stroke();
                
                // Pike tip (pointing right) - triangle pointing right
                ctx.fillStyle = '#C0C0C0';
                ctx.beginPath();
                ctx.moveTo(length + 12, 10);  // Tip point (rightmost)
                ctx.lineTo(length, 5);         // Top left
                ctx.lineTo(length, 15);        // Bottom left
                ctx.closePath();
                ctx.fill();
                
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.stroke();
            } else {
                // Pike shaft (pointing left)
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(12, 10);
                ctx.lineTo(length + 15, 10);
                ctx.stroke();
                
                // Pike tip (pointing left) - triangle pointing left
                ctx.fillStyle = '#C0C0C0';
                ctx.beginPath();
                ctx.moveTo(0, 10);  // Tip point (leftmost)
                ctx.lineTo(12, 5);   // Top right
                ctx.lineTo(12, 15);  // Bottom right
                ctx.closePath();
                ctx.fill();
                
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        } else {
            // Sword blade
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(0, 8, length, 4);
            
            // Sword tip
            ctx.beginPath();
            ctx.moveTo(length, 8);
            ctx.lineTo(length + 8, 10);
            ctx.lineTo(length, 12);
            ctx.closePath();
            ctx.fill();
            
            // Hilt
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(0, 6, 5, 8);
        }
        
        return canvas;
    }
    
    static createGriffinSprite(facingRight = true) {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        
        if (!facingRight) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        
        // Eagle head (golden-brown)
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(50, 15, 25, 20);
        
        // Beak
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(75, 25);
        ctx.lineTo(80, 22);
        ctx.lineTo(80, 28);
        ctx.closePath();
        ctx.fill();
        
        // Eye
        ctx.fillStyle = '#000';
        ctx.fillRect(68, 20, 4, 4);
        
        // Lion body (golden-brown)
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(20, 40, 45, 50);
        
        // Legs
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(25, 90, 12, 30);
        ctx.fillRect(48, 90, 12, 30);
        
        // Wings (visible even when grounded)
        ctx.fillStyle = '#B8860B';
        ctx.beginPath();
        ctx.moveTo(20, 50);
        ctx.lineTo(5, 40);
        ctx.lineTo(10, 70);
        ctx.closePath();
        ctx.fill();
        
        // Wing feathers
        ctx.strokeStyle = '#8B7355';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(10, 45 + i * 8);
            ctx.lineTo(15, 48 + i * 8);
            ctx.stroke();
        }
        
        // Talons
        ctx.fillStyle = '#000';
        ctx.fillRect(25, 118, 3, 2);
        ctx.fillRect(30, 118, 3, 2);
        ctx.fillRect(48, 118, 3, 2);
        ctx.fillRect(53, 118, 3, 2);
        
        return canvas;
    }
    
    static createMinotaurSprite(facingRight = true) {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        
        if (!facingRight) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        
        // Bull head (brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(25, 10, 30, 25);
        
        // Horns
        ctx.fillStyle = '#F5DEB3';
        ctx.beginPath();
        ctx.moveTo(25, 15);
        ctx.lineTo(20, 5);
        ctx.lineTo(25, 10);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(55, 15);
        ctx.lineTo(60, 5);
        ctx.lineTo(55, 10);
        ctx.closePath();
        ctx.fill();
        
        // Snout
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(30, 28, 20, 8);
        
        // Nostrils
        ctx.fillStyle = '#000';
        ctx.fillRect(35, 32, 3, 3);
        ctx.fillRect(42, 32, 3, 3);
        
        // Eyes (red)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(32, 18, 5, 5);
        ctx.fillRect(43, 18, 5, 5);
        
        // Muscular body
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(20, 40, 40, 50);
        
        // Chest muscles definition
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 45);
        ctx.lineTo(40, 85);
        ctx.stroke();
        
        // Arms (muscular)
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(10, 45, 10, 35);
        ctx.fillRect(60, 45, 10, 35);
        
        // Legs
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(25, 90, 12, 30);
        ctx.fillRect(43, 90, 12, 30);
        
        // Hooves
        ctx.fillStyle = '#000';
        ctx.fillRect(25, 118, 12, 2);
        ctx.fillRect(43, 118, 12, 2);
        
        // Battle axe (held in hand)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(68, 50, 4, 25);
        ctx.fillStyle = '#696969';
        ctx.fillRect(65, 48, 10, 8);
        
        return canvas;
    }
    
    static createCyclopsSprite(facingRight = true) {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        
        if (!facingRight) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        
        // Head (gray-green)
        ctx.fillStyle = '#8FBC8F';
        ctx.fillRect(25, 10, 30, 30);
        
        // Single large eye
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(40, 22, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupil
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(40, 22, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Angry eyebrow
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(28, 15);
        ctx.lineTo(40, 12);
        ctx.lineTo(52, 15);
        ctx.stroke();
        
        // Mouth (grimace)
        ctx.beginPath();
        ctx.moveTo(30, 35);
        ctx.lineTo(50, 35);
        ctx.stroke();
        
        // Massive body
        ctx.fillStyle = '#8FBC8F';
        ctx.fillRect(15, 45, 50, 50);
        
        // Belly
        ctx.fillStyle = '#7CCD7C';
        ctx.fillRect(20, 55, 40, 30);
        
        // Arms (huge)
        ctx.fillStyle = '#8FBC8F';
        ctx.fillRect(5, 50, 10, 40);
        ctx.fillRect(65, 50, 10, 40);
        
        // Hands
        ctx.fillRect(3, 88, 14, 12);
        ctx.fillRect(63, 88, 14, 12);
        
        // Legs (thick)
        ctx.fillStyle = '#6B8E23';
        ctx.fillRect(20, 95, 18, 25);
        ctx.fillRect(42, 95, 18, 25);
        
        // Club (held high)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(70, 20, 8, 35);
        ctx.fillRect(68, 18, 12, 8);
        
        return canvas;
    }
    
    static createHydraSprite(facingRight = true) {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        
        if (!facingRight) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        
        // Serpent body (green scales)
        ctx.fillStyle = '#228B22';
        ctx.fillRect(20, 60, 40, 40);
        
        // Scale pattern
        ctx.fillStyle = '#32CD32';
        for (let y = 65; y < 95; y += 8) {
            for (let x = 25; x < 55; x += 8) {
                ctx.fillRect(x, y, 6, 6);
            }
        }
        
        // Tail
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.moveTo(30, 100);
        ctx.lineTo(25, 115);
        ctx.lineTo(35, 115);
        ctx.closePath();
        ctx.fill();
        
        // Three necks
        const neckPositions = [25, 40, 55];
        neckPositions.forEach((x, i) => {
            // Neck
            ctx.fillStyle = '#228B22';
            ctx.fillRect(x, 30, 8, 30);
            
            // Head
            ctx.fillRect(x - 2, 15, 12, 15);
            
            // Eyes
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(x + 2, 20, 3, 3);
            
            // Fangs
            ctx.fillStyle = '#FFF';
            ctx.fillRect(x + 1, 28, 2, 4);
            ctx.fillRect(x + 5, 28, 2, 4);
            
            // Forked tongue
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + 4, 30);
            ctx.lineTo(x + 4, 35);
            ctx.moveTo(x + 4, 35);
            ctx.lineTo(x + 2, 37);
            ctx.moveTo(x + 4, 35);
            ctx.lineTo(x + 6, 37);
            ctx.stroke();
        });
        
        return canvas;
    }
    
    static createZeusSprite(facingRight = true) {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        
        if (!facingRight) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        
        // Head (divine glow)
        ctx.fillStyle = '#FFE4B5';
        ctx.fillRect(28, 15, 24, 20);
        
        // White beard
        ctx.fillStyle = '#FFF';
        ctx.fillRect(25, 30, 30, 15);
        
        // Beard detail
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(28 + i * 5, 35);
            ctx.lineTo(28 + i * 5, 43);
            ctx.stroke();
        }
        
        // White hair
        ctx.fillStyle = '#FFF';
        ctx.fillRect(25, 12, 30, 8);
        
        // Golden crown
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(25, 8, 30, 5);
        // Crown points
        ctx.fillRect(28, 5, 4, 3);
        ctx.fillRect(38, 5, 4, 3);
        ctx.fillRect(48, 5, 4, 3);
        
        // Eyes (glowing)
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(33, 22, 4, 4);
        ctx.fillRect(43, 22, 4, 4);
        
        // Regal robes (white and gold)
        ctx.fillStyle = '#FFF';
        ctx.fillRect(20, 50, 40, 50);
        
        // Golden trim
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(20, 50, 40, 5);
        ctx.fillRect(20, 70, 40, 3);
        ctx.fillRect(20, 90, 40, 3);
        
        // Arms
        ctx.fillStyle = '#FFF';
        ctx.fillRect(12, 55, 8, 30);
        ctx.fillRect(60, 55, 8, 30);
        
        // Hands (holding staff)
        ctx.fillStyle = '#FFE4B5';
        ctx.fillRect(10, 83, 12, 10);
        ctx.fillRect(58, 83, 12, 10);
        
        // Lightning bolt staff
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(70, 30);
        ctx.lineTo(70, 90);
        ctx.stroke();
        
        // Staff top (lightning bolt)
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.moveTo(70, 20);
        ctx.lineTo(75, 28);
        ctx.lineTo(72, 28);
        ctx.lineTo(77, 35);
        ctx.lineTo(68, 30);
        ctx.lineTo(70, 30);
        ctx.closePath();
        ctx.fill();
        
        // Divine aura
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(40, 60, 45, 0, Math.PI * 2);
        ctx.stroke();
        
        // Legs/robe bottom
        ctx.fillStyle = '#FFF';
        ctx.fillRect(25, 100, 12, 20);
        ctx.fillRect(43, 100, 12, 20);
        
        // Sandals (gold)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(25, 118, 12, 2);
        ctx.fillRect(43, 118, 12, 2);
        
        return canvas;
    }
}

// Made with Bob
