// ====================================================================
// 1. GAME CONFIGURATION
// Use this object to easily tune the game parameters
// ====================================================================
const GAME_CONFIG = {
    DEFAULT_TIME: 30, // seconds
    MIN_TIME: 30,
    MAX_TIME: 600,
    MIN_SPEED_MS: 100, // Absolute fastest interval (ms)
    DIFFICULTY_CONSTANT_K: 0.005, // Controls exponential speed steepness (lower is steeper)
    COLORS: ["red", "blue", "green", "purple", "orange"]
};

// ====================================================================
// GLOBAL STATE & INITIAL SETUP
// ====================================================================
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let speed = 1000; // Will hold the current interval speed
let gameLoop = null;
let countdown = null;
let isGameRunning = false;
let isPaused = false;
let soundEnabled = true;
let timeLeft = GAME_CONFIG.DEFAULT_TIME;
let BASE_SPEED = 1000; // Stores the initial speed chosen from difficulty select

// DOM Elements
const box = document.getElementById("box");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const timerDisplay = document.getElementById("timer");
const clickSound = document.getElementById("clickSound");
const difficultySelect = document.getElementById("difficulty");
const timeLimitInput = document.getElementById("timeLimit");
const gameArea = document.getElementById("gameArea"); 
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const modal = document.getElementById("gameOverModal");
const finalScoreSpan = document.getElementById("finalScore");

// Initial Setup
highScoreDisplay.textContent = highScore;
timerDisplay.textContent = timeLimitInput.value;
pauseButton.disabled = true; 


// ====================================================================
// CORE GAME FUNCTIONS
// ====================================================================

function moveBox() {
    if (!gameArea || !box) return;

    let maxX = gameArea.clientWidth - box.clientWidth;
    let maxY = gameArea.clientHeight - box.clientHeight;

    let randomX = Math.floor(Math.random() * maxX);
    let randomY = Math.floor(Math.random() * maxY);

    box.style.left = `${randomX}px`;
    box.style.top = `${randomY}px`;
}

function getRandomColor() {
    return GAME_CONFIG.COLORS[Math.floor(Math.random() * GAME_CONFIG.COLORS.length)];
}

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

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highScoreDisplay.textContent = highScore;
    }
}

function endGame() {
    if (!isGameRunning) return;

    clearInterval(gameLoop);
    clearInterval(countdown);
    isGameRunning = false;
    isPaused = false;

    updateHighScore();

    finalScoreSpan.textContent = score;
    modal.style.display = "flex";

    startButton.textContent = "Start";
    startButton.classList.remove("running");
    pauseButton.textContent = "⏸";
    pauseButton.disabled = true;
    box.style.pointerEvents = "none";
}

function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    
    // Set BASE_SPEED from selected difficulty
    BASE_SPEED = parseInt(difficultySelect.value);
    speed = BASE_SPEED; 
    
    // Time validation
    const requestedTime = parseInt(timeLimitInput.value);
    if (requestedTime < GAME_CONFIG.MIN_TIME || requestedTime > GAME_CONFIG.MAX_TIME) {
        alert(`Please enter a time between ${GAME_CONFIG.MIN_TIME} and ${GAME_CONFIG.MAX_TIME} seconds.`);
        return;
    }
    timeLeft = requestedTime;
    timerDisplay.textContent = timeLeft;

    clearInterval(gameLoop);
    clearInterval(countdown);

    box.style.pointerEvents = "auto";
    box.style.backgroundColor = getRandomColor();

    startTimer();
    gameLoop = setInterval(moveBox, speed);
    isGameRunning = true;
    isPaused = false;

    // Update buttons and hide modal
    startButton.textContent = "End";
    startButton.classList.add("running");
    pauseButton.textContent = "⏸";
    pauseButton.disabled = false;
    modal.style.display = "none";
}

function toggleGame() {
    if (isGameRunning) {
        endGame();
    } else {
        startGame();
    }
}

function togglePause() {
    if (!isGameRunning) return;

    if (isPaused) {
        // Resume
        gameLoop = setInterval(moveBox, speed);
        box.style.pointerEvents = "auto";
        pauseButton.textContent = "⏸"; 
    } else {
        // Pause
        clearInterval(gameLoop);
        box.style.pointerEvents = "none";
        pauseButton.textContent = "▶";
    }
    isPaused = !isPaused;
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundButton = document.getElementById("toggleSoundButton");
    soundButton.textContent = soundEnabled ? "🔊" : "🔇";
}

function restartGame() {
    clearInterval(gameLoop);
    clearInterval(countdown);
    isGameRunning = false;
    isPaused = false;

    timerDisplay.textContent = timeLimitInput.value;
    modal.style.display = "none";

    startGame();
}


// ====================================================================
// EVENT LISTENERS (Including New Features)
// ====================================================================

// 📦 Box Catch Event
box.addEventListener("click", function () {
    if (isPaused || !isGameRunning) return;

    if (soundEnabled) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log("Sound play failed:", e));
    }
    score++;
    scoreDisplay.textContent = score;

    box.style.backgroundColor = getRandomColor();

    // Catch animation
    box.classList.add("catch-animate");
    setTimeout(() => {
        box.classList.remove("catch-animate");
    }, 200);

    // 🚀 1. Exponential Speed Scaling (Advanced Difficulty)
    if (score > 0) {
        // Calculate speed based on score and initial difficulty (BASE_SPEED)
        let newSpeed = BASE_SPEED * Math.exp(-GAME_CONFIG.DIFFICULTY_CONSTANT_K * score);
        
        // Apply minimum speed limit
        let calculatedSpeed = Math.max(newSpeed, GAME_CONFIG.MIN_SPEED_MS); 

        // Check if speed has changed enough to warrant resetting the interval
        if (Math.abs(calculatedSpeed - speed) > 5) { // Use a tolerance (e.g., 5ms)
            speed = calculatedSpeed;
            clearInterval(gameLoop);
            gameLoop = setInterval(moveBox, speed); 
        }
    }

    moveBox(); // Move immediately upon click
});


// 🟥 2. Miss Feedback (Clicking the Game Area)
gameArea.addEventListener("click", function(event) {
    // Only react if the game is running, not paused, and the target is the gameArea itself
    if (event.target.id === 'gameArea' && isGameRunning && !isPaused) {
        gameArea.classList.add("miss-flash");
        
        setTimeout(() => {
            gameArea.classList.remove("miss-flash");
        }, 150);
        
        // Optional: Implement score/time penalty here if desired
    }
});


// ⌨️ 3. Keyboard Controls (Spacebar Pause/Resume)
document.addEventListener("keydown", function(event) {
    if (isGameRunning && event.code === 'Space') {
        event.preventDefault(); // Prevents page scrolling
        togglePause();
    }
});