const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Bird
let birdX = 80;
let birdY = 200;
let birdSize = 30;
let gravity = 0.6;
let lift = -10;
let velocity = 0;

// Pipes
let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;

// Game state
let score = 0;
let gameOver = false;

// Focus click (IMPORTANT)
canvas.addEventListener("click", () => {
    velocity = lift;
});

// Space key
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !gameOver) {
        velocity = lift;
    }
});

// Create pipe
function createPipe() {
    let top = Math.random() * 200 + 50;
    pipes.push({
        x: canvas.width,
        top: top,
        bottom: top + pipeGap,
        passed: false
    });
}

// Draw bird
function drawBird() {
    velocity += gravity;
    birdY += velocity;

    ctx.fillStyle = "yellow";
    ctx.fillRect(birdX, birdY, birdSize, birdSize);
}

// Draw pipes
function drawPipes() {
    ctx.fillStyle = "green";

    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2;

        ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].top);
        ctx.fillRect(
            pipes[i].x,
            pipes[i].bottom,
            pipeWidth,
            canvas.height
        );

        // Collision
        if (
            birdX < pipes[i].x + pipeWidth &&
            birdX + birdSize > pipes[i].x &&
            (birdY < pipes[i].top || birdY + birdSize > pipes[i].bottom)
        ) {
            endGame();
        }

        // Score
        if (!pipes[i].passed && pipes[i].x + pipeWidth < birdX) {
            score++;
            pipes[i].passed = true;
            document.getElementById("score").innerText = score;
        }
    }
}

// End game
function endGame() {
    gameOver = true;

    // Save score to database
    saveScore(score);

    alert("Game Over! Your score: " + score);
}

// Restart
function restartGame() {
    location.reload();
}

// Main loop
function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawPipes();

    // Boundary
    if (birdY <= 0 || birdY + birdSize >= canvas.height) {
        endGame();
    }

    requestAnimationFrame(gameLoop);
}

function saveScore(score) {
    fetch("../backend/save_score.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `game_name=Flappy Bird&score=${score}`
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

// Create FIRST pipe immediately
createPipe();
setInterval(createPipe, 1800);

// Start
gameLoop();