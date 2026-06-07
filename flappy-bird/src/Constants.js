export const GameState = Object.freeze({
    START: 0,
    PLAYING: 1,
    END: -1
});

export const Assets = {
    bg: new Image(),
    base: new Image(),
    birdFrames: [new Image(), new Image(), new Image()],
    pipe: new Image(),
    message: new Image(),
    numbers: [],
    scoreboard: new Image(),
    medalBronze: new Image(),
    medalSilver: new Image(),
    medalGold: new Image(),
    medalPlatinum: new Image(),
    replay: new Image(),
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
Assets.birdFrames[0].src = 'assets/sprites/yellowbird-downflap.png';
Assets.birdFrames[1].src = 'assets/sprites/yellowbird-midflap.png';
Assets.birdFrames[2].src = 'assets/sprites/yellowbird-upflap.png';
Assets.pipe.src = 'assets/sprites/pipe-green.png';
Assets.message.src = 'assets/sprites/message.png'
Assets.scoreboard.src = 'assets/sprites/scoreboard.png';
Assets.medalBronze.src = 'assets/sprites/medal_bronze.png';
Assets.medalSilver.src = 'assets/sprites/medal_silver.png';
Assets.medalGold.src = 'assets/sprites/medal_gold.png';
Assets.medalPlatinum.src = 'assets/sprites/medal_platinum.png';
Assets.replay.src = 'assets/sprites/replay.png';

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
        ...Assets.birdFrames,
        Assets.pipe,
        Assets.message,
        ...Assets.numbers,
        Assets.scoreboard,
        Assets.medalBronze,
        Assets.medalSilver,
        Assets.medalGold,
        Assets.medalPlatinum,
        Assets.replay
    ];
    return Promise.all(all.map(img => img.decode().catch(() => {})));

}

export function playSound(sound){
    sound.currentTime = 0;
    sound.play().catch(() => {});
}

const HIGH_SCORE_KEY = 'flappyBird.highScore';

export function getHighScore(){
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    return stored ? parseInt(stored) : 0;
}

export function saveHighScore(score){
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
}