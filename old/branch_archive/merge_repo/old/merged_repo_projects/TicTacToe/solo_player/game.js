class Game {
    constructor() {
        this.board = [];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.boardDisabled = false;
        this.bot = null;
        this.firstPlayer = 'player';
        this.gridSize = 3;
    }

    // Initialize the game
    initializeGame() {
        this.resetGameState();

        this.gridSize = parseInt(document.getElementById('grid-size').value);
        const gameType = document.getElementById('game-type').value;
        const selectedBot = document.getElementById('bot-type').value;
        this.firstPlayer = document.getElementById('first-player').value;

        this.board = Array(this.gridSize * this.gridSize).fill('');
        this.currentPlayer = this.firstPlayer === 'player' ? 'X' : 'O';
        this.gameActive = true;
        this.boardDisabled = false;

        this.setupBoard();

        if (gameType === '1vBot') {
            this.bot = this.selectBot(selectedBot);
            if (this.firstPlayer === 'bot') {
                this.botMove();
            }
        }
    }

    // Reset game-related properties
    resetGameState() {
        this.board = [];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.boardDisabled = false;
        this.bot = null;
    }

    // Set up the game board
    setupBoard() {
        const boardDiv = document.getElementById('board');
        boardDiv.innerHTML = '';
        boardDiv.style.gridTemplateColumns = `repeat(${this.gridSize}, 100px)`;
        boardDiv.style.gridTemplateRows = `repeat(${this.gridSize}, 100px)`;

        for (let i = 0; i < this.board.length; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.onclick = () => this.makeMove(i);
            boardDiv.appendChild(cell);
        }
    }

    // Select the bot type
    selectBot(botType) {
        if (botType === 'easyBot') {
            return new RandomBot('O', this.board);
        } else if (botType === 'minimaxBot') {
            return new MinimaxBot('O', this.board);
        } else if (botType === 'alphaBetaBot') {
            return new MinimaxBot('O', this.board);
        }
        // Add other bot types if needed
        return null;
    }

    // Get the winning combinations
    getWinningCombinations(size) {
        const combinations = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            const column = [];
            for (let j = 0; j < size; j++) {
                row.push(i * size + j);
                column.push(i + j * size);
            }
            combinations.push(row, column);
        }

        const diagonal1 = [];
        const diagonal2 = [];
        for (let i = 0; i < size; i++) {
            diagonal1.push(i * size + i);
            diagonal2.push(i * size + (size - i - 1));
        }
        combinations.push(diagonal1, diagonal2);

        return combinations;
    }

    // Check if the current player wins
    checkWin() {
        const winningCombinations = this.getWinningCombinations(this.gridSize);

        for (const combination of winningCombinations) {
            if (combination.every(index => this.board[index] === this.currentPlayer)) {
                return true;
            }
        }

        return false;
    }

    // Update the cell display
    updateCell(index, symbol) {
        document.querySelector(`.cell[data-index='${index}']`).textContent = symbol;
    }

    // Update the game board and check for end conditions
    updateGame(index, symbol) {
        this.board[index] = symbol;
        this.updateCell(index, symbol);

        if (this.checkWin()) {
            this.gameActive = false;
            setTimeout(() => alert(`Player ${symbol} wins!`), 100);
            return true;
        }

        if (!this.board.includes('')) {
            this.gameActive = false;
            setTimeout(() => alert('It\'s a tie!'), 100);
            return true;
        }

        return false;
    }

    // Handle a move made by a player
    makeMove(index) {
        if (!this.boardDisabled && this.board[index] === '' && this.gameActive) {
            const gameEnded = this.updateGame(index, this.currentPlayer);

            if (gameEnded) return;

            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';

            if (this.bot && this.currentPlayer === this.bot.symbol) {
                this.boardDisabled = true;
                setTimeout(() => this.botMove(), 500);
            }
        }
    }

    // Handle a move made by the bot
    botMove() {
        const botMoveIndex = this.bot.makeMove();
        const gameEnded = this.updateGame(botMoveIndex, this.bot.symbol);

        if (!gameEnded) {
            this.boardDisabled = false;
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

const game = new Game();

function startGame() {
    document.getElementById('config').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    game.initializeGame();
}

function resetGame() {
    game.resetGameState();
    startGame();
}

function newGame() {
    document.getElementById('config').style.display = 'block';
    document.getElementById('game').style.display = 'none';
    game.resetGameState();
}

function toggleBotOptions() {
    const gameType = document.getElementById('game-type').value;
    const botOptions = document.getElementById('bot-options');
    botOptions.style.display = gameType === '1vBot' ? 'block' : 'none';
}
