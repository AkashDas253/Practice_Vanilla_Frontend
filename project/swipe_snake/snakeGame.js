export class SnakeGame {
    constructor(canvas, ctx, controls) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.box = 20;
        this.gridSize = this.canvas.width / this.box;

        this.highestScore = localStorage.getItem('highestScore') ? parseInt(localStorage.getItem('highestScore')) : 0;
        
        // Load persistent settings
        this.mode = localStorage.getItem('mode') || 'classic';
        this.level = parseInt(localStorage.getItem('level')) || 3;
        const storedBaitTimeout = localStorage.getItem('baitTimeout');
        this.baitTimeout = storedBaitTimeout === 'null' ? null : parseInt(storedBaitTimeout) || 8000;
        
        this.score = 0;
        this.gameOver = false;
        this.snake = [];
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT'; // For input debouncing
        this.food = null;
        this.swipeStart = null;
        this.game = null;
        this.speed = 120 - (this.level - 1) * 20; 
        this.gameStarted = false;
        this.gamePaused = false;
        this.scorePopup = null; // For score pop-up

        // UI elements
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
        this.drawInitialScreen();
    }

    // --- UI/Settings Methods ---
    initUI() {
        this.wallToggle.textContent = this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
        this.levelSelect.value = this.level.toString();
        this.baitTimeoutSelect.value = this.baitTimeout === null ? 'none' : (this.baitTimeout / 1000).toString();
        this.updateSaveButtonState(false); // Initially disabled after loading
        this.setPauseResumeState(false, false);
        this.startRestartBtn.textContent = 'Start';
        this.updateScore();
    }
    attachEvents() {
        this.wallToggle.addEventListener('click', () => {
            this.mode = (this.mode === 'classic') ? 'teleport' : 'classic';
            this.wallToggle.textContent = this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
            this.updateSaveButtonState(true);
        });
        this.levelSelect.addEventListener('change', (e) => {
            this.level = parseInt(e.target.value);
            this.updateSaveButtonState(true);
        });
        this.baitTimeoutSelect.addEventListener('change', (e) => {
            let val = e.target.value;
            this.baitTimeout = (val === 'none') ? null : parseInt(val) * 1000;
            this.updateSaveButtonState(true);
        });
        
        this.saveSettingsBtn.addEventListener('click', () => {
            if (this.game) clearInterval(this.game);
            if (this.baitTimer) clearTimeout(this.baitTimer);

            // Save settings to localStorage
            localStorage.setItem('mode', this.mode);
            localStorage.setItem('level', this.level);
            localStorage.setItem('baitTimeout', this.baitTimeout);

            this.clearBoard();
            this.snake = [];
            this.food = null;
            this.score = 0;

            this.setPauseResumeState(false, false);
            this.gameStarted = false;
            this.gameOver = false;
            this.gamePaused = false;
            this.startRestartBtn.textContent = 'Start';
            this.updateScore();
            this.updateSaveButtonState(false);
            this.drawInitialScreen();
        });
        
        this.startRestartBtn.addEventListener('click', () => {
            if (!this.gameStarted || this.gameOver) {
                this.start();
            } else {
                this.restart(); 
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
    
    // ------------------------------------------------------------------
    // MISSING METHODS ADDED (Fixes 'setPauseResumeState is not a function' and 'Wall Type Not Changing' issues)
    // ------------------------------------------------------------------
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
        this.drawOverlay('PAUSED'); // Ensure pause state is drawn immediately
    }

    resume() {
        this.gamePaused = false;
        this.setPauseResumeState(true, false);
        this.game = setInterval(() => this.draw(), this.speed);
        this.resetBaitTimer();
    }
    // ------------------------------------------------------------------

    // --- Game Logic Methods ---
    initGame() {
        this.snake = [{ x: 9 * this.box, y: 10 * this.box }];
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT'; // Reset input buffer
        this.score = 0;
        this.gameOver = false;
        this.gamePaused = false;
        this.updateScore();
        clearInterval(this.game);
        clearTimeout(this.baitTimer);

        this.speed = 120 - (this.level - 1) * 20; 
        
        this.game = setInterval(() => this.draw(), this.speed);
        this.placeFood();
    }
    placeFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.gridSize) * this.box,
                y: Math.floor(Math.random() * this.gridSize) * this.box
            };
        } while (this.collision(newFood, this.snake)); 
        this.food = newFood;
        this.resetBaitTimer();
    }
    resetBaitTimer() {
        if (this.baitTimer) clearTimeout(this.baitTimer);
        if (this.baitTimeout) {
            this.baitTimer = setTimeout(() => {
                this.placeFood(); 
            }, this.baitTimeout);
        }
    }

    // --- Input Control with Debouncing ---
    directionControl(event) {
        if (this.gameOver || this.gamePaused) return;
        let newDir = this.direction; // Use current active direction for check
        if (event.keyCode == 37 && this.direction != 'RIGHT') {
            newDir = 'LEFT';
        } else if (event.keyCode == 38 && this.direction != 'DOWN') {
            newDir = 'UP';
        } else if (event.keyCode == 39 && this.direction != 'LEFT') {
            newDir = 'RIGHT';
        } else if (event.keyCode == 40 && this.direction != 'UP') {
            newDir = 'DOWN';
        }
        this.nextDirection = newDir;
    }
    
    // FIX: Use 'this.nextDirection' when setting direction to prevent immediate 180 turn bugs
    touchStartHandler(event) {
        this.swipeStart = event.touches[0];
    }
    touchEndHandler(event) {
        if (!this.swipeStart || this.gameOver || this.gamePaused) return;
        const swipeEnd = event.changedTouches[0];
        const dx = swipeEnd.pageX - this.swipeStart.pageX;
        const dy = swipeEnd.pageY - this.swipeStart.pageY;
        
        let newDir = this.nextDirection;
        
        // Use this.direction for the 180-degree check on touch as well
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && this.direction !== 'LEFT') newDir = 'RIGHT';
            if (dx < 0 && this.direction !== 'RIGHT') newDir = 'LEFT';
        } else {
            if (dy > 0 && this.direction !== 'UP') newDir = 'DOWN';
            if (dy < 0 && this.direction !== 'DOWN') newDir = 'UP';
        }
        this.nextDirection = newDir;
        this.swipeStart = null;
    }

    // --- Drawing Methods ---
    drawGrid() {
        this.ctx.strokeStyle = '#eee'; 
        for (let x = 0; x < this.canvas.width; x += this.box) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += this.box) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    drawOverlay(text) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
    }
    drawInitialScreen() {
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Press START to begin!', this.canvas.width / 2, this.canvas.height / 2);
    }
    drawScorePopup() {
        if (!this.scorePopup) return;
        const { x, y, opacity } = this.scorePopup;
        
        this.ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('+1', x + this.box / 2, y);

        this.scorePopup.y -= 2; 
        this.scorePopup.opacity -= 0.05;

        if (this.scorePopup.opacity <= 0) {
            this.scorePopup = null;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid(); 

        // Apply debounced direction change
        this.direction = this.nextDirection;

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

        // Check for food
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.score++;
            this.updateScore();
            this.scorePopup = { x: this.food.x, y: this.food.y, opacity: 1.0 };
            this.placeFood();
            
            if (this.eatSound) {
                this.eatSound.currentTime = 0;
                this.eatSound.play();
            }
        } else {
            this.snake.pop(); // Remove tail if no food eaten
        }
        
        // Wall/Teleport Logic applied to newHead (This is where the mode logic is applied)
        if (this.mode === 'teleport') {
            if (newHead.x < 0) newHead.x = this.canvas.width - this.box;
            else if (newHead.x >= this.canvas.width) newHead.x = 0;
            else if (newHead.y < 0) newHead.y = this.canvas.height - this.box;
            else if (newHead.y >= this.canvas.height) newHead.y = 0;
        } else if (this.mode === 'classic' && (newHead.x < 0 || newHead.x >= this.canvas.width || newHead.y < 0 || newHead.y >= this.canvas.height)) {
            this.endGame();
            return;
        }
        
        this.snake.unshift(newHead); // Add new head

        // Self-collision check
        if (this.collision(newHead, this.snake.slice(1))) {
            this.endGame();
            return;
        }
        
        this.drawScorePopup(); 

        if (this.gamePaused) {
            this.drawOverlay('PAUSED');
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

        if (this.gameOverSound) {
            this.gameOverSound.currentTime = 0;
            this.gameOverSound.play();
        }

        this.drawOverlay('GAME OVER');
        
        setTimeout(() => {
            alert(`Game Over! Final Score: ${this.score}. Highest Score: ${this.highestScore}`);
            this.updateSaveButtonState(true);
            this.clearBoard();
            this.drawInitialScreen();
        }, 50);
    }
    
    resizeCanvas() {
        let size = Math.min(window.innerWidth, window.innerHeight, 400);
        this.canvas.width = size;
        this.canvas.height = size;
        this.box = size / 20;
        this.gridSize = 20; // Re-calculate grid size 
        
        if (!this.gameStarted || this.gameOver) {
            this.clearBoard();
            this.drawInitialScreen();
        }
    }
}