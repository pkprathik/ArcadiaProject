const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 10;
const paddleHeight = 80;

let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSize = 10;
let ballSpeedX = 4;
let ballSpeedY = 4;

let playerScore = 0;
let aiScore = 0;

function drawPaddles() {
  ctx.fillStyle = "white";
  ctx.fillRect(10, playerY, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - 20, aiY, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY >= canvas.height) ballSpeedY *= -1;

  // Player paddle collision
  if (
    ballX <= 20 &&
    ballY > playerY &&
    ballY < playerY + paddleHeight
  ) {
    ballSpeedX *= -1;
  }

  // AI paddle collision
  if (
    ballX >= canvas.width - 20 &&
    ballY > aiY &&
    ballY < aiY + paddleHeight
  ) {
    ballSpeedX *= -1;
  }

  // Score
  if (ballX < 0) {
    aiScore++;
    document.getElementById("aiScore").innerText = aiScore;
    resetBall();
  }

  if (ballX > canvas.width) {
    playerScore++;
    document.getElementById("playerScore").innerText = playerScore;
    resetBall();
  }
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX *= -1;
}

function moveAI() {
  aiY += (ballY - (aiY + paddleHeight / 2)) * 0.05;
}

canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  playerY = e.clientY - rect.top - paddleHeight / 2;
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddles();
  drawBall();
  moveBall();
  moveAI();
  requestAnimationFrame(draw);
}

function restartGame() {
  playerScore = 0;
  aiScore = 0;
  document.getElementById("playerScore").innerText = 0;
  document.getElementById("aiScore").innerText = 0;
  resetBall();
}

draw();