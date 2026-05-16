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

export const PhysParams = {
    PIPE_PACE: 120,
    GRAVITY: 900,
    JUMP_VELOCITY: -270,
    PIPE_Y_MAX: -50,
    PIPE_Y_MIN: -250,
    PIPE_Y_DELTA_MAX: 165,
    SPAWN_TRIGGER_X: 120,
    BIRD_HITBOX_PADDING: 3
}

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

export const Sounds = {
    wing: new Audio('assets/audio/wing.wav'),
    point: new Audio('assets/audio/point.wav'),
    hit: new Audio('assets/audio/hit.wav'),
    die: new Audio('assets/audio/die.wav'),
    swoosh: new Audio('assets/audio/swoosh.wav')
};

export function preloadAssets(){
    const all = [
        Assets.bg,
        Assets.base,
        Assets.bird,
        Assets.pipe,
        Assets.gameOver,
        ...Assets.numbers
    ];
    return Promise.all(all.map(img => img.decode().catch(() => {})));

}

export function playSound(sound){
    sound.currentTime = 0;
    sound.play().catch(() => {});
}