// Board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// Dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let speedIncreaseInterval = 5000; // Increase speed every 5 seconds
let speedIncreaseRate = 0.2; 

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

// Cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

// Flying Enemy (bird)
let flyingArray = [];
let flyingWidth = 60;
let flyingHeight = 40;
let flyingX = boardWidth;
let flyingYMin = 150;
let flyingYMax = boardHeight - 80;
let flyingImg;

// Physics
let velocityX = -8; // Cactus and flying enemies moving left speed
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

// Track if dino is ducking
let isDucking = false;

// Flags to prevent simultaneous cactus and flying enemy spawn
let isBirdSpawned = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); // Used for drawing on the board

    // Load dino image
    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    // Load cactus images
    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    // Load flying enemy (bird) image
    flyingImg = new Image();
    flyingImg.src = "./img/bird1.png";  // Corrected the image path to bird1.png

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); // 1000 milliseconds = 1 second
    setInterval(placeFlyingEnemy, 3000); // 3000 milliseconds = 3 seconds
    document.addEventListener("keydown", moveDino);
    document.addEventListener("keyup", releaseDino);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Apply gravity to dino's velocity
    velocityY += gravity;

    if (isDucking) {
        // When ducking, don't allow the dino to jump or fall lower than the ground
        dino.y = Math.min(dino.y + velocityY, dinoY + dinoHeight / 2); // Keep it at ground level for ducking
    } else {
        // Apply normal gravity when not ducking
        dino.y = Math.min(dino.y + velocityY, dinoY); // Ensure it doesn't go below the ground
    }

    // Draw the dino
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // Cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function () {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    // Flying enemies
    for (let i = 0; i < flyingArray.length; i++) {
        let flying = flyingArray[i];
        flying.x += velocityX;
        context.drawImage(flyingImg, flying.x, flying.y, flying.width, flying.height);

        // If the flying enemy is within a height range that requires ducking
        if (detectCollision(dino, flying) && !isDucking) {
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function () {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }
    // Gradually increase the speed
    if (score % speedIncreaseInterval === 0 && score > 0) {
        velocityX -= speedIncreaseRate;
    }

    // Score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY && !isDucking) {
        // Jump
        velocityY = -10;
    } else if ((e.code == "ArrowDown" || e.code == "ShiftLeft" || e.code == "ShiftRight")&& dino.y == dinoY) {
        // Duck
        isDucking = true;
        dino.height = dinoHeight / 2; // Reduce height to half
        dino.y = dinoY + dinoHeight / 2; // Adjust y position to keep dino grounded
    }
}

function releaseDino(e) {
    if ((e.code == "ArrowDown" || e.code == "ShiftLeft" || e.code == "ShiftRight") && isDucking) {
        // Stop ducking
        isDucking = false;
        dino.height = dinoHeight; // Restore original height
        dino.y = dinoY; // Restore original y position
    }
}

function placeCactus() {
    if (gameOver || isBirdSpawned) {
        return; // Don't place a cactus if a bird has spawned
    }

    // Place cactus
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); // 0 - 0.9999...

    if (placeCactusChance > .90) { // 10% you get cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { // 30% you get cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { // 50% you get cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); // Remove the first element from the array so that the array doesn't constantly grow
    }
}

function placeFlyingEnemy() {
    if (gameOver || isBirdSpawned) {
        return; // Don't place a bird if one has already spawned
    }

    // Place flying enemy
    let flying = {
        img: flyingImg,
        x: flyingX,
        y: Math.random() * (flyingYMax - flyingYMin) + flyingYMin, // Random Y position for flying
        width: flyingWidth,
        height: flyingHeight
    }

    flyingArray.push(flying);
    isBirdSpawned = true; // Mark that a bird has spawned

    if (flyingArray.length > 5) {
        flyingArray.shift(); // Remove the first element from the array so that the array doesn't constantly grow
    }

    // After 3 seconds, reset the bird spawn flag so cactus can spawn again
    setTimeout(() => {
        isBirdSpawned = false;
    }, 3000); // Reset flag after 3 seconds to allow a new bird to spawn
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   // a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   // a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  // a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    // a's bottom left corner passes b's top left corner
}
// Add this function to reset the game
// Add this function to reset the game
function resetGame() {
    gameOver = false;
    score = 0;
    dino.y = dinoY;
    dino.height = dinoHeight;
    velocityY = 0;
    velocityX = -8; // Reset the cactus and flying enemies speed
    cactusArray = [];
    flyingArray = [];
    isBirdSpawned = false;
    dinoImg.src = "./img/dino.png"; // Reset dino image
    requestAnimationFrame(update); // Restart the game loop
    window.location.reload();
}

document.addEventListener("keydown", function (e) {
    if (gameOver && (e.code === "Enter" || e.code === "Space")) {
        resetGame(); // Call reset function when game is over

    } else {
        moveDino(e); // Normal key handling during gameplay
    }
});