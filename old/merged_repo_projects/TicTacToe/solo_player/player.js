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