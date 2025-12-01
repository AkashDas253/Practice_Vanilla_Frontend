export class SnakeGame {
    constructor(canvas, ctx, controls) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.box = 20;
        this.gridSize = this.canvas.width / this.box;

        this.highestScore = localStorage.getItem('highestScore') ? parseInt(localStorage.getItem('highestScore')) : 0;
        
        // --- Load persistent settings ---
        this.mode = localStorage.getItem('mode') || 'classic';
        this.level = parseInt(localStorage.getItem('level')) || 3;
        this.obstaclesEnabled = localStorage.getItem('obstaclesEnabled') === 'false' ? false : true; // Default to true (On)
        
        const storedBaitTimeout = localStorage.getItem('baitTimeout');
        this.baitTimeout = storedBaitTimeout === 'null' ? null : parseInt(storedBaitTimeout) || 8000;
        
        this.score = 0;
        this.gameOver = false;
        this.snake = [];
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
        this.food = null;
        this.swipeStart = null;
        this.game = null;
        this.speed = 120 - (this.level - 1) * 20; 
        this.gameStarted = false;
        this.gamePaused = false;
        this.scorePopup = null; 
        this.obstacles = [];

        // UI elements
        this.wallToggle = controls.wallToggle;
        this.levelSelect = controls.levelSelect;
        this.obstacleSelect = controls.obstacleSelect; // NEW
        this.baitTimeoutSelect = controls.baitTimeoutSelect;
        this.saveSettingsBtn = controls.saveSettingsBtn;
        this.startRestartBtn = controls.startRestartBtn;
        this.pauseResumeBtn = controls.pauseResumeBtn;
        
        this.eatSound = document.getElementById('eatSound');
        this.gameOverSound = document.getElementById('gameOverSound');

        this.initUI();
        this.attachEvents();
        this.clearBoard();
        this.drawInitialScreen();
    }

    initUI() {
        this.wallToggle.textContent = this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
        this.levelSelect.value = this.level.toString();
        this.obstacleSelect.value = this.obstaclesEnabled ? 'on' : 'off'; // Set UI based on saved val
        this.baitTimeoutSelect.value = this.baitTimeout === null ? 'none' : (this.baitTimeout / 1000).toString();
        
        this.updateSaveButtonState(false);
        this.setPauseResumeState(false, false);
        this.startRestartBtn.textContent = 'Start';
        this.updateScore();
    }

    attachEvents() {
        // --- Settings Change Listeners ---
        const enableSave = () => this.updateSaveButtonState(true);

        this.wallToggle.addEventListener('click', () => {
            this.mode = (this.mode === 'classic') ? 'teleport' : 'classic';
            this.wallToggle.textContent = this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
            enableSave();
        });
        
        this.levelSelect.addEventListener('change', (e) => {
            this.level = parseInt(e.target.value);
            enableSave();
        });

        // NEW: Obstacle Listener
        this.obstacleSelect.addEventListener('change', (e) => {
            this.obstaclesEnabled = (e.target.value === 'on');
            enableSave();
        });

        this.baitTimeoutSelect.addEventListener('change', (e) => {
            let val = e.target.value;
            this.baitTimeout = (val === 'none') ? null : parseInt(val) * 1000;
            enableSave();
        });
        
        // --- Save Button Logic ---
        this.saveSettingsBtn.addEventListener('click', () => {
            if (this.game) clearInterval(this.game);
            if (this.baitTimer) clearTimeout(this.baitTimer);

            // Save to localStorage
            localStorage.setItem('mode', this.mode);
            localStorage.setItem('level', this.level);
            localStorage.setItem('obstaclesEnabled', this.obstaclesEnabled); // Save obstacle pref
            localStorage.setItem('baitTimeout', this.baitTimeout);

            // Reset Game State completely
            this.clearBoard();
            this.snake = [];
            this.food = null;
            this.score = 0;
            this.obstacles = []; 

            this.setPauseResumeState(false, false);
            this.gameStarted = false;
            this.gameOver = false;
            this.gamePaused = false;
            this.startRestartBtn.textContent = 'Start';
            this.updateScore();
            this.updateSaveButtonState(false);
            this.drawInitialScreen();
        });
        
        // Game Controls
        this.startRestartBtn.addEventListener('click', () => {
            if (!this.gameStarted || this.gameOver) this.start();
            else this.restart(); 
        });
        this.pauseResumeBtn.addEventListener('click', () => {
            if (!this.gameStarted || this.gameOver) return;
            if (this.gamePaused) this.resume();
            else this.pause();
        });
        
        // Touch/Key Listeners
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            this.canvas.addEventListener('touchstart', (e) => this.touchStartHandler(e), { passive: false });
            this.canvas.addEventListener('touchend', (e) => this.touchEndHandler(e), { passive: false });
            this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
        } else {
            document.addEventListener('keydown', (e) => this.directionControl(e));
        }
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    updateSaveButtonState(enabled = true) {
        this.saveSettingsBtn.style.opacity = enabled ? '1' : '0.5';
        this.saveSettingsBtn.style.pointerEvents = enabled ? 'auto' : 'none';
        if(enabled) this.saveSettingsBtn.textContent = "Save*";
        else this.saveSettingsBtn.textContent = "Save";
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
        this.drawOverlay('PAUSED');
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
        this.nextDirection = 'RIGHT'; 
        this.score = 0;
        this.gameOver = false;
        this.gamePaused = false;
        this.obstacles = []; // Clear obstacles
        this.updateScore();
        clearInterval(this.game);
        clearTimeout(this.baitTimer);

        // Recalculate speed based on Level setting
        this.speed = 120 - (this.level - 1) * 20; 
        
        this.game = setInterval(() => this.draw(), this.speed);
        this.placeFood();
    }
    
    generateObstacles() {
        // CHECK SETTING: If obstacles are disabled, do nothing
        if (!this.obstaclesEnabled) return; 

        this.obstacles = []; 
        const numObstacles = Math.floor(this.score / 10) * 5; 
        
        for (let i = 0; i < numObstacles; i++) {
            let newObstacle;
            let attempts = 0;
            do {
                newObstacle = {
                    x: Math.floor(Math.random() * this.gridSize) * this.box,
                    y: Math.floor(Math.random() * this.gridSize) * this.box
                };
                attempts++;
                if(attempts > 50) break;
            } while (this.collision(newObstacle, this.snake) || this.collision(newObstacle, [this.food]) || this.collision(newObstacle, this.obstacles));
            
            this.obstacles.push(newObstacle);
        }
    }
    
    placeFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.gridSize) * this.box,
                y: Math.floor(Math.random() * this.gridSize) * this.box
            };
        } while (this.collision(newFood, this.snake) || this.collision(newFood, this.obstacles)); 
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

    directionControl(event) {
        if (this.gameOver || this.gamePaused) return;
        let newDir = this.direction;
        if (event.keyCode == 37 && this.direction != 'RIGHT') newDir = 'LEFT';
        else if (event.keyCode == 38 && this.direction != 'DOWN') newDir = 'UP';
        else if (event.keyCode == 39 && this.direction != 'LEFT') newDir = 'RIGHT';
        else if (event.keyCode == 40 && this.direction != 'UP') newDir = 'DOWN';
        this.nextDirection = newDir;
    }
    
    touchStartHandler(event) {
        event.preventDefault();
        this.swipeStart = event.touches[0];
    }

    touchEndHandler(event) {
        event.preventDefault();
        if (!this.swipeStart || this.gameOver || this.gamePaused) return;
        const swipeEnd = event.changedTouches[0];
        const dx = swipeEnd.pageX - this.swipeStart.pageX;
        const dy = swipeEnd.pageY - this.swipeStart.pageY;
        
        let newDir = this.nextDirection;
        if(Math.abs(dx) < 10 && Math.abs(dy) < 10) return; // Tap threshold

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

    drawGrid() {
        this.ctx.strokeStyle = '#ccc'; 
        this.ctx.lineWidth = 0.5;
        for (let x = 0; x <= this.canvas.width; x += this.box) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + 0.5, 0); 
            this.ctx.lineTo(x + 0.5, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.canvas.height; y += this.box) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y + 0.5);
            this.ctx.lineTo(this.canvas.width, y + 0.5);
            this.ctx.stroke();
        }
        this.ctx.lineWidth = 1; 
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
        if (this.scorePopup.opacity <= 0) this.scorePopup = null;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid(); 

        this.direction = this.nextDirection;
        
        // Draw Obstacles (Only if array has items)
        if (this.obstaclesEnabled) {
             this.ctx.fillStyle = '#2c3e50'; 
             for (let i = 0; i < this.obstacles.length; i++) {
                 this.ctx.fillRect(this.obstacles[i].x, this.obstacles[i].y, this.box, this.box);
                 this.ctx.strokeStyle = '#fff';
                 this.ctx.strokeRect(this.obstacles[i].x, this.obstacles[i].y, this.box, this.box);
             }
        }

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
            
            // Check Setting AND Score to generate obstacles
            if (this.obstaclesEnabled && this.score % 10 === 0) {
                this.generateObstacles();
            }
            this.placeFood();
            
            if (this.eatSound) {
                this.eatSound.currentTime = 0;
                this.eatSound.play();
            }
        } else {
            this.snake.pop(); 
        }
        
        // Wall/Teleport Logic
        if (this.mode === 'teleport') {
            if (newHead.x < 0) newHead.x = this.canvas.width - this.box;
            else if (newHead.x >= this.canvas.width) newHead.x = 0;
            else if (newHead.y < 0) newHead.y = this.canvas.height - this.box;
            else if (newHead.y >= this.canvas.height) newHead.y = 0;
        } else if (this.mode === 'classic' && (newHead.x < 0 || newHead.x >= this.canvas.width || newHead.y < 0 || newHead.y >= this.canvas.height)) {
            this.endGame();
            return;
        }
        
        this.snake.unshift(newHead);

        // Self-collision
        if (this.collision(newHead, this.snake.slice(1))) {
            this.endGame();
            return;
        }
        
        // Obstacle collision (Only check if enabled)
        if (this.obstaclesEnabled && this.collision(newHead, this.obstacles)) {
            this.endGame();
            return;
        }
        
        this.drawScorePopup(); 

        if (this.gamePaused) {
            this.drawOverlay('PAUSED');
        }
    }
    
    collision(head, array) {
        if (!array) return false;
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
        this.gridSize = this.canvas.width / this.box; 
        
        if (!this.gameStarted || this.gameOver) {
            this.clearBoard();
            this.drawInitialScreen();
        }
    }
}