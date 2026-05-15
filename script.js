const basket = document.getElementById("basket");
const ball = document.getElementById("ball");
const scoreText = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const livesText = document.getElementById("lives");
const pauseBtn = document.getElementById("pauseBtn");

const highScoreText = document.getElementById("highScore");

const gameOverModal = document.getElementById("gameOverModal");
const finalScoreText = document.getElementById("finalScoreText");
const restartBtn = document.getElementById("restartBtn");

const timerText = document.getElementById("timer");

let timer = 0;

let timerInterval;

let paused = false;

let basketX = 150;

let ballX = Math.random() * 340;
let ballY = 0;

let lives = 3;
let score = 0;

let speed = 4;

let gameInterval;

let gameRunning = false;

let highScore = localStorage.getItem("highScore") || 0;

highScoreText.innerText = highScore;

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

            scoreText.classList.add("scorePop");

            setTimeout(function(){

                scoreText.classList.remove("scorePop");

            }, 200);

            if(score > highScore){

                highScore = score;

                localStorage.setItem("highScore", highScore);

                highScoreText.innerText = highScore;
            }

            if(score % 5 === 0){
                speed += 1;
            }

        }else{

            lives--;

            if(lives <= 0){

                lives = 0;

                gameRunning = false;

                clearInterval(gameInterval);

                clearInterval(timerInterval);

                resetBall();

                livesText.innerText = lives;

                finalScoreText.innerText = "Final Score: " + score;

                gameOverModal.style.display = "flex";

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

    paused = false;

    pauseBtn.innerText = "Pause";

    score = 0;

    lives = 3;

    speed = 4;

    timer = 0;

    timerText.innerText = timer;

    scoreText.innerText = score;

    livesText.innerText = lives;

    gameOverModal.style.display = "none";

    resetBall();

    clearInterval(gameInterval);

    clearInterval(timerInterval);

    gameInterval = setInterval(updateBall, 20);

    timerInterval = setInterval(function(){

        timer++;

        timerText.innerText = timer;

    }, 1000);

    startBtn.disabled = true;

    document.getElementById("startScreen").style.display = "none";
}

startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", function(){

    gameOverModal.style.display = "none";

    startGame();
});

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

        clearInterval(timerInterval);

        pauseBtn.innerText = "Resume";

        paused = true;

    }else{

        gameInterval = setInterval(updateBall, 20);

        timerInterval = setInterval(function(){

            timer++;

            timerText.innerText = timer;

        }, 1000);

        pauseBtn.innerText = "Pause";

        paused = false;
    }
});

document.addEventListener("touchmove", function(event){

    const gameArea = document.getElementById("gameArea");

    const rect = gameArea.getBoundingClientRect();

    basketX = event.touches[0].clientX - rect.left - 50;

    if(basketX < 0){
        basketX = 0;
    }

    if(basketX > 300){
        basketX = 300;
    }

    basket.style.left = basketX + "px";
});