class EasyBot {
    constructor(board, playerSymbol, botSymbol, initialPlayer) {
        this.board = board;
        this.playerSymbol = playerSymbol;
        this.botSymbol = botSymbol;
        this.currentPlayer = initialPlayer;
    }

    playerMove(playerMove) {
        this.board[playerMove] = this.playerSymbol;
        this.currentPlayer = this.botSymbol; // Switch to bot's turn
    }

    makeMove() {
        let availableMoves = this.board.map((val, index) => val === '' ? index : null).filter(val => val !== null);
        let move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        this.board[move] = this.botSymbol;
        this.currentPlayer = this.playerSymbol; // Switch back to player's turn
        return move;
    }
}
