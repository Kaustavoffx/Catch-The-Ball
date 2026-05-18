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

const resumeBtn = 
    document.getElementById("resumeBtn");

const gamesPlayedText = 
    document.getElementById("gamesPlayed");

const profileBestText = 
    document.getElementById("profileBest");

const achievementCount = 
    document.getElementById(
        "achievementCount"
    );

const profileAvatar = document.getElementById("profileAvatar")
let unlockedAchievements = 0;

function addAchievement(text){
    const achievement = 
        document.createElement("li");

    achievement.innerText= text;

    document.getElementById(
        "emptyAchievementText"
    ).style.display="none";

    achievementList.appendChild(
        achievement
    );

    unlockedAchievements++;

    achievementCount.innerText = 
        unlockedAchievements;
}

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

let gamesPlayed =
    localStorage.getItem("gamesPlayed") || 0;

gamesPlayedText.innerText = gamesPlayed;

profileBestText.innerText = highScore;

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

                addAchievement(
                    "Combo Master 5"
                );

                addEvent(
                    "Combo x5 Reached"
                );

            }

            if (combo === 10){
                
                addAchievement(
                    "Combo Master 10"
                );
                addEvent(
                    "Combo x10 Dominating"
                );
            }


            if (combo === 15){
                
                addAchievement(
                    "Combo Master 10"
                );
                addEvent(
                    "Combo x15 Dominating"
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

                addAchievement(
                    "Scored 10 Points"
                );
            }
            if(score === 20){
                
                addAchievement(
                    "Combo Master 10"
                );
            }
            if(score === 25){
                
                addAchievement(
                    "Quarter Century Score"
                );
            }
            if(score === 50){
                
                addAchievement(
                    "Half Century Score"
                );
            }
            if(score === 100){
                
                addAchievement(
                    "Legendary Catcher"
                );
            }


            if(score > highScore){

                addEvent(
                    "New High Score Achieved"
                );

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
                addEvent(
                    "Game Over"
                );

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

function startCountdown(){

    pauseOverlay.style.display = "flex";

    addEvent(
        "Game Resumed"
    );

    document.getElementById(
        "pauseContent"
    ).innerHTML = `

        <h2 id="countdownText">
            3
        </h2>

    `;

    let count = 3;

    const countdownText =
        document.getElementById(
            "countdownText"
        );

    const countdownInterval =
        setInterval(function(){

            count--;

            if(count > 0){

                countdownText.innerText =
                    count;

            }else{

                clearInterval(
                    countdownInterval
                );

                pauseOverlay.style.display =
                    "none";

                gameRunning = true;
                
                gameInterval =
                    setInterval(
                        updateBall,
                        20
                    );

                timerInterval =
                    setInterval(function(){

                        timer++;

                        timerText.innerText =
                            timer;

                        if(timer === 30){

                            addAchievement(
                                "Survived 30 Seconds"
                            );
                        }

                        if(timer === 60){

                            addAchievement(
                                "Survived 60 Seconds"
                            );
                        }

                        if(timer === 90){

                            addAchievement(
                                "Ultimate Survivor"
                            );
                        }

                        if(timer === 120){

                            addAchievement(
                                "2 Minute Master"
                            );
                        }

                    },1000);

                pauseBtn.innerText =
                    "⏸ Pause";

                paused = false;

                document.getElementById(
                    "pauseContent"
                ).innerHTML = `

                    <h2>
                        Game Paused
                    </h2>

                    <button id="resumeBtn">

                        ▶ Resume Game

                    </button>

                `;

                document.getElementById(
                    "resumeBtn"
                ).addEventListener(
                    "click",
                    function(){

                        startCountdown();

                    }
                );
            }

        },1000);
}

function startGame(){

    gamesPlayed++;

    addEvent(
        "New Game Session Started"
    );

    localStorage.setItem("gamesPlayed",gamesPlayed)

    gamesPlayedText.innerText=gamesPlayed;

    gameRunning = true;

    paused = false;

    pauseBtn.innerText = "⏸ Pause";

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

        addAchievement(
            "Hard Mode Challenger"
        );
        addEvent(
            "Hard Mode Activated"
        );
    }

    timer = 0;

    timerText.innerText = timer;

    scoreText.innerText = score;

    livesText.innerText = lives;

    gameOverModal.style.display = "none";

    resetBall();

    clearInterval(gameInterval);

    clearInterval(timerInterval);

    startCountdown();

    gameArea.style.transform = "scale(1.02)";

    setTimeout(function(){

        gameArea.style.transform = "scale(1)";

    },300);

    startBtn.disabled = true;

    document.getElementById(
        "startScreen"
    ).style.display = "none";
}

pauseBtn.addEventListener(
    "click",
    function(){

        if(paused){

            startCountdown();

        }else{

            clearInterval(gameInterval);

            clearInterval(timerInterval);

            addEvent(
                "Game Paused"
            );

            pauseBtn.innerText =
                "▶ Resume";

            pauseOverlay.style.display =
                "flex";

            paused = true;
        }
    }
);

resumeBtn.addEventListener(
    "click",
    function(){

        startCountdown();

    }
);
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

document.addEventListener(
    "touchmove",
    function(event){

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

        profileAvatar.innerText = 
            playerName.value.charAt(0).toUpperCase();
    }
);

if(savedPlayer){
    profileAvatar.innerText=savedPlayer.charAt(0).toUpperCase();
}

setTimeout(function(){

    document.getElementById(
        "loadingScreen"
    ).style.display = "none";

}, 2500);

const eventMessages =
    document.getElementById(
        "eventMessages"
    );

function addEvent(message){

    const event = 
        document.createElement("div");

    event.classList.add(

        "eventItem"

    );

    event.innerText = message;

    eventMessages.prepend(event);

    if(eventMessages.children.length > 10){

        eventMessages.removeChild(

            eventMessages.lastChild

        );
    }
}