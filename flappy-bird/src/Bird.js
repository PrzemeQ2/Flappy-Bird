import { GameState, Assets } from "./Constants.js";

export class Bird {
    constructor() {
        this.x = 50;
        this.y = 150;
        this.width = 34;
        this.height = 24;
        this.velocity = 0;
        this.gravity = 0.25;
        this.jumpStrength = -4.5;
    }

    flap(){
        this.velocity = this.jumpStrength;
    }

    update(state, canvasHeight) {
        if (state === GameState.PLAYING) {
            this.velocity += this.gravity;
            this.y += this.velocity;
        } else if (state === GameState.END) {
            if (this.y + this.height < canvasHeight - 112) {
                this.velocity += this.gravity;
                this.y += this.velocity;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);

        let rotation = 0;
        if (this.velocity > 0) {
            rotation = Math.min(Math.PI / 2, this.velocity * 0.1); 
        } else {
            rotation = -25 * Math.PI / 180; 
        }
        
        ctx.rotate(rotation);
        ctx.drawImage(Assets.bird, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

}