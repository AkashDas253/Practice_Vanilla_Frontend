
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
