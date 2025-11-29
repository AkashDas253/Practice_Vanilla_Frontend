class Player {
    constructor(symbol, gameBoard) {
        this.symbol = symbol;
        this.gameBoard = gameBoard;
    }

    makeMove() {
        // This method is intentionally left blank
    }

    updateBoard(index, symbol) {
        this.gameBoard[index] = symbol;
    }
}

class HumanPlayer extends Player {
    makeMove(index) {
        if (this.gameBoard[index] === '') {
            return index;
        }
        return -1;
    }
}

class RandomBot extends Player {
    makeMove() {
        const emptyPositions = this.gameBoard.reduce((acc, val, idx) => val === '' ? acc.concat(idx) : acc, []);
        if (emptyPositions.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyPositions.length);
            return emptyPositions[randomIndex];
        }
        return -1;
    }
}


class MinimaxBot extends Player {
    constructor(symbol, gameBoard, maxDepth = -1) {
        super(symbol, gameBoard);
        this.maxDepth = maxDepth;
        this.nodesMap = new Map();
    }

    makeMove(callback = () => {}) {
        const bestMove = this.getBestMove(this.gameBoard, true, callback);
        return bestMove;
    }

    getBestMove(board, maximizing = true, callback = () => {}, depth = 0) {
        if (depth === 0) this.nodesMap.clear();

        if (!board.isTerminal) {
            throw new Error('Board does not have an isTerminal method');
        }

        const isTerminal = board.isTerminal();
        if (isTerminal || depth === this.maxDepth) {
            if (isTerminal.winner === "x") return 100 - depth;
            if (isTerminal.winner === "o") return -100 + depth;
            return 0;
        }

        let best = maximizing ? -100 : 100;
        const symbol = maximizing ? "x" : "o";

        board.getAvailableMoves().forEach(index => {
            const child = new Board([...board.state]);
            child.insert(symbol, index);

            const nodeValue = this.getBestMove(child, !maximizing, callback, depth + 1);
            best = maximizing ? Math.max(best, nodeValue) : Math.min(best, nodeValue);

            if (depth === 0) {
                const moves = this.nodesMap.has(best) ? `${this.nodesMap.get(best)},${index}` : index;
                this.nodesMap.set(best, moves);
            }
        });

        if (depth === 0) {
            const moves = this.nodesMap.get(best);
            const returnValue = typeof moves === "string"
                ? moves.split(",")[Math.floor(Math.random() * moves.split(",").length)]
                : moves;
            callback(returnValue);
            return returnValue;
        }

        return best;
    }
}