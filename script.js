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

const difficultySelect =
    document.getElementById("difficultySelect");

const themeSelect =
    document.getElementById("themeSelect");

const playerName =
    document.getElementById("playerName");

const welcomeText =
    document.getElementById("welcomeText");

const achievementList =
    document.getElementById("achievementList");

const pauseOverlay =
    document.getElementById("pauseOverlay");

const savePlayerBtn =
    document.getElementById("savePlayerBtn");

const comboText =
    document.getElementById("combo");

const gameArea = 
    document.getElementById("gameArea");


const catchSound =
    new Audio("assets/catch.mp3");

const missSound =
    new Audio("assets/miss.mp3");

const gameOverSound =
    new Audio("assets/gameover.mp3");

const soundSelect =
    document.getElementById("soundSelect");

const bestComboText = 
    document.getElementById("bestCombo");

let timer = 0;

let timerInterval;

let paused = false;

let basketX = 150;

let ballX = Math.random() * 340;
let ballY = 0;

let lives = 3;
let score = 0;

let speed = 4;

let combo = 0;
let bestCombo = 0;

let gameInterval;

let gameRunning = false;

let highScore =
    localStorage.getItem("highScore") || 0;

highScoreText.innerText = highScore;

const savedPlayer =
    localStorage.getItem("playerName");

if(savedPlayer){

    welcomeText.innerText =
        "Welcome Back, " + savedPlayer;

    playerName.value = savedPlayer;
}

const savedTheme = 
    localStorage.getItem("theme");

if(savedTheme){
    themeSelect.value= savedTheme;

    if(savedTheme === "light"){
        document.body.classList.add(
            "lightMode"
        );
    }
}

const savedDifficulty = 
    localStorage.getItem("difficulty");

if(savedDifficulty){
    difficultySelect.value = 
        savedDifficulty;
}

document.addEventListener("mousemove", moveBasket);

function moveBasket(event){

    const gameArea =
        document.getElementById("gameArea");

    const rect =
        gameArea.getBoundingClientRect();

    basketX =
        event.clientX - rect.left - 50;

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

            combo++;

            comboText.innerText = combo;

            if(combo === 5){

                const achievement=
                    document.createElement("li");

                achievement.innerText =
                    "Combo Master 5";

                document.getElementById(
                    "emptyAchievementText"
                ).style.display = "none";

                achievementList.appendChild(
                    achievement
                );
            }

            if (combo === 10){
                const achievement = 
                    document.createElement("li");

                achievement.innerText =
                    "Combo Master 10";

                achievementList.appendChild(
                    achievement
                );
            }

            if(combo>bestCombo){
                bestCombo = combo;
                bestComboText.innerText =
                    bestCombo;
            }

            if(soundSelect.value === "on"){
                catchSound.play();
            }

            createParticles();
            
            scoreText.innerText = score;

            scoreText.classList.add("scorePop");

            setTimeout(function(){

                scoreText.classList.remove("scorePop");

            }, 200);

            if(score === 10){

                const achievement =
                    document.createElement("li");

                achievement.innerText =
                    "Scored 10 Points";
                    
                document.getElementById(
                    "emptyAchievementText"
                ).style.display = "none";

                achievementList.appendChild(
                    achievement
                );
            }

            if(score > highScore){

                highScore = score;

                localStorage.setItem(
                    "highScore",
                    highScore
                );

                highScoreText.innerText =
                    highScore;
            }

            if(score % 5 === 0){

                speed += 1;
            }

        }else{

            lives--;

            combo = 0;

            comboText.innerText = combo;

            if(soundSelect.value === "on"){

                missSound.play();
            }

            document.body.classList.add("shake");

            setTimeout(function(){

                document.body.classList.remove("shake");

            }, 300);

            if(lives <= 0){

                lives = 0;

                gameRunning = false;

                if(soundSelect.value === "on"){

                    gameOverSound.play();
                }

                clearInterval(gameInterval);

                clearInterval(timerInterval);

                resetBall();

                livesText.innerText = lives;

                finalScoreText.innerText =
                    "Final Score: " + score;

                gameOverModal.style.display =
                    "flex";

                startBtn.disabled = false;

                return;
            }

            livesText.innerText = lives;
        }

        resetBall();
    }
}

