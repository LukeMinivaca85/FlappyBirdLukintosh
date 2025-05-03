const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdY, birdVelocity, gravity, jump, pipeX, pipeHeight, pipeGap, score, gameOver, gameSpeed, mode;

canvas.width = 400;
canvas.height = 600;

function startGame(selectedMode) {
  mode = selectedMode;
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";
  document.getElementById("game-over").style.display = "none";

  birdY = 150;
  birdVelocity = 0;
  pipeX = canvas.width;
  pipeHeight = Math.floor(Math.random() * 200) + 50;
  score = 0;
  gameOver = false;

  if (mode === "easy") {
    gravity = 0.3;
    jump = -7;
    pipeGap = 180;
    gameSpeed = 1;
  } else if (mode === "hard") {
    gravity = 0.6;
    jump = -10;
    pipeGap = 120;
    gameSpeed = 3;
  } else {  // Pro Mode
    gravity = 0.8;
    jump = -12;
    pipeGap = 100;
    gameSpeed = 5;
  }

  document.addEventListener("keydown", flap);
  document.addEventListener("touchstart", flap);
  document.addEventListener("keydown", restartOnSpace);

  requestAnimationFrame(gameLoop);
}

function flap() {
  if (!gameOver) birdVelocity = jump;
}

function restartOnSpace(event) {
  if (event.code === "Space" && mode === "easy" && birdY >= canvas.height) {
    birdY = 150;
    birdVelocity = 0;
    gameOver = false;
    score = 0;
  }
}

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(50, birdY, 15, 0, Math.PI * 2);
  ctx.fill();
}

function drawPipe() {
  ctx.fillStyle = "green";
  ctx.fillRect(pipeX, 0, 50, pipeHeight);
  ctx.fillRect(pipeX, pipeHeight + pipeGap, 50, canvas.height);
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText("Pontuação: " + score, 10, 30);
}

function showGameOver() {
  gameOver = true;
  document.getElementById("finalScore").innerText = "Sua pontuação: " + score;
  document.getElementById("game-over").style.display = "block";
}

function checkCollision() {
  if (mode === "easy") {
    if (
      pipeX < 65 && pipeX + 50 > 35 &&
      (birdY < pipeHeight || birdY > pipeHeight + pipeGap)
    ) {
      showGameOver();
    }
  } else {
    if (
      birdY < 0 || birdY > canvas.height ||
      (pipeX < 65 && pipeX + 50 > 35 &&
       (birdY < pipeHeight || birdY > pipeHeight + pipeGap))
    ) {
      showGameOver();
    }
  }
}

function restartGame() {
  document.getElementById("game-over").style.display = "none";
  canvas.style.display = "none";
  document.getElementById("menu").style.display = "block";
  document.removeEventListener("keydown", flap);
  document.removeEventListener("touchstart", flap);
  document.removeEventListener("keydown", restartOnSpace);
}

function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  birdVelocity += gravity;
  birdY += birdVelocity;

  pipeX -= gameSpeed;
  if (pipeX < -50) {
    pipeX = canvas.width;
    pipeHeight = Math.floor(Math.random() * 200) + 50;
    score++;
  }

  drawBird();
  drawPipe();
  drawScore();
  checkCollision();

  requestAnimationFrame(gameLoop);
}

document.getElementById("easy-mode").addEventListener("click", () => startGame("easy"));
document.getElementById("hard-mode").addEventListener("click", () => startGame("hard"));
document.getElementById("pro-mode").addEventListener("click", () => startGame("pro"));

document.getElementById("try-again").addEventListener("click", restartGame);
document.getElementById("buy-pro").addEventListener("click", () => {
  alert("Você comprou a versão Pro! Agora jogue o Modo Hardcore!");
});
