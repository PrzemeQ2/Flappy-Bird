import {GameState, Assets, PhysParams, playSound, Sounds} from './Constants.js';
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

        if (this.bird.y + this.bird.height >= this.canvas.height - 112) {
            if (this.state !== GameState.END) {
                playSound(Sounds.die);
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
        let scoreStr = this.score.toString();
        let totalWidth = 0;
        for (let i = 0; i < scoreStr.length; i++) {
            totalWidth += Assets.numbers[parseInt(scoreStr[i])].width;
        }

        let startX = this.canvas.width / 2 - totalWidth / 2;
        for (let i = 0; i < scoreStr.length; i++) {
            let img = Assets.numbers[parseInt(scoreStr[i])];
            this.ctx.drawImage(img, startX, 40);
            startX += img.width + 2;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(Assets.bg, 0, 0, this.canvas.width, this.canvas.height);

        for (let pipe of this.pipes) {
            pipe.draw(this.ctx);
        }

        this.bird.draw(this.ctx);
        this.ctx.drawImage(Assets.base, 0, this.canvas.height - 112, this.canvas.width, 112);
        this.drawScore();

        if (this.state === GameState.END) {
            let x = this.canvas.width / 2 - Assets.gameOver.width / 2;
            let y = this.canvas.height / 2 - Assets.gameOver.height / 2;
            this.ctx.drawImage(Assets.gameOver, x, y);
        }
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