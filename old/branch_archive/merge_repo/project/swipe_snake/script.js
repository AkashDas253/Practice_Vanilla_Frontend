class SnakeGame {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.box = 20;
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
        this.level = 1;
        this.speed = 100;
        this.gameStarted = false;
        this.gamePaused = false;
        // UI elements
        this.wallToggle = document.getElementById('wallToggle');
        this.levelSelect = document.getElementById('levelSelect');
        this.baitTimeoutSelect = document.getElementById('baitTimeout');
        this.saveSettingsBtn = document.getElementById('saveSettingsBtn');
        this.startRestartBtn = document.getElementById('startRestartBtn');
        this.pauseResumeBtn = document.getElementById('pauseResumeBtn');
        this.initUI();
        this.attachEvents();
        this.clearBoard();
    }
    initUI() {
        this.wallToggle.textContent = this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
        this.levelSelect.value = this.level.toString();
        this.baitTimeoutSelect.value = this.baitTimeout ? (this.baitTimeout/1000).toString() : '8';
        this.updateSaveButtonState();
        this.setPauseResumeState(false, false);
        this.startRestartBtn.textContent = 'Start';
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
            if (val === 'none') {
                this.baitTimeout = null;
            } else {
                this.baitTimeout = parseInt(val) * 1000;
            }
            this.updateSaveButtonState();
        });
        this.saveSettingsBtn.addEventListener('click', () => {
            this.clearBoard();
            this.setPauseResumeState(false, false);
            this.gameStarted = false;
            this.gamePaused = false;
            this.startRestartBtn.textContent = 'Start';
            this.updateScore();
            this.updateSaveButtonState();
        });
        this.startRestartBtn.addEventListener('click', () => {
            if (!this.gameStarted) {
                this.start();
            } else if (!this.gameOver) {
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
    updateSaveButtonState() {
        this.saveSettingsBtn.style.opacity = '1';
        this.saveSettingsBtn.style.pointerEvents = 'auto';
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
    }
    restart() {
        this.initGame();
        this.setPauseResumeState(true, false);
    }
    pause() {
        this.gamePaused = true;
        this.setPauseResumeState(true, true);
        clearInterval(this.game);
    }
    resume() {
        this.gamePaused = false;
        this.setPauseResumeState(true, false);
        this.game = setInterval(() => this.draw(), this.speed);
    }
    initGame() {
        this.snake = [{ x: 9 * this.box, y: 10 * this.box }];
        this.direction = 'RIGHT';
        this.placeFood();
        this.score = 0;
        this.gameOver = false;
        this.gamePaused = false;
        this.updateScore();
        clearInterval(this.game);
        this.speed = 120 - (this.level - 1) * 20;
        this.game = setInterval(() => this.draw(), this.speed);
        this.resetBaitTimer();
    }
    placeFood() {
        this.food = {
            x: Math.floor(Math.random() * 19 + 1) * this.box,
            y: Math.floor(Math.random() * 19 + 1) * this.box
        };
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
    touchStartHandler(event) {
        if (this.gameOver || this.gamePaused) return;
        this.swipeStart = event.changedTouches[0];
    }
    touchEndHandler(event) {
        if (!this.swipeStart || this.gameOver || this.gamePaused) return;
        const swipeEnd = event.changedTouches[0];
        const dx = swipeEnd.pageX - this.swipeStart.pageX;
        const dy = swipeEnd.pageY - this.swipeStart.pageY;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && this.direction !== 'LEFT') this.direction = 'RIGHT';
            if (dx < 0 && this.direction !== 'RIGHT') this.direction = 'LEFT';
        } else {
            if (dy > 0 && this.direction !== 'UP') this.direction = 'DOWN';
            if (dy < 0 && this.direction !== 'DOWN') this.direction = 'UP';
        }
        this.swipeStart = null;
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.snake.length; i++) {
            this.ctx.fillStyle = i === 0 ? 'green' : 'lightgreen';
            this.ctx.fillRect(this.snake[i].x, this.snake[i].y, this.box, this.box);
        }
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.food.x, this.food.y, this.box, this.box);
        let snakeX = this.snake[0].x;
        let snakeY = this.snake[0].y;
        if (this.direction === 'LEFT') snakeX -= this.box;
        if (this.direction === 'UP') snakeY -= this.box;
        if (this.direction === 'RIGHT') snakeX += this.box;
        if (this.direction === 'DOWN') snakeY += this.box;
        const newHead = { x: snakeX, y: snakeY };
        if (snakeX === this.food.x && snakeY === this.food.y) {
            this.score++;
            this.updateScore();
            this.placeFood();
        } else {
            this.snake.pop();
        }
        this.snake.unshift(newHead);
        if (this.mode === 'teleport') {
            if (snakeX < 0) newHead.x = this.canvas.width - this.box;
            if (snakeX >= this.canvas.width) newHead.x = 0;
            if (snakeY < 0) newHead.y = this.canvas.height - this.box;
            if (snakeY >= this.canvas.height) newHead.y = 0;
        }
        if (this.mode === 'classic' && (snakeX < 0 || snakeX >= this.canvas.width || snakeY < 0 || snakeY >= this.canvas.height)) {
            this.endGame();
            return;
        }
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
        }
        clearInterval(this.game);
        setTimeout(() => {
            alert('Game Over!');
        }, 50);
    }
    resizeCanvas() {
        let size = Math.min(window.innerWidth, window.innerHeight, 400);
        this.canvas.width = size;
        this.canvas.height = size;
    }
}

// Initialize the game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const snakeGame = new SnakeGame(canvas, ctx);

