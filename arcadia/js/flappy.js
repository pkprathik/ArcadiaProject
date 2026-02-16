const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const overlay = document.getElementById("flappyOverlay");
const overlayTitle = document.getElementById("flappyOverlayTitle");
const overlayHint = document.getElementById("flappyOverlayHint");

function showOverlay(title, hint = "") {
  overlayTitle.textContent = title;
  overlayHint.textContent = hint;
  overlay.style.display = "flex";
}

function hideOverlay() {
  overlay.style.display = "none";
}


let bird = { x: 80, y: 200, size: 30, velocity: 0 };
const gravity = 0.6;
const lift = -10;

let pipes = [];
const pipeWidth = 50;
const pipeGap = 150;

let score = 0;
let gameOver = false;

canvas.addEventListener("click", flap);
document.addEventListener("keydown", e => e.code === "Space" && flap());

function flap() {
  if (!gameOver) {
    bird.velocity = lift;
    hideOverlay();
  }
}


function createPipe() {
  const top = Math.random() * 200 + 50;
  pipes.push({ x: canvas.width, top, bottom: top + pipeGap, passed: false });
}

showOverlay("Tap / Press Space to Start", "Click canvas or press Space to flap");

function draw() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.velocity += gravity;
  bird.y += bird.velocity;

  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.size, bird.size);

  pipes.forEach(pipe => {
    pipe.x -= 2;
    ctx.fillStyle = "green";
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height);

    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.size > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.size > pipe.bottom)
    ) endGame();

    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      pipe.passed = true;
      document.getElementById("score").textContent = ++score;
    }
  });

  pipes = pipes.filter(p => p.x + pipeWidth > 0);

  if (bird.y < 0 || bird.y + bird.size > canvas.height) endGame();

  requestAnimationFrame(draw);
}

function endGame() {
  if (gameOver) return;
  gameOver = true;
  saveScore(score);
  showOverlay("Game Over!", `Score: ${score}`);

  //end scor

}


function restartGame() {
  location.reload();
}

function saveScore(score) {
  fetch("../backend/save_score.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `game_name=Flappy Bird&score=${score}`
  });
}

createPipe();
setInterval(createPipe, 1800);
draw();
