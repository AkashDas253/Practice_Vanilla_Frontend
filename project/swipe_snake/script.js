const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let score = 0;
let highestScore = localStorage.getItem('highestScore') ? parseInt(localStorage.getItem('highestScore')) : 0;
let gameOver = false;
let gamePaused = false;
let snake;
let direction;
let food;
let swipeStart = null;
let game;
let mode = 'classic';
let baitTimeout = 8000; // ms
let baitTimer = null;
let level = 1;
let speed = 100;

// Initialize Game
function initGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = 'RIGHT';
    placeFood();
    score = 0;
    gameOver = false;
    gamePaused = false;
    document.getElementById('restartBtn').style.display = 'none';
    document.getElementById('pauseBtn').textContent = 'Pause';
    updateScore();
    clearInterval(game);
    speed = 120 - (level - 1) * 20;
    game = setInterval(draw, speed);
    resetBaitTimer();
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
    resetBaitTimer();
}

function resetBaitTimer() {
    if (baitTimer) clearTimeout(baitTimer);
    baitTimer = setTimeout(() => {
        placeFood();
    }, baitTimeout);
}

// Wall type toggle button
document.getElementById('wallToggle').addEventListener('click', function() {
    mode = (mode === 'classic') ? 'teleport' : 'classic';
    this.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
    initGame();
});

// Level selector
document.getElementById('levelSelect').addEventListener('change', function(e) {
    level = parseInt(e.target.value);
    initGame();
});

// Bait timeout input
document.getElementById('baitTimeout').addEventListener('change', function(e) {
    let val = parseInt(e.target.value);
    baitTimeout = Math.max(2000, Math.min(val * 1000, 20000));
    resetBaitTimer();
});

// Pause the Game
document.getElementById('pauseBtn').addEventListener('click', () => {
    if (gameOver) return;
    if (gamePaused) {
        gamePaused = false;
        document.getElementById('pauseBtn').textContent = 'Pause';
        game = setInterval(draw, 100);
    } else {
        gamePaused = true;
        document.getElementById('pauseBtn').textContent = 'Resume';
        clearInterval(game);
    }
});

// Restart Game
document.getElementById('restartBtn').addEventListener('click', initGame);

// Detect Mobile vs Desktop
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    // Mobile (Touch) - Swipe Controls
    canvas.addEventListener('touchstart', touchStartHandler);
    canvas.addEventListener('touchend', touchEndHandler);
} else {
    // Desktop - Arrow Key Controls
    document.addEventListener('keydown', directionControl);
}

function directionControl(event) {
    if (gameOver || gamePaused) return;

    if (event.keyCode == 37 && direction != 'RIGHT') {
        direction = 'LEFT';
    } else if (event.keyCode == 38 && direction != 'DOWN') {
        direction = 'UP';
    } else if (event.keyCode == 39 && direction != 'LEFT') {
        direction = 'RIGHT';
    } else if (event.keyCode == 40 && direction != 'UP') {
        direction = 'DOWN';
    }
}

function touchStartHandler(event) {
    if (gameOver || gamePaused) return;
    swipeStart = event.changedTouches[0];
}

function touchEndHandler(event) {
    if (!swipeStart || gameOver || gamePaused) return;

    const swipeEnd = event.changedTouches[0];
    const dx = swipeEnd.pageX - swipeStart.pageX;
    const dy = swipeEnd.pageY - swipeStart.pageY;

    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0 && direction !== 'LEFT') direction = 'RIGHT';
        if (dx < 0 && direction !== 'RIGHT') direction = 'LEFT';
    } else {
        // Vertical swipe
        if (dy > 0 && direction !== 'UP') direction = 'DOWN';
        if (dy < 0 && direction !== 'DOWN') direction = 'UP';
    }

    swipeStart = null;
}

// Draw everything on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'lightgreen';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw Food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Snake Movement Logic
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Prepare new head position
    const newHead = {
        x: snakeX,
        y: snakeY
    };

    // Snake Eats Food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        updateScore();
        placeFood();
    } else {
        snake.pop();
    }

    // Draw the new head before collision check
    snake.unshift(newHead);

    // Wall Teleporter logic
    if (mode === 'teleport') {
        if (snakeX < 0) newHead.x = canvas.width - box;
        if (snakeX >= canvas.width) newHead.x = 0;
        if (snakeY < 0) newHead.y = canvas.height - box;
        if (snakeY >= canvas.height) newHead.y = 0;
    }

    // Now check for collision with Walls or Itself
    if (mode === 'classic' && (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height)) {
        gameOver = true;
        document.getElementById('restartBtn').style.display = 'block';
        if (score > highestScore) {
            highestScore = score;
            localStorage.setItem('highestScore', highestScore); // Save new highest score
        }
        clearInterval(game);
        setTimeout(function() {
            alert('Game Over!');
        }, 50);
        return; // Prevent further movement after game over
    }
    // Self-collision (applies to both modes)
    if (collision(newHead, snake.slice(1))) {
        gameOver = true;
        document.getElementById('restartBtn').style.display = 'block';
        if (score > highestScore) {
            highestScore = score;
            localStorage.setItem('highestScore', highestScore); // Save new highest score
        }
        clearInterval(game);
        setTimeout(function() {
            alert('Game Over!');
        }, 50);
        return;
    }
}

// Check if Snake Collides with Itself
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Update Score
function updateScore() {
    document.getElementById('score').textContent = 'Score: ' + score;
    document.getElementById('highScore').textContent = 'Highest: ' + highestScore;
}

function endGame() {
    gameOver = true;
    clearInterval(game);
    document.getElementById('restartBtn').style.display = 'block';
    document.getElementById('pauseBtn').textContent = 'Pause';
    // Play game over sound
    const gameOverSound = document.getElementById('gameOverSound');
    if (gameOverSound) gameOverSound.play();
    // Animate game over (flash canvas)
    let flashes = 0;
    let flashInterval = setInterval(() => {
        ctx.fillStyle = flashes % 2 === 0 ? 'rgba(255,0,0,0.3)' : 'rgba(255,255,255,0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        flashes++;
        if (flashes > 5) clearInterval(flashInterval);
    }, 100);
}

// Responsive canvas for mobile
window.addEventListener('resize', () => {
    let size = Math.min(window.innerWidth, window.innerHeight, 400);
    canvas.width = size;
    canvas.height = size;
});
window.dispatchEvent(new Event('resize'));

// Start the Game
initGame();
