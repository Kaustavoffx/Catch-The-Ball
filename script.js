const basket = document.getElementById("basket");
const ball = document.getElementById("ball");
const scoreText = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const livesText = document.getElementById("lives");
const pauseBtn = document.getElementById("pauseBtn");

let paused = false;
let basketX = 150;
let ballX = Math.random() * 340;
let ballY = 0;
let lives = 3;
let score = 0;
let speed = 4;
let gameInterval;
let gameRunning = false;

document.addEventListener("mousemove", moveBasket);

function moveBasket(event){

    const gameArea = document.getElementById("gameArea");

    const rect = gameArea.getBoundingClientRect();

    basketX = event.clientX - rect.left - 50;

    if(basketX < 0){
        basketX = 0;
    }

    if(basketX > 300){
        basketX = 300;
    }

    basket.style.left = basketX + "px";
}

function updateBall(){

    if(!gameRunning){
        return;
    }

    ballY += speed;

    ball.style.top = ballY + "px";
    ball.style.left = ballX + "px";

    if(ballY > 520){

        if(
            ballX + 30 > basketX &&
            ballX < basketX + 100
        ){

            score++;

            scoreText.innerText = score;

            if(score % 5 === 0){
                speed += 1;
            }

        }else{

            lives--;

            if(lives <= 0){

                lives = 0;

                gameRunning = false;

                clearInterval(gameInterval);

                resetBall();

                livesText.innerText = lives;

                alert("Game Over! Final Score: " + score);

                startBtn.disabled = false;

                return;
            }

            livesText.innerText = lives;
        }

        resetBall();
    }
}

function resetBall(){

    ballY = 0;

    ballX = Math.random() * 340;

    ball.style.top = ballY + "px";

    ball.style.left = ballX + "px";
}

function startGame(){

    gameRunning = true;

    score = 0;

    lives = 3;

    speed = 4;

    scoreText.innerText = score;

    livesText.innerText = lives;

    resetBall();

    clearInterval(gameInterval);

    gameInterval = setInterval(updateBall, 20);

    startBtn.disabled = true;
}

startBtn.addEventListener("click", startGame);

document.addEventListener("keydown", function(event){

    if(event.key === "ArrowLeft"){
        basketX -= 30;
    }

    if(event.key === "ArrowRight"){
        basketX += 30;
    }

    if(basketX < 0){
        basketX = 0;
    }

    if(basketX > 300){
        basketX = 300;
    }

    basket.style.left = basketX + "px";
});

pauseBtn.addEventListener("click", function(){

    if(!paused){

        clearInterval(gameInterval);

        pauseBtn.innerText = "Resume";

        paused = true;

    }else{

        gameInterval = setInterval(updateBall, 20);

        pauseBtn.innerText = "Pause";

        paused = false;
    }
});
