export class SnakeGame {
    constructor(canvas, ctx, controls) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.box = 20;
        this.gridSize = this.canvas.width / this.box; // Calculate grid size (e.g., 20)
        this.score = 0;
        this.highestScore = localStorage.getItem('highestScore') ? parseInt(localStorage.getItem('highestScore')) : 0;
        this.gameOver = false;
        this.snake = [];
        this.direction = 'RIGHT';
        this.food = null;
        this.swipeStart = null;
        this.game = null;
        this.mode = 'classic';
        this.baitTimeout = 8000;
        this.baitTimer = null;
        this.level = 3; // Default level is often center
        this.speed = 120 - (this.level - 1) * 20; // Corrected initial speed calculation (120ms - 20ms/level)
        this.gameStarted = false;
        this.gamePaused = false;
        // UI elements from controls object
        this.wallToggle = controls.wallToggle;
        this.levelSelect = controls.levelSelect;
        this.baitTimeoutSelect = controls.baitTimeoutSelect;
        this.saveSettingsBtn = controls.saveSettingsBtn;
        this.startRestartBtn = controls.startRestartBtn;
        this.pauseResumeBtn = controls.pauseResumeBtn;
        // Sound effects
        this.eatSound = document.getElementById('eatSound');
        this.gameOverSound = document.getElementById('gameOverSound');

