let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let speed = 1000; // Default speed
let gameLoop = null;
let countdown = null;
let isGameRunning = false;
let isPaused = false; // Track pause state
let soundEnabled = true; // Track sound state
let timeLeft = 30; // Will be set by input on game start

// DOM Elements
const box = document.getElementById("box");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const timerDisplay = document.getElementById("timer");
const clickSound = document.getElementById("clickSound");
const difficultySelect = document.getElementById("difficulty");
const timeLimitInput = document.getElementById("timeLimit");
const gameArea = document.getElementById("gameArea"); // Added gameArea reference
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const modal = document.getElementById("gameOverModal");
const finalScoreSpan = document.getElementById("finalScore");

// Initial Setup
highScoreDisplay.textContent = highScore;
timerDisplay.textContent = timeLimitInput.value;
pauseButton.disabled = true; // Disable pause button initially

// Function to move the box randomly
function moveBox() {
    // Check if gameArea is defined and box is present
    if (!gameArea || !box) return;

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
        if (isPaused) return;

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
        // Optionally, remove the alert to be less intrusive
        // alert("New High Score: " + highScore); 
    }
}

// Function to handle game over
function endGame() {
    if (!isGameRunning) return; // Prevent double calls

    clearInterval(gameLoop);
    clearInterval(countdown);
    isGameRunning = false;
    isPaused = false;

    updateHighScore();

    // Show game over modal
    finalScoreSpan.textContent = score;
    modal.style.display = "flex";

    // Update buttons
    startButton.textContent = "Start";
    startButton.classList.remove("running");
    pauseButton.textContent = "⏸";
    pauseButton.disabled = true;
    box.style.pointerEvents = "none"; // Disable box clicks
}

// Function to start a new game session
function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    speed = parseInt(difficultySelect.value);
    
    // Time validation
    const requestedTime = parseInt(timeLimitInput.value);
    if (requestedTime < 30 || requestedTime > 600) {
        alert("Please enter a time between 30 seconds (30) and 10 minutes (600).");
        return;
    }
    timeLeft = requestedTime;
    timerDisplay.textContent = timeLeft;

    // Clear existing intervals
    clearInterval(gameLoop);
    clearInterval(countdown);

    box.style.pointerEvents = "auto"; // Ensure the box is clickable
    box.style.backgroundColor = getRandomColor(); // Set initial color

    startTimer();
    gameLoop = setInterval(moveBox, speed);
    isGameRunning = true;
    isPaused = false;

    // Update buttons
    startButton.textContent = "End";
    startButton.classList.add("running");
    pauseButton.textContent = "⏸";
    pauseButton.disabled = false;
    modal.style.display = "none"; // Hide modal
}

// Function to toggle game start/end
function toggleGame() {
    if (isGameRunning) {
        endGame();
    } else {
        startGame();
    }
}

// Function to toggle pause/resume
function togglePause() {
    if (!isGameRunning) return;

    if (isPaused) {
        // Resume
        gameLoop = setInterval(moveBox, speed);
        // Countdown interval resumes inside startTimer logic, managed by the isPaused check
        box.style.pointerEvents = "auto"; // Enable box clicks
        pauseButton.textContent = "⏸"; // Pause symbol
    } else {
        // Pause
        clearInterval(gameLoop);
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
    // This function simply ensures a clean slate and calls startGame
    clearInterval(gameLoop);
    clearInterval(countdown);
    isGameRunning = false;
    isPaused = false;

    // Reset UI before calling startGame
    timerDisplay.textContent = timeLimitInput.value;
    modal.style.display = "none";

    // Start a fresh game
    startGame();
}

// Click event for catching the box
box.addEventListener("click", function () {
    if (isPaused || !isGameRunning) return; // Prevent clicks during pause or if not running

    if (soundEnabled) {
        clickSound.currentTime = 0; // Rewind to start for quick repeated clicks
        clickSound.play().catch(e => console.log("Sound play failed:", e)); // Add catch for potential play error
    }
    score++;
    scoreDisplay.textContent = score;

    box.style.backgroundColor = getRandomColor(); // Change color only on click

    // Add catch animation (grow/flash)
    box.classList.add("catch-animate");
    setTimeout(() => {
        box.classList.remove("catch-animate");
    }, 200);

    // Gradual speed increase
    if (score % 5 === 0 && speed > 100) { // Set a reasonable minimum speed (e.g., 100ms)
        speed -= 50; // Reduce speed increment
        clearInterval(gameLoop);
        gameLoop = setInterval(moveBox, speed);
    }

    moveBox(); // Move immediately upon click
});