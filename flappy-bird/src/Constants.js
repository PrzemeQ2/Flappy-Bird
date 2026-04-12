export const GameState = Object.freeze({
    START: 0,
    PLAYING: 1,
    END: -1
});

export const Assets = {
    bg: new Image(),
    base: new Image(),
    bird: new Image(),
    pipe: new Image(),
    gameOver: new Image(),
    numbers: []
};

Assets.bg.src = 'assets/sprites/background-day.png';
Assets.base.src = 'assets/sprites/base.png';
Assets.bird.src = 'assets/sprites/yellowbird-midflap.png';
Assets.pipe.src = 'assets/sprites/pipe-green.png';
Assets.gameOver.src = 'assets/sprites/gameover.png';

for(let i = 0; i <= 9; i++){
    let img = new Image();
    img.src = `assets/sprites/${i}.png`;
    Assets.numbers.push(img);
}