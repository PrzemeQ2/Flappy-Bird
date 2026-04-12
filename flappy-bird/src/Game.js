import { GameState, Assets } from './Constants.js';
import { Bird } from './Bird.js';
import { PipePair } from './Pipe.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.state = GameState.START;
        this.score = 0;
        
        this.bird = new Bird();
        this.pipes = [];
        this.pipes.push(new PipePair(this.canvas.width, 0, this.canvas.width));

        this.setupInputs();
    }

    setupInputs() {
        const flapAction = () => {
            if (this.state === GameState.START) {
                this.state = GameState.PLAYING;
                this.bird.flap();
            } else if (this.state === GameState.PLAYING) {
                this.bird.flap();
            } else if (this.state === GameState.END) {
                location.reload(); 
            }
        };

        window.addEventListener('keydown', 
            (e) => {
                if (e.code === 'Space') flapAction();
            });
        window.addEventListener('mousedown', flapAction);
    }

    update() {
        this.bird.update(this.state, this.canvas.height);

        if (this.bird.y + this.bird.height >= this.canvas.height - 112) {
            this.state = GameState.END;
            this.bird.y = this.canvas.height - 112 - this.bird.height;
        }

        if (this.state === GameState.PLAYING) {
            for (let pipe of this.pipes) {
                pipe.update();

                if (!pipe.passed && pipe.x < this.bird.x) {
                    this.score++;
                    pipe.passed = true;
                }

                if (pipe.checkCollision(this.bird)) {
                    this.state = GameState.END;
                }

                if (pipe.x === 120) {
                    let randomY = Math.floor(Math.random() * pipe.height) - pipe.height;
                    this.pipes.push(new PipePair(this.canvas.width, randomY, this.canvas.width));
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
        const loop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(loop);
        };
        loop();
    }
}