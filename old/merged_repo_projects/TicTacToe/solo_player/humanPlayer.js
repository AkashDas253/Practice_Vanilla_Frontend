class HumanPlayer extends Player {
    makeMove(index) {
        if (this.gameBoard[index] === '') {
            return index;
        }
        return -1;
    }
}
