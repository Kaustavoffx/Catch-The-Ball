const basket = document.getElementById("basket");
const ball = document.getElementById("ball")
const scoreText = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

let basketX=150;
let ballX = Math.random() = 370;
let ballY = 0;

let score = 0;

document.addEventListener("mousemove", moveBasket);

function moveBasket(event){
    const gameArea = document.getElementById("gameArea");
    const rect = gameArea.getBoundingClientRect();

    basketX = event.clientX - rect.left - 50;

    if (basketX <0){
        basketX =0 ;
    }

    if (basketX>300){
        basketX = 300;
    }

    basket.style.left = basketX + 'px';

}

function updateBall(){
    ballY += 4;

    ball.style.top = ballY +'px';
    ball.style.left = ballY +'px';

if(ballY > 550){
    if(ballX > basketX && ballX < basketX){
        score++;
        scoreText.innerText = score;

        }

    resetBall()
    }
}

function resetball(){
    ballY = 0;
    ballX = Math.random() *370;
}

let gameInterval;
startBtn.addEventListener("click", startGame);

function startgame(){
    gameInterval = setInterval(updateBall, 20);

    startBtn.disabled = true;
        
}