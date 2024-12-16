const board = document.querySelector("#board");
const ctx = board.getContext("2d");
const score = document.querySelector("#score");
const reset = document.querySelector("#resetbtn");
const gamewidth = board.width;
const gameheight = board.height;
const bg = "#E4F1AC";
const snakecolour = "#5DB996";
const snakeborder = "#997C70";
const foodcolor = "#F72C5B";
const unitsize = 25;
let running = false;
let gameStarted = false; // Flag to track if the game has started
let firstKeyPressed = false; // Flag to track if it's the first key press

let xVel = unitsize;
let yVel = 0;
let foodx;
let foody;
let src = 0;
let snake = [
    { x: unitsize * 4, y: 0 },
    { x: unitsize * 3, y: 0 },
    { x: unitsize * 2, y: 0 },
    { x: unitsize, y: 0 },
    { x: 0, y: 0 }
];

// Draw the empty board when the page loads
function clearboard() {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, gamewidth, gameheight);
}

// Initialize the canvas by clearing it
clearboard();

// Function to create initial food position (this will happen only once before game starts)
function createInitialFood() {
    function randomfood(min, max) {
        const randnum = Math.round((Math.random() * (max - min) + min) / unitsize) * unitsize;
        return randnum;
    }
    foodx = randomfood(0, gamewidth - unitsize);
    foody = randomfood(0, gameheight - unitsize);
}

// Function to draw the food on the canvas
function drawInitialFood() {
    ctx.fillStyle = foodcolor;
    ctx.fillRect(foodx, foody, unitsize, unitsize);
}

// Draw the initial snake on the canvas
function drawInitialSnake() {
    ctx.fillStyle = snakecolour;
    ctx.strokeStyle = snakeborder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitsize, unitsize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitsize, unitsize);
    });
}

// Draw initial food and snake before the game starts
createInitialFood();
drawInitialFood();
drawInitialSnake();

window.addEventListener("keydown", startGame);
window.addEventListener("keydown", changeDir);
reset.addEventListener("click", resetgame);

function startGame(event) {
    if (!gameStarted && !firstKeyPressed) {
        firstKeyPressed = true; // Set flag that first key has been pressed
        gameStarted = true; // Now the game will start
        gamestart();
    }
}

function gamestart() {
    running = true;
    score.textContent = src;
    nextTick();
}

function nextTick() {
    if (running) {
        const speed = Math.max(25, 75 - src * 2);
        setTimeout(() => {
            clearboard();
            drawfood();
            movesnake();
            drawsnake();
            checkgame();
            nextTick();
        }, speed);
    } else {
        displaygameover();
    }
}

// This function will create new food at random positions when snake eats the food
function createfood() {
    function randomfood(min, max) {
        const randnum = Math.round((Math.random() * (max - min) + min) / unitsize) * unitsize;
        return randnum;
    }
    foodx = randomfood(0, gamewidth - unitsize);
    foody = randomfood(0, gameheight - unitsize);
}

function drawfood() {
    ctx.fillStyle = foodcolor;
    ctx.fillRect(foodx, foody, unitsize, unitsize);
}

function movesnake() {
    const head = { x: snake[0].x + xVel, y: snake[0].y + yVel };
    snake.unshift(head);
    if (snake[0].x == foodx && snake[0].y == foody) {
        src += 1;
        score.textContent = src;
        createfood(); // Food position is updated only when eaten
    } else {
        snake.pop();
    }
}

function drawsnake() {
    ctx.fillStyle = snakecolour;
    ctx.strokeStyle = snakeborder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitsize, unitsize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitsize, unitsize);
    });
}

function changeDir(event) {
    if (!gameStarted) return;  // Don't change direction before the game starts

    const keypressed = event.keyCode;
    const LEFT = 37;   // Arrow left
    const UP = 38;     // Arrow up
    const RIGHT = 39;  // Arrow right
    const DOWN = 40;   // Arrow down
    const W = 87;      // W key for up
    const A = 65;      // A key for left
    const S = 83;      // S key for down
    const D = 68;      // D key for right

    const goingUP = (yVel == -unitsize);
    const goingDown = (yVel == unitsize);
    const goingRIGHT = (xVel == unitsize);
    const goingLEFT = (xVel == -unitsize);

    switch (true) {
        // Left key (Arrow Left or A)
        case (keypressed == LEFT || keypressed == A):
            if (!goingRIGHT) {
                xVel = -unitsize;
                yVel = 0;
            }
            break;
        // Up key (Arrow Up or W)
        case (keypressed == UP || keypressed == W):
            if (!goingDown) {
                yVel = -unitsize;
                xVel = 0;
            }
            break;
        // Right key (Arrow Right or D)
        case (keypressed == RIGHT || keypressed == D):
            if (!goingLEFT) {
                xVel = unitsize;
                yVel = 0;
            }
            break;
        // Down key (Arrow Down or S)
        case (keypressed == DOWN || keypressed == S):
            if (!goingUP) {
                yVel = unitsize;
                xVel = 0;
            }
            break;
    }
}


function checkgame() {
    switch (true) {
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gamewidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameheight):
            running = false;
            break;
    }
    for (let i = 1; i < snake.length; i += 1) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false;
        }
    }
}

function displaygameover() {
    ctx.font = "50px MV BOLI";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gamewidth / 2, gameheight / 2);
    running = false;
}

function resetgame() {
    // Reset game variables
    src = 0;
    xVel = unitsize;
    yVel = 0;
    snake = [
        { x: unitsize * 4, y: 0 },
        { x: unitsize * 3, y: 0 },
        { x: unitsize * 2, y: 0 },
        { x: unitsize, y: 0 },
        { x: 0, y: 0 }
    ];
    gameStarted = false;
    firstKeyPressed = false; // Reset firstKeyPressed flag
    score.textContent = src;

    clearboard(); // Ensure the board is cleared when resetting

    // Draw the initial snake and food when resetting
    createInitialFood();
    drawInitialFood();
    drawInitialSnake();
    displaygameover(); // Optional: show "GAME OVER" message right after reset
}

// Make sure the game starts/reset after any key press or button click
window.addEventListener("keydown", function (event) {
    if (!gameStarted || !running) {
        resetgame(); // Reset the game on any key press after game over
    }
});
