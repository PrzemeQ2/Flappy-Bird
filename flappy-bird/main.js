const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bgImage = new Image();
bgImage.src = 'assets/sprites/background-day.png';

const baseImage = new Image();
baseImage.src = 'assets/sprites/base.png';

const birdImage = new Image(); 
birdImage.src = 'assets/sprites/yellowbird-midflap.png'

const pipeImage = new Image(); 
pipeImage.src = 'assets/sprites/pipe-green.png'

const pipes = [];
const pipeWidth = 52; 
const pipeHeight = 320; 
const gap = 110;

pipes.push({
    x: canvas.width,
    y: 0
})

const bird = {
    x: 50, 
    y: 150, 
    width: 34, 
    height: 24,
    velocity: 0, 
    gravity: 0.25,
    jump: -4.5
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    for(let i = 0; i < pipes.length; i++){
        let p = pipes[i];
        
        ctx.save()
        ctx.translate(p.x + pipeWidth / 2, p.y + pipeHeight);
        ctx.scale(1, -1);
        
        ctx.drawImage(pipeImage, -pipeWidth / 2, 0, pipeWidth, pipeHeight);
        ctx.restore();

        ctx.drawImage(pipeImage, p.x, p.y + pipeHeight + gap, pipeWidth, pipeHeight);
        p.x -= 2;
        
        if(bird.x + bird.width >= p.x && bird.x <= p.x + pipeWidth){
            if(bird.y <= p.y + pipeHeight || bird.y + bird.height){
                location.reload();
            }
        }

        if(p.x == 120){
            pipes.push({
                x: canvas.width, 
                // height of the pipe draw 
                y: Math.floor(Math.random() * pipeHeight) - pipeHeight  
            })
        } 
    }

    bird.velocity += bird.gravity;
    bird.y += bird.velocity; 
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    
    ctx.drawImage(baseImage, 0, canvas.height - 112, canvas.width, 112);
    
    if (bird.y + bird.height >= canvas.height -112){
        location.reload();
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', function(event){
    if (event.code === 'Space'){
        bird.velocity = bird.jump;
    }}
);

window.addEventListener('mousedown', function(){
    bird.velocity = bird.jump;
}
); 

gameLoop();