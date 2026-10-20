const BOARD_SIZE = 15;
let curr = 'white';
let board = [];
let history = [];
let gameOver = false;


function initGame() {
    const be = document.getElementById('board');
    be.innerHTML = '';
    board = [];
    history = [];
    curr = 'white';
    gameOver = false;
    document.getElementById('winMessage').style.display = 'none';

    for (let row = 0; row < BOARD_SIZE; row++) {
        const re = document.createElement('div');
        re.className = 'row';
        board[row] = [];

        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', cellClick);
            re.appendChild(cell);
            board[row][col] = null;
        }

        be.appendChild(re);
    }

    display();
}

function cellClick(event) {
    if (gameOver) return;

    const cell = event.target.closest('.cell');
    if (!cell || cell.classList.contains('taken')) return;

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    placeStone(row, col, cell);
}

function placeStone(row, col, cell) {
    board[row][col] = curr;
    history.push({ row, col, player: curr });

    const stone = document.createElement('div');
    stone.className = `stone ${curr}`;
    cell.appendChild(stone);
    cell.classList.add('taken');

    if (checkWinner(row, col)) {
        displayWinner(curr);
        gameOver = true;
        return;
    }

    if (history.length === BOARD_SIZE * BOARD_SIZE) {
        displayWinner('draw');
        gameOver = true;
        return;
    }


    curr = (curr === 'black' ? 'white' : 'black');
    display();
}

function checkWinner(row, col) {
    //{x,y}
    const dir = [
        [0, 1], [0, -1],
        [1, 0], [-1, 0], 
        [1, 1], [-1, -1], 
        [1, -1], [-1, 1]
    ];


    for (let [dx, dy] of dir) {
        let newRow = row + dx;
        let newCol = col + dy;
        let cnt=1;
        while (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && board[newRow][newCol] === curr) {
            cnt++;
            newRow += dx;
            newCol += dy;
            if (cnt >= 5) return true;
        }
    }

    return false;
}

function display() {
    const turn = document.getElementById('playerTurn');
    const player = document.getElementById('player');
    
    turn.textContent = curr.charAt(0).toUpperCase() + curr.slice(1);
    player.className = `whichPlayer ${curr}`;
}

function displayWinner(winner) {
    const message = document.getElementById('winMessage');
    if (winner === 'draw') {
        message.textContent = "It's a Draw!";
        message.style.color = '#ff9800';
    } else {
        message.textContent = `Yeyyyyyy!!!!! ${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!`;
        message.style.color = winner === 'black' ? '#000' : '#666';
    }
    message.style.display = 'block';
}

function resetGame() {
    initGame();
}

function undoMove() {
    if (history.length === 0 || gameOver) return;

    const lastMove = history.pop();
    const cell = document.querySelector(`[data-row="${lastMove.row}"][data-col="${lastMove.col}"]`);
    
    cell.innerHTML = '';
    cell.classList.remove('taken');
    board[lastMove.row][lastMove.col] = null;

    curr = lastMove.player;
    display();
}
initGame();