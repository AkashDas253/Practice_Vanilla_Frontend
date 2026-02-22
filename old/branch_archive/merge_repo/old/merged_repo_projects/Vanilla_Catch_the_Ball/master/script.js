let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let timeLeft = 30;
let speed = 1000; // Default speed
let gameLoop;
let countdown;

const box = document.getElementById("box");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const timerDisplay = document.getElementById("timer");
const clickSound = document.getElementById("clickSound");
const difficultySelect = document.getElementById("difficulty");
const timeLimitInput = document.getElementById("timeLimit");

let isPaused = false; // Track pause state
let soundEnabled = true; // Track sound state

highScoreDisplay.textContent = highScore;

// Function to move the box randomly
function moveBox() {
    let maxX = gameArea.clientWidth - box.clientWidth;
    let maxY = gameArea.clientHeight - box.clientHeight;

    let randomX = Math.floor(Math.random() * maxX);
    let randomY = Math.floor(Math.random() * maxY);

    box.style.left = `${randomX}px`;
    box.style.top = `${randomY}px`;
}

// Function to generate random colors
function getRandomColor() {
    const colors = ["red", "blue", "green", "purple", "orange"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Function to start the countdown timer
function startTimer() {
    timeLeft = parseInt(timeLimitInput.value);
    timerDisplay.textContent = timeLeft;

    countdown = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Function to update high score
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highScoreDisplay.textContent = highScore;
        alert("New High Score: " + highScore);
    }
}

// Function to handle game over
function endGame() {
    clearInterval(gameLoop);
    clearInterval(countdown);
    updateHighScore();
    alert("Game Over! Your final score is: " + score);

    // Reset game state
    isPaused = false; // Ensure pause state is reset
    const pauseButton = document.getElementById("pauseButton");
    pauseButton.textContent = "⏸"; // Reset pause button to default state

    const startButton = document.getElementById("startButton");
    startButton.textContent = "Start"; // Reset start button to default state
    startButton.classList.remove("running"); // Remove running class
}

// Function to start the game
function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    speed = parseInt(difficultySelect.value);
    timeLeft = parseInt(timeLimitInput.value);

    if (timeLeft < 30 || timeLeft > 600) {
        alert("Please enter a time between 30 seconds and 10 minutes.");
        return;
    }

    clearInterval(gameLoop);
    clearInterval(countdown);

    box.style.pointerEvents = "auto"; // Ensure the box is clickable

    startTimer();
    gameLoop = setInterval(moveBox, speed);
}

// Function to toggle game start/end
function toggleGame() {
    const startButton = document.getElementById("startButton");
    const pauseButton = document.getElementById("pauseButton");

    if (startButton.textContent === "Start") {
        startGame();
        startButton.textContent = "End";
        startButton.classList.add("running");
        pauseButton.textContent = "⏸"; // Ensure pause button is reset
    } else {
        endGame();
    }
}

// Function to toggle pause/resume
function togglePause() {
    const pauseButton = document.getElementById("pauseButton");
    if (isPaused) {
        gameLoop = setInterval(moveBox, speed);
        countdown = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
        box.style.pointerEvents = "auto"; // Enable box clicks
        pauseButton.textContent = "⏸"; // Pause symbol
    } else {
        clearInterval(gameLoop);
        clearInterval(countdown);
        box.style.pointerEvents = "none"; // Disable box clicks
        pauseButton.textContent = "▶"; // Play symbol
    }
    isPaused = !isPaused;
}

// Function to toggle sound
function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundButton = document.getElementById("toggleSoundButton");
    soundButton.textContent = soundEnabled ? "🔊" : "🔇"; // Update button symbol
}

// Function to restart the game
function restartGame() {
    clearInterval(gameLoop);
    clearInterval(countdown);

    score = 0;
    timeLeft = parseInt(timeLimitInput.value);
    speed = parseInt(difficultySelect.value);

    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;

    box.style.pointerEvents = "auto"; // Ensure the box is clickable
    box.style.backgroundColor = "red"; // Reset box color

    startTimer();
    gameLoop = setInterval(moveBox, speed);

    const startButton = document.getElementById("startButton");
    startButton.textContent = "End";
    startButton.classList.add("running");

    const pauseButton = document.getElementById("pauseButton");
    pauseButton.textContent = "⏸"; // Reset pause button
    isPaused = false; // Reset pause state
}

// Click event for catching the box
box.addEventListener("click", function () {
    if (isPaused) return; // Prevent clicks during pause
    if (soundEnabled) {
        clickSound.play(); // Play MP3 sound
    }
    score++;
    scoreDisplay.textContent = score;

    box.style.backgroundColor = getRandomColor(); // Change color only on click

    // Gradual speed increase
    if (score % 5 === 0 && speed > 500) {
        speed -= 50; // Reduce speed increment
        clearInterval(gameLoop);
        gameLoop = setInterval(moveBox, speed);
    }

    moveBox();
});
