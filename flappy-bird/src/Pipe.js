import { Assets, PhysParams } from "./Constants.js";

export class PipePair {
    constructor(x, y, canvasWidth) {
        this.x = x || canvasWidth;
        this.y = y;
        this.width = 52;
        this.height = 320;
        this.gap = 110;
        this.passed = false;
        this.spawnedNext = false;
    }

    update(dt) {
        this.x -= PhysParams.PIPE_PACE*dt;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height);
        ctx.scale(1, -1);
        ctx.drawImage(Assets.pipe, -this.width / 2, 0, this.width, this.height);
        ctx.restore();

        ctx.drawImage(Assets.pipe, this.x, this.y + this.height + this.gap, this.width, this.height);
    }

    checkCollision(bird) {
        const h = bird.getHitbox();
        if (h.x + h.width >= this.x && h.x <= this.x + this.width) {
            if (h.y <= this.y + this.height || h.y + h.height >= this.y + this.height + this.gap) {
                return true;
            }
        }
        return false;
    }
}