import { GameState, Assets, PhysParams, playSound, Sounds, getHighScore, saveHighScore } from './Constants.js';
import { Bird } from './Bird.js';
import { PipePair } from './Pipe.js';

function nextPipeY(prevY) {
    let lower = Math.max(PhysParams.PIPE_Y_MIN, prevY - PhysParams.PIPE_Y_DELTA_MAX);
    let upper = Math.min(PhysParams.PIPE_Y_MAX, prevY + PhysParams.PIPE_Y_DELTA_MAX);
    return Math.floor(Math.random() * (upper - lower)) + lower;
}

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.highScore = getHighScore();
        this.resetState()
        this.setupInputs();
    }

    resetState() {
        this.state = GameState.START;
        this.score = 0;
        this.bird = new Bird();
        this.pipes = [];
        let firstPipeY = Math.floor(Math.random() * (PhysParams.PIPE_Y_MAX - PhysParams.PIPE_Y_MIN)) + PhysParams.PIPE_Y_MIN ;
        this.pipes.push(new PipePair(this.canvas.width, firstPipeY, this.canvas.width));
        this.baseOffset = 0;
    }

    setupInputs() {
        const flapAction = () => {
            if (this.state === GameState.START) {
                this.state = GameState.PLAYING;
                this.bird.flap();
            } else if (this.state === GameState.PLAYING) {
                this.bird.flap();
            } else if (this.state === GameState.END) {
                playSound(Sounds.swoosh);
                this.resetState();
            }
        };

        let isTouchDevice = false;
        window.addEventListener('keydown',
            (e) => {
                    if (e.code === 'Space') {
                        e.preventDefault();
                        flapAction();
                    }
                }, {passive: false});

        window.addEventListener('mousedown', flapAction);

        window.addEventListener('touchstart', (e) => {
            e.preventDefault();
            flapAction();
        });
    }

    update(dt) {
        this.bird.update(this.state, this.canvas.height, dt);

        if(this.state !== GameState.END){
            this.baseOffset -= PhysParams.PIPE_PACE * dt;

            if(this.baseOffset <= -Assets.base.width){
                this.baseOffset += Assets.base.width;
            }
        }

        if (this.bird.y + this.bird.height >= this.canvas.height - 112) {
            if (this.state !== GameState.END) {
                playSound(Sounds.die);
                this.checkAndSaveHighScore();
            }
            this.state = GameState.END;
            this.bird.y = this.canvas.height - 112 - this.bird.height;
        }

        if (this.state === GameState.PLAYING) {
            for (let pipe of this.pipes) {
                pipe.update(dt);

                if (!pipe.passed && pipe.x < this.bird.x) {
                    this.score++;
                    pipe.passed = true;
                    playSound(Sounds.point);
                }

                if (pipe.checkCollision(this.bird)) {
                    if(this.state !== GameState.END){
                        playSound(Sounds.hit);
                        this.checkAndSaveHighScore();
                    }
                    this.state = GameState.END;
                }

                if (!pipe.spawnedNext && pipe.x <= PhysParams.SPAWN_TRIGGER_X) {
                    pipe.spawnedNext = true
                    let randomY = nextPipeY(pipe.y);
                    this.pipes.push(new PipePair(this.canvas.width, randomY, this.canvas.width))
                }
            }

            if (this.pipes.length > 0 && this.pipes[0].x < -52) {
                this.pipes.shift();
            }
        }
    }

    drawScore() {
        this.drawNumber(this.score, this.canvas.width / 2, 40);
    }

    checkAndSaveHighScore(){
        if(this.score > this.highScore){
            this.highScore = this.score;
            saveHighScore(this.highScore);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(Assets.bg, 0, 0, this.canvas.width, this.canvas.height);

        for (let pipe of this.pipes) {
            pipe.draw(this.ctx);
        }
        if(this.state !== GameState.START){
            this.bird.draw(this.ctx);
        }

        const baseY = this.canvas.height - 112;
        const offset = Math.floor(this.baseOffset);
        this.ctx.drawImage(Assets.base, offset, baseY);
        this.ctx.drawImage(Assets.base, offset + Assets.base.width, baseY);
        if (this.state === GameState.PLAYING) {
            this.drawScore();
        }

        if (this.state === GameState.END) {
            const sbX = (this.canvas.width - Assets.scoreboard.width) / 2;
            const sbY = 60;
            this.ctx.drawImage(Assets.scoreboard, sbX, sbY);

            const medal = this.getMedal();
            if (medal) {
                const medalX = sbX + 32.5;
                const medalY = sbY + 112;
                this.ctx.drawImage(medal, medalX, medalY);
            }

            const numbersCenterX = sbX + 210;
            this.drawNumber(this.score,     numbersCenterX, sbY + 105 , 0.5, 'right');
            this.drawNumber(this.highScore, numbersCenterX, sbY + 145, 0.5, 'right');
        }


        if(this.state === GameState.START){
            let x = this.canvas.width / 2 - Assets.message.width / 2;
            let y = this.canvas.height / 2 - Assets.message.height / 2 -25;
            this.ctx.drawImage(Assets.message, x, y);
        }
    }

    drawNumber(value, x, y, scale = 1, align = 'center') {
        const text = value.toString();
        let totalWidth = 0;
        for (const ch of text) {
            totalWidth += Assets.numbers[parseInt(ch)].width * scale;
        }
        totalWidth += (text.length - 1) * 2 * scale;

        let startX;
        if (align === 'center') {
            startX = x - totalWidth / 2;
        } else if (align === 'right') {
            startX = x - totalWidth;
        } else {
            startX = x;
        }

        for (const ch of text) {
            const img = Assets.numbers[parseInt(ch)];
            const w = img.width * scale;
            const h = img.height * scale;
            this.ctx.drawImage(img, startX, y, w, h);
            startX += w + 2 * scale;
        }
    }

    getMedal(){
        if(this.score >= 40) return Assets.medalPlatinum;
        if(this.score >= 30) return Assets.medalGold;
        if(this.score >= 20) return Assets.medalSilver;
        if(this.score >= 10) return Assets.medalBronze;
        return null
    }

    startLoop() {
        this.lastTime = 0;
        const loop = (now) => {
            let dt = (now - this.lastTime) / 1000;
            if(!this.lastTime || dt > 0.05) dt = 1/60;
            this.lastTime = now;

            this.update(dt);
            this.draw();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}