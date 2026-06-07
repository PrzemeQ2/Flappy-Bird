import {GameState, Assets, PhysParams, playSound, Sounds} from "./Constants.js";

export class Bird {
    constructor() {
        this.x = 50;
        this.y = 150;
        this.width = 34;
        this.height = 24;
        this.velocity = 0;
        this.gravity = PhysParams.GRAVITY;
        this.jumpStrength = PhysParams.JUMP_VELOCITY;

        this.frameSequence = [0,1,2,1];
        this.frameIndex = 0;
        this.animationTimer = 0;
    }

    flap(){
        this.velocity = this.jumpStrength;
        playSound(Sounds.wing);
    }

    update(state, canvasHeight, dt) {
        if(state !== GameState.END) {
            const animSpeed = this.velocity > 0 ? 0.15 : 0.07;
            this.animationTimer += dt;
            if(this.animationTimer >= animSpeed) {
                this.animationTimer -= animSpeed;
                this.frameIndex = (this.frameIndex + 1) % this.frameSequence.length;
            }
        }

        if (state === GameState.PLAYING) {
            this.velocity += this.gravity * dt;
            this.y += this.velocity * dt;
        } else if (state === GameState.END) {
            if (this.y + this.height < canvasHeight - 112) {
                this.velocity += this.gravity * dt;
                this.y += this.velocity * dt;
            }
        }
    }

    draw(ctx) {
        const ROTATION_FACTOR = 0.00167;
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);

        let rotation = 0;
        if (this.velocity > 0) {
            rotation = Math.min(Math.PI / 2, this.velocity * ROTATION_FACTOR);
        } else {
            rotation = -25 * Math.PI / 180; 
        }
        
        ctx.rotate(rotation);
        const currentFrame = Assets.birdFrames[this.frameSequence[this.frameIndex]];
        ctx.drawImage(currentFrame, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    getHitbox(){
        const p = PhysParams.BIRD_HITBOX_PADDING;
        return {
            x: this.x + p,
            y: this.y + p,
            width: this.width - p*2,
            height: this.height - p*2
        }
    }
}