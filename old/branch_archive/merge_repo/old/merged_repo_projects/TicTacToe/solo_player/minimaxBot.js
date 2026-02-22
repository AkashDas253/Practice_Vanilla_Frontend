class MinimaxBot extends Player {
    constructor(symbol, gameBoard) {
        super(symbol, gameBoard);
        this.opponentSymbol = symbol === 'X' ? 'O' : 'X';
        this.boardSize = Math.sqrt(gameBoard.length);
    }

    makeMove() {
        let bestMove = this.findBestMove();
        this.updateBoard(bestMove, this.symbol);
        return bestMove;
    }

    findBestMove() {
        let bestVal = -Infinity;
        let bestMove = -1;

        for (let i = 0; i < this.gameBoard.length; i++) {
            if (this.gameBoard[i] === '') {
                this.gameBoard[i] = this.symbol;
                let moveVal = this.minimax(this.gameBoard, 0, false);
                this.gameBoard[i] = '';
                
                if (moveVal > bestVal) {
                    bestMove = i;
                    bestVal = moveVal;
                }
            }
        }
        return bestMove;
    }

    minimax(board, depth, isMaximizing) {
        let score = this.evaluate(board);

        if (score !== 0 || this.isFull(board)) {
            return score;
        }

        if (isMaximizing) {
            let best = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = this.symbol;
                    best = Math.max(best, this.minimax(board, depth + 1, false));
                    board[i] = '';
                }
            }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = this.opponentSymbol;
                    best = Math.min(best, this.minimax(board, depth + 1, true));
                    board[i] = '';
                }
            }
            return best;
        }
    }

    evaluate(board) {
        if (this.boardSize === 3) {
            return this.evaluate3x3(board);
        } else if (this.boardSize === 5) {
            return this.evaluate5x5(board);
        }
        return 0; // Default for unsupported board sizes
    }

    evaluate3x3(board) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (let pattern of winPatterns) {
            let firstSymbol = board[pattern[0]];
            if (firstSymbol === '') continue;
            let won = pattern.every(index => board[index] === firstSymbol);
            if (won) {
                if (firstSymbol === this.symbol) return 10;
                else if (firstSymbol === this.opponentSymbol) return -10;
            }
        }
        return 0;
    }

    evaluate5x5(board) {
        const winPatterns = [
            // Rows
            [0, 1, 2, 3], [1, 2, 3, 4], [5, 6, 7, 8], [6, 7, 8, 9],
            [10, 11, 12, 13], [11, 12, 13, 14], [15, 16, 17, 18], [16, 17, 18, 19],
            [20, 21, 22, 23], [21, 22, 23, 24],

            // Columns
            [0, 5, 10, 15], [1, 6, 11, 16], [2, 7, 12, 17], [3, 8, 13, 18],
            [4, 9, 14, 19], [5, 10, 15, 20], [6, 11, 16, 21], [7, 12, 17, 22],
            [8, 13, 18, 23], [9, 14, 19, 24],

            // Diagonals
            [0, 6, 12, 18], [1, 7, 13, 19], [5, 11, 17, 23], [6, 12, 18, 24],
            [3, 7, 11, 15], [4, 8, 12, 16], [8, 12, 16, 20], [9, 13, 17, 21]
        ];

        for (let pattern of winPatterns) {
            let firstSymbol = board[pattern[0]];
            if (firstSymbol === '') continue;
            let won = pattern.every(index => board[index] === firstSymbol);
            if (won) {
                if (firstSymbol === this.symbol) return 10;
                else if (firstSymbol === this.opponentSymbol) return -10;
            }
        }
        return 0;
    }

    isFull(board) {
        return board.every(cell => cell !== '');
    }
}
