const canvas = document.getElementById("snake-game");
const ctx = canvas.getContext("2d");

const boardSize = 10;
const tileSize = 30;

let direction = "ArrowRight";
let nextDirection = "ArrowRight";
let gameOver = false;

let score = 0;
const scoreDisplay = document.getElementById("score");

let snake = [
  { row: 5, col: 1 },
  { row: 5, col: 2 },
  { row: 5, col: 3 },
  { row: 5, col: 4 },
];

let apple = null;
let bread = null;

function drawBoard() {
  let checker = false;

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      checker = !checker;
      if (checker) {
        ctx.fillStyle = "#65b335";
      } else {
        ctx.fillStyle = "green";
      }

      ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
    }
    checker = !checker;
  }
}

function drawSnake() {
  ctx.fillStyle = "blue";
  for (let part of snake) {
    ctx.fillRect(part.col * tileSize, part.row * tileSize, tileSize, tileSize);
  }
}

function drawApple() {
  if (!apple) return;

  ctx.fillStyle = "red";
  ctx.fillRect(apple.col * tileSize, apple.row * tileSize, tileSize, tileSize);
}

function drawBread() {
  if (!bread) return;

  ctx.fillStyle = "brown";
  ctx.fillRect(bread.col * tileSize, bread.row * tileSize, tileSize, tileSize);
}

function spawnApple() {
  while (true) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);

    let isOnSnake = false;
    for (let part of snake) {
      if (part.row === row && part.col === col) {
        isOnSnake = true;
        break;
      }
    }

    if (!isOnSnake) {
      apple = { row, col };
      break;
    }
  }
}

function spawnBread() {
  while (true) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);

    let isOnSnake = false;
    for (let part of snake) {
      if (part.row === row && part.col === col) {
        isOnSnake = true;
        break;
      }
    }

    if (!isOnSnake) {
      bread = { row, col };
      break;
    }
  }
}

function moveSnake() {
  direction = nextDirection;

  const lastSegment = snake[snake.length - 1];
  const head = { row: lastSegment.row, col: lastSegment.col };

  if (direction === "ArrowUp") head.row--;
  if (direction === "ArrowDown") head.row++;
  if (direction === "ArrowLeft") head.col--;
  if (direction === "ArrowRight") head.col++;

  if (
    head.row < 0 || head.row >= boardSize ||
    head.col < 0 || head.col >= boardSize
  ) {
    endGame("You hit the wall :(");
    return;
  }

  let hitSelf = false;
  for (let part of snake) {
    if (part.row === head.row && part.col === head.col) {
      hitSelf = true;
      break;
    }
  }

  if (hitSelf) {
    endGame("You ate yourself :(");
    return;
  }

  snake.push(head);

  if (apple && head.row === apple.row && head.col === apple.col) {
    spawnApple();
    score += 50;
    scoreDisplay.textContent = "Score: " + score;
  } else {
    snake.shift();
  }

  if (bread && head.row === bread.row && head.col === bread.col) {
    spawnBread();
    score -= 50;
    scoreDisplay.textContent = "Score: " + score;
  }
  if (snake.length === boardSize * boardSize) {
    endGame("You win :)");
  }
}

function handleKeydown(e) {
  const allowed = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

  const opposite = {
    "ArrowUp": "ArrowDown",
    "ArrowDown": "ArrowUp",
    "ArrowLeft": "ArrowRight",
    "ArrowRight": "ArrowLeft",
  };

  //no doing 180s lol
  if (allowed.includes(e.code) && e.code !== opposite[direction]) {
    nextDirection = e.code;
    e.preventDefault();
  }
}

function updateGame() {
  if (gameOver) return;

  moveSnake();
  drawBoard();
  drawApple();
  drawBread();
  drawSnake();
}

function endGame(message) {
  gameOver = true;
  alert(message);
}

function startGame() {
  window.addEventListener("keydown", handleKeydown);
  spawnApple();
  spawnBread();
  setInterval(updateGame, 200);
}

startGame();
