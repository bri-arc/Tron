(() => {
  "use strict";

  const canvas = document.querySelector("#game");
  const context = canvas.getContext("2d");
  const status = document.querySelector(".status");
  const statusText = document.querySelector("#status-text");
  const message = document.querySelector("#game-message");

  const grid = { columns: 40, rows: 24 };
  const tickLength = 125;
  const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowRight: { x: 1, y: 0 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 }
  };

  let player;
  let trail;
  let direction;
  let nextDirections;
  let gameOver;
  let lastTick = null;
  let accumulator = 0;

  function startGame() {
    const start = { x: Math.floor(grid.columns / 4), y: Math.floor(grid.rows / 2) };
    player = { ...start };
    trail = new Set([cellKey(start.x, start.y)]);
    direction = { x: 1, y: 0 };
    nextDirections = [];
    gameOver = false;
    accumulator = 0;
    status.classList.remove("is-over");
    statusText.textContent = "SYSTEM ONLINE";
    message.textContent = "FAHRE. ÜBERLEBE. HINTERLASSE DEINE SPUR.";
    draw();
  }

  function cellKey(x, y) {
    return `${x},${y}`;
  }

  function handleKeyDown(event) {
    if (event.key === "r" || event.key === "R") {
      if (gameOver) startGame();
      return;
    }

    const requested = directions[event.key];
    if (!requested) return;

    event.preventDefault();
    if (gameOver) return;

    const plannedDirection = nextDirections.at(-1) ?? direction;
    const isReverse = requested.x === -plannedDirection.x && requested.y === -plannedDirection.y;
    const isSame = requested.x === plannedDirection.x && requested.y === plannedDirection.y;

    if (!isReverse && !isSame && nextDirections.length < 2) {
      nextDirections.push(requested);
    }
  }

  function update() {
    if (gameOver) return;
    if (nextDirections.length) direction = nextDirections.shift();

    const next = { x: player.x + direction.x, y: player.y + direction.y };
    const outsideArena = next.x < 0 || next.x >= grid.columns || next.y < 0 || next.y >= grid.rows;

    if (outsideArena || trail.has(cellKey(next.x, next.y))) {
      endGame();
      return;
    }

    player = next;
    trail.add(cellKey(player.x, player.y));
  }

  function endGame() {
    gameOver = true;
    status.classList.add("is-over");
    statusText.textContent = "SIGNAL LOST";
    message.textContent = "CYCLE DEREZZED — DRÜCKE R ZUM NEUSTART";
  }

  function draw() {
    const cellWidth = canvas.width / grid.columns;
    const cellHeight = canvas.height / grid.rows;

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(cellWidth, cellHeight);
    drawTrail(cellWidth, cellHeight);
    drawPlayer(cellWidth, cellHeight);

    if (gameOver) drawGameOver();
  }

  function drawGrid(cellWidth, cellHeight) {
    context.save();
    context.strokeStyle = "rgba(38, 108, 128, 0.18)";
    context.lineWidth = 1;
    context.beginPath();

    for (let column = 1; column < grid.columns; column += 1) {
      const x = Math.round(column * cellWidth) + 0.5;
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
    }

    for (let row = 1; row < grid.rows; row += 1) {
      const y = Math.round(row * cellHeight) + 0.5;
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
    }

    context.stroke();
    context.restore();
  }

  function drawTrail(cellWidth, cellHeight) {
    context.save();
    context.lineCap = "square";
    context.lineJoin = "round";
    context.strokeStyle = "rgba(25, 203, 239, 0.66)";
    context.lineWidth = Math.min(cellWidth, cellHeight) * 0.52;
    context.shadowColor = "#20dbff";
    context.shadowBlur = 13;
    context.beginPath();

    let first = true;
    for (const key of trail) {
      const [x, y] = key.split(",").map(Number);
      const centerX = (x + 0.5) * cellWidth;
      const centerY = (y + 0.5) * cellHeight;
      if (first) {
        context.moveTo(centerX, centerY);
        first = false;
      } else {
        context.lineTo(centerX, centerY);
      }
    }

    context.stroke();
    context.restore();
  }

  function drawPlayer(cellWidth, cellHeight) {
    const centerX = (player.x + 0.5) * cellWidth;
    const centerY = (player.y + 0.5) * cellHeight;
    const radius = Math.min(cellWidth, cellHeight) * 0.34;
    const angle = Math.atan2(direction.y, direction.x);

    context.save();
    context.translate(centerX, centerY);
    context.rotate(angle);
    context.shadowColor = "#75f4ff";
    context.shadowBlur = 19;
    context.fillStyle = "#c4fbff";
    context.beginPath();
    context.moveTo(radius * 1.35, 0);
    context.lineTo(-radius, -radius * 0.8);
    context.lineTo(-radius * 0.65, 0);
    context.lineTo(-radius, radius * 0.8);
    context.closePath();
    context.fill();
    context.restore();
  }

  function drawGameOver() {
    context.save();
    context.fillStyle = "rgba(2, 6, 10, 0.54)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    context.shadowColor = "#ff496a";
    context.shadowBlur = 20;
    context.fillStyle = "#fff1f4";
    context.font = "800 31px system-ui, sans-serif";
    context.fillText("SIGNAL LOST", canvas.width / 2, canvas.height / 2 - 5);
    context.shadowBlur = 0;
    context.fillStyle = "#9baeb8";
    context.font = "600 12px system-ui, sans-serif";
    context.fillText("R ZUM NEUSTART", canvas.width / 2, canvas.height / 2 + 23);
    context.restore();
  }

  function frame(timestamp) {
    if (lastTick === null) lastTick = timestamp;
    accumulator += Math.min(timestamp - lastTick, tickLength * 2);
    lastTick = timestamp;

    while (accumulator >= tickLength && !gameOver) {
      update();
      accumulator -= tickLength;
    }

    draw();
    window.requestAnimationFrame(frame);
  }

  window.addEventListener("keydown", handleKeyDown);
  startGame();
  window.requestAnimationFrame(frame);
})();