function createParticles (){

    for (let i =0; i<8 ; i++){

        const particle =
            document.createElement("div");

        particle.classList.add("particle");

        particle.style.left=
            ballX + "px";

        particle.style.top=
            ballY + "px";

        gameArea.appendChild(particle);

        setTimeout(function(){
            particle.remove();
        }, 600);
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

    pauseOverlay.style.display = "none";

    score = 0;

    combo = 0;

    comboText.innerText = combo;

    lives = 3;

    const difficulty =
        difficultySelect.value;

    localStorage.setItem(
        "difficulty",
        difficultySelect.value
    );

    if(difficulty === "easy"){

        speed = 3;

        lives = 5;
    }

    if(difficulty === "medium"){

        speed = 4;

        lives = 3;
    }

    if(difficulty === "hard"){

        speed = 6;

        lives = 2;
    }

    timer = 0;

    timerText.innerText = timer;

    scoreText.innerText = score;

    livesText.innerText = lives;

    gameOverModal.style.display = "none";

    resetBall();

    clearInterval(gameInterval);

    clearInterval(timerInterval);

    gameInterval =
        setInterval(updateBall, 20);

    timerInterval = setInterval(function(){

        timer++;

        timerText.innerText = timer;

        if(timer === 30){

            const achievement = 
                document.createElement("li");

            achievement.innerText =
                "Survived 30 Seconds";

            document.getElementById(
                "emptyAchievementText"
            ).style.display = "none";

            achievementList.appendChild(
                achievement
            );
        }

    }, 1000);

    gameArea.style.transform = "scale(1.02)";

    setTimeout(function(){

        gameArea.style.transform = "scale(1)";

    },300);

    startBtn.disabled = true;

    document.getElementById(
        "startScreen"
    ).style.display = "none";
}

startBtn.addEventListener(
    "click",
    startGame
);

restartBtn.addEventListener(
    "click",
    function(){

        gameOverModal.style.display =
            "none";

        startGame();
    }
);

document.addEventListener(
    "keydown",
    function(event){

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

        basket.style.left =
            basketX + "px";
    }
);

pauseBtn.addEventListener(
    "click",
    function(){

        if(!paused){

            clearInterval(gameInterval);

            clearInterval(timerInterval);

            pauseBtn.innerText = "Resume";

            pauseOverlay.style.display =
                "flex";

            paused = true;

        }else{

            gameInterval =
                setInterval(updateBall, 20);

            timerInterval =
                setInterval(function(){

                    timer++;

                    timerText.innerText =
                        timer;

                }, 1000);

            pauseBtn.innerText = "Pause";

            pauseOverlay.style.display =
                "none";

            paused = false;
        }
    }
);

document.addEventListener(
    "touchmove",
    function(event){

        const gameArea =
            document.getElementById(
                "gameArea"
            );

        const rect =
            gameArea.getBoundingClientRect();

        basketX =
            event.touches[0].clientX -
            rect.left -
            50;

        if(basketX < 0){

            basketX = 0;
        }

        if(basketX > 300){

            basketX = 300;
        }

        basket.style.left =
            basketX + "px";
    }
);

themeSelect.addEventListener(
    "change",
    function(){

        localStorage.setItem(
            "theme",
            themeSelect.value
        );
    
        if(themeSelect.value === "light"){

            document.body.classList.add(
                "lightMode"
            );

        }else{

            document.body.classList.remove(
                "lightMode"
            );
        }
    }
);

savePlayerBtn.addEventListener(
    "click",
    function(){

        localStorage.setItem(
            "playerName",
            playerName.value
        );

        welcomeText.innerText =
            "Welcome Back, " +
            playerName.value;
    }
);

window.addEventListener(

    "load",

    function(){

        setTimeout(function(){

            document.getElementById(
                "loadingScreen"
                
            ).style.display = "none";

        },2000);
    }
);