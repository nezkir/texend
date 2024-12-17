var playerred = "R";
var playeryellow = "Y";
var curr = playerred;
var gameOver = false;
var curcoloums;
var board;
var rows = 6;
var columns = 7;
const turn = document.getElementById("turn");
var moves = document.getElementById("moves");
var move = 0;

window.onload = function () {
    game();
};

function game() {
    board = [];
    curcoloums = [5, 5, 5, 5, 5, 5, 5]; // Initialize the row pointers for each column
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push('');
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
}

function setPiece() {
    if (gameOver) {
        reset(); // Reset the game when clicked after game over
        return;
    }

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    r = curcoloums[c];
    
    if (r < 0) {
        return;
    }

    board[r][c] = curr;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    
    if (curr == playerred) {
        tile.classList.add("red-piece");
        turn.textContent = 'Reds Turn';
        curr = playeryellow;
    } else {
        tile.classList.add("yellow-piece");
        turn.textContent = 'Yellows Turn';
        curr = playerred;
    }
    moves.textContent = "Move = " + move++;
    r -= 1;
    curcoloums[c] = r;
    checkwinner();
}

function checkwinner() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != '') {
                if (board[r][c] == board[r][c + 1] && board[r][c + 1] == board[r][c + 2] && board[r][c + 2] == board[r][c + 3]) {
                    setwinner(r, c);
                    return;
                }
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] != '') {
                if (board[r][c] == board[r + 1][c] && board[r + 1][c] == board[r + 2][c] && board[r + 2][c] == board[r + 3][c]) {
                    setwinner(r, c);
                    return;
                }
            }
        }
    }

    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != '') {
                if (board[r][c] == board[r + 1][c + 1] && board[r + 1][c + 1] == board[r + 2][c + 2] && board[r + 2][c + 2] == board[r + 3][c + 3]) {
                    setwinner(r, c);
                    return;
                }
            }
        }
    }

    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != '') {
                if (board[r][c] == board[r - 1][c + 1] && board[r - 1][c + 1] == board[r - 2][c + 2] && board[r - 2][c + 2] == board[r - 3][c + 3]) {
                    setwinner(r, c);
                    return;
                }
            }
        }
    }
}

function setwinner(r, c) {
    let winner = document.getElementById("winner");
    if (board[r][c] == playerred) {
        winner.innerText = "Red wins";
    } else {
        winner.innerText = "Yellow wins";
    }
    turn.style.display = "none";
    gameOver = true;
}

function reset() {
    gameOver = false;
    move = 0;
    curcoloums = [5, 5, 5, 5, 5, 5, 5]; // Reset the column row pointers
    board = []; // Clear the board

    let tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => tile.classList.remove("red-piece", "yellow-piece"));
    
    // Remove existing tiles from the board
    document.getElementById("board").innerHTML = '';
    
    game(); // Reinitialize the game
    turn.style.display = "block"; // Show the turn indicator again
    document.getElementById("winner").innerText = ''; // Clear the winner text
    moves.textContent = "Move = 0"; // Reset the move count
    curr = playerred;
}