        this.initUI();
        this.attachEvents();
        this.clearBoard();
    }
    initUI() {
        this.wallToggle.textContent = this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
        this.levelSelect.value = this.level.toString();
        // Corrected baitTimeoutSelect: show 'none' for null timeout
        this.baitTimeoutSelect.value = this.baitTimeout === null ? 'none' : (this.baitTimeout / 1000).toString();
        this.updateSaveButtonState();
        this.setPauseResumeState(false, false);
        this.startRestartBtn.textContent = 'Start';
        this.updateScore();
    }
    attachEvents() {
        this.wallToggle.addEventListener('click', () => {
            this.mode = (this.mode === 'classic') ? 'teleport' : 'classic';
            this.wallToggle.textContent = this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
            this.updateSaveButtonState();
        });
        this.levelSelect.addEventListener('change', (e) => {
            this.level = parseInt(e.target.value);
            this.updateSaveButtonState();
        });
        this.baitTimeoutSelect.addEventListener('change', (e) => {
            let val = e.target.value;
            this.baitTimeout = (val === 'none') ? null : parseInt(val) * 1000;
            this.updateSaveButtonState();
        });
        this.saveSettingsBtn.addEventListener('click', () => {
            if (this.game) clearInterval(this.game);
            if (this.baitTimer) clearTimeout(this.baitTimer);

            this.clearBoard();
            this.snake = []; // Reset snake for clean start
            this.food = null;
            this.score = 0;

            this.setPauseResumeState(false, false);
            this.gameStarted = false;
            this.gamePaused = false;
            this.startRestartBtn.textContent = 'Start';
            this.updateScore();
            this.updateSaveButtonState(false); // Disable save button after saving
        });
        this.startRestartBtn.addEventListener('click', () => {
            if (!this.gameStarted) {
                this.start();
            } else {
                this.restart(); // Restart logic handles both game over and running game
            }
        });
        this.pauseResumeBtn.addEventListener('click', () => {
            if (!this.gameStarted || this.gameOver) return;
            if (this.gamePaused) {
                this.resume();
            } else {
                this.pause();
            }
        });
        // Input handlers
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            this.canvas.addEventListener('touchstart', (e) => this.touchStartHandler(e));
            this.canvas.addEventListener('touchend', (e) => this.touchEndHandler(e));
        } else {
            document.addEventListener('keydown', (e) => this.directionControl(e));
        }
        window.addEventListener('resize', () => this.resizeCanvas());
        window.dispatchEvent(new Event('resize'));
    }
    updateSaveButtonState(enabled = true) {
        this.saveSettingsBtn.style.opacity = enabled ? '1' : '0.5';
        this.saveSettingsBtn.style.pointerEvents = enabled ? 'auto' : 'none';
    }
    setPauseResumeState(enabled, paused) {
        this.pauseResumeBtn.disabled = !enabled;
        this.pauseResumeBtn.textContent = paused ? 'Resume' : 'Pause';
    }
    clearBoard() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    start() {
        this.initGame();
        this.gameStarted = true;
        this.setPauseResumeState(true, false);
        this.startRestartBtn.textContent = 'Restart';
        this.updateSaveButtonState(false);
    }
    restart() {
        this.initGame();
        this.setPauseResumeState(true, false);
        this.startRestartBtn.textContent = 'Restart';
        this.updateSaveButtonState(false);
    }
    pause() {
        this.gamePaused = true;
        this.setPauseResumeState(true, true);
        clearInterval(this.game);
        if (this.baitTimer) clearTimeout(this.baitTimer);
    }
    resume() {
        this.gamePaused = false;
        this.setPauseResumeState(true, false);
        this.game = setInterval(() => this.draw(), this.speed);
        this.resetBaitTimer();
    }
    initGame() {
        this.snake = [{ x: 9 * this.box, y: 10 * this.box }];
        this.direction = 'RIGHT';
        this.score = 0;
        this.gameOver = false;
        this.gamePaused = false;
        this.updateScore();
        clearInterval(this.game);
        clearTimeout(this.baitTimer);

        // Calculate speed based on level: Level 1=100ms, Level 5=40ms
        this.speed = 120 - (this.level - 1) * 20; 
        
        this.game = setInterval(() => this.draw(), this.speed);
        this.placeFood();
    }
    placeFood() {
        let newFood;
        // Corrected: use 0 to gridSize-1 for random grid index
        do {
            newFood = {
                x: Math.floor(Math.random() * this.gridSize) * this.box,
                y: Math.floor(Math.random() * this.gridSize) * this.box
            };
        } while (this.collision(newFood, this.snake)); // Ensure food doesn't spawn on the snake
        this.food = newFood;
        this.resetBaitTimer();
    }
    resetBaitTimer() {
        if (this.baitTimer) clearTimeout(this.baitTimer);
        if (this.baitTimeout) {
            this.baitTimer = setTimeout(() => {
                this.placeFood(); // Bait times out, place new food
            }, this.baitTimeout);
        }
    }
    directionControl(event) {
        if (this.gameOver || this.gamePaused) return;
        if (event.keyCode == 37 && this.direction != 'RIGHT') {
            this.direction = 'LEFT';
        } else if (event.keyCode == 38 && this.direction != 'DOWN') {
            this.direction = 'UP';
        } else if (event.keyCode == 39 && this.direction != 'LEFT') {
            this.direction = 'RIGHT';
        } else if (event.keyCode == 40 && this.direction != 'UP') {
            this.direction = 'DOWN';
        }
    }
    // touchStartHandler and touchEndHandler are fine...

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw Snake
        for (let i = 0; i < this.snake.length; i++) {
            this.ctx.fillStyle = i === 0 ? 'green' : 'lightgreen';
            this.ctx.fillRect(this.snake[i].x, this.snake[i].y, this.box, this.box);
        }
        
        // Draw Food
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.food.x, this.food.y, this.box, this.box);
        
        let snakeX = this.snake[0].x;
        let snakeY = this.snake[0].y;
        
        // Calculate new head position
        if (this.direction === 'LEFT') snakeX -= this.box;
        else if (this.direction === 'UP') snakeY -= this.box;
        else if (this.direction === 'RIGHT') snakeX += this.box;
        else if (this.direction === 'DOWN') snakeY += this.box;
        
        const newHead = { x: snakeX, y: snakeY };

        // Check for boundary collision or teleport
        if (this.mode === 'teleport') {
            if (newHead.x < 0) newHead.x = this.canvas.width - this.box;
            else if (newHead.x >= this.canvas.width) newHead.x = 0;
            else if (newHead.y < 0) newHead.y = this.canvas.height - this.box;
            else if (newHead.y >= this.canvas.height) newHead.y = 0;
        } else if (this.mode === 'classic' && (newHead.x < 0 || newHead.x >= this.canvas.width || newHead.y < 0 || newHead.y >= this.canvas.height)) {
            this.endGame();
            return;
        }

        // Food logic
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.score++;
            this.updateScore();
            this.placeFood();
            // Play eat sound
            if (this.eatSound) {
                this.eatSound.currentTime = 0;
                this.eatSound.play();
            }
        } else {
            this.snake.pop(); // Remove tail if no food eaten
        }
        
        this.snake.unshift(newHead); // Add new head

        // Self-collision check
        if (this.collision(newHead, this.snake.slice(1))) {
            this.endGame();
            return;
        }
    }
    collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x === array[i].x && head.y === array[i].y) {
                return true;
            }
        }
        return false;
    }
    updateScore() {
        document.getElementById('score').textContent = 'Score: ' + this.score;
        document.getElementById('highScore').textContent = 'Highest: ' + this.highestScore;
    }
    endGame() {
        this.gameOver = true;
        this.gameStarted = false;
        this.setPauseResumeState(false, false);
        this.startRestartBtn.textContent = 'Start';
        if (this.score > this.highestScore) {
            this.highestScore = this.score;
            localStorage.setItem('highestScore', this.highestScore);
            this.updateScore();
        }
        clearInterval(this.game);
        clearTimeout(this.baitTimer);

        // Play game over sound
        if (this.gameOverSound) {
            this.gameOverSound.currentTime = 0;
            this.gameOverSound.play();
        }

        setTimeout(() => {
            alert('Game Over! Your score: ' + this.score);
            this.clearBoard();
            this.updateSaveButtonState(true);
        }, 50);
    }
    resizeCanvas() {
        // Adjust canvas size to maintain square aspect ratio and fit screen
        let size = Math.min(window.innerWidth, window.innerHeight, 400);
        this.canvas.width = size;
        this.canvas.height = size;
        this.box = size / 20; // Recalculate box size to maintain 20x20 grid
        this.gridSize = 20; // Keep the conceptual grid size at 20

        // If game is not running, redraw a clear board
        if (!this.gameStarted || this.gameOver) {
            this.clearBoard();
        }
    }
}