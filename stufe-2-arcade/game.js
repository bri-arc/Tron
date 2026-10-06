(() => {
  "use strict";

  const canvas = document.querySelector("#game");
  const context = canvas.getContext("2d");
  const overlay = document.querySelector("#overlay");
  const startButton = document.querySelector("#start-button");
  const title = document.querySelector("#overlay-title");
  const kicker = document.querySelector("#overlay-kicker");
  const copy = document.querySelector("#overlay-copy");
  const scoreDisplay = document.querySelector("#score");
  const timeDisplay = document.querySelector("#time");
  const highScoreDisplay = document.querySelector("#high-score");
  const message = document.querySelector("#game-message");
  const soundToggle = document.querySelector("#sound-toggle");

  const grid = { columns: 40, rows: 24 };
  const baseTick = 125;
  const directions = {
    ArrowUp: { x: 0, y: -1 }, ArrowRight: { x: 1, y: 0 },
    ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }
  };
  const storage = {
    read(key, fallback) {
      try {
        const value = Number(localStorage.getItem(key));
        return Number.isFinite(value) && value >= 0 ? value : fallback;
      } catch (error) {
        console.warn("Local storage is unavailable.", error);
        return fallback;
      }
    },
    write(key, value) {
      try {
        localStorage.setItem(key, String(value));
      } catch (error) {
        console.warn("Could not save arcade record.", error);
      }
    }
  };

  let player;
  let trail;
  let direction;
  let pendingDirections;
  let state = "ready";
  let score = 0;
  let ticks = 0;
  let startTime = 0;
  let lastTick = null;
  let accumulator = 0;
  let audioContext = null;
  let muted = false;
  let highScore = storage.read("neon-grid-high-score", 0);
  highScoreDisplay.textContent = formatScore(highScore);

  function formatScore(value) { return String(value).padStart(6, "0"); }
  function cellKey(x, y) { return `${x},${y}`; }

  function playTone(frequency, duration, type = "sine", volume = 0.055) {
    if (muted) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioContext ??= new AudioContext();
    if (audioContext.state === "suspended") audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  function startGame() {
    const start = { x: Math.floor(grid.columns / 4), y: Math.floor(grid.rows / 2) };
    player = { ...start };
    trail = new Set([cellKey(start.x, start.y)]);
    direction = { x: 1, y: 0 };
    pendingDirections = [];
    state = "playing";
    score = 0;
    ticks = 0;
    startTime = performance.now();
    accumulator = 0;
    scoreDisplay.textContent = formatScore(score);
    message.textContent = "HALTE DICH FREI. DER GRID-TICK WIRD SCHNELLER.";
    title.textContent = "LINK ESTABLISHED";
    kicker.textContent = "SYSTEM ONLINE";
    copy.textContent = "Jeder überlebte Tick bringt Punkte.";
    startButton.textContent = "NEUSTART";
    overlay.classList.add("is-hidden");
    playTone(660, 0.16, "triangle");
  }

  function finishGame() {
    state = "over";
    const elapsed = Math.floor((performance.now() - startTime) / 1000);
    const achieved = score + elapsed * 2;
    if (achieved > highScore) {
      highScore = achieved;
      storage.write("neon-grid-high-score", highScore);
      highScoreDisplay.textContent = formatScore(highScore);
      kicker.textContent = "NEUER PERSÖNLICHER REKORD";
    } else {
      kicker.textContent = "SIGNAL LOST";
    }
    title.textContent = "CYCLE DEREZZED";
    copy.textContent = `${formatScore(achieved)} PUNKTE · ÜBERLEBT: ${formatTime(elapsed)}`;
    startButton.textContent = "NOCH EIN RUN";
    message.textContent = "KOLLISION REGISTRIERT. SETZE DEINEN RUN ZURÜCK.";
    overlay.classList.remove("is-hidden");
    playTone(110, 0.65, "sawtooth", 0.09);
  }

  function formatTime(seconds) {
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function steer(key) {
    const requested = directions[key];
    if (!requested) return;
    if (state !== "playing") {
      if (state === "ready" || state === "over") startGame();
      else return;
    }
    const planned = pendingDirections.at(-1) ?? direction;
    if ((requested.x !== -planned.x || requested.y !== -planned.y) &&
        (requested.x !== planned.x || requested.y !== planned.y) && pendingDirections.length < 2) {
      pendingDirections.push(requested);
    }
  }

  function handleKey(event) {
    if (directions[event.key]) {
      event.preventDefault();
      steer(event.key);
    } else if ((event.key === "Enter" || event.key === " ") && state !== "playing") {
      event.preventDefault();
      startGame();
    }
  }

  function update() {
    if (state !== "playing") return;
    if (pendingDirections.length) direction = pendingDirections.shift();
    const next = { x: player.x + direction.x, y: player.y + direction.y };
    if (next.x < 0 || next.x >= grid.columns || next.y < 0 || next.y >= grid.rows || trail.has(cellKey(next.x, next.y))) {
      finishGame();
      return;
    }
    player = next;
    trail.add(cellKey(player.x, player.y));
    ticks += 1;
    score += 10;
    scoreDisplay.textContent = formatScore(score);
    if (ticks % 8 === 0) playTone(380 + (ticks % 12) * 22, 0.07, "sine", 0.025);
  }

  function draw() {
    const cw = canvas.width / grid.columns;
    const ch = canvas.height / grid.rows;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#03070b";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.strokeStyle = "rgba(38, 129, 151, 0.21)";
    context.lineWidth = 1;
    context.beginPath();
    for (let x = 0; x <= grid.columns; x += 1) { context.moveTo(x * cw + .5, 0); context.lineTo(x * cw + .5, canvas.height); }
    for (let y = 0; y <= grid.rows; y += 1) { context.moveTo(0, y * ch + .5); context.lineTo(canvas.width, y * ch + .5); }
    context.stroke();
    context.restore();
    if (!player || !trail) return;
    drawTrail(cw, ch);
    drawCycle(cw, ch);
    if (state === "over") {
      context.fillStyle = "rgba(2, 6, 10, .35)";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function drawTrail(cw, ch) {
    context.save();
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "rgba(25, 203, 239, .78)";
    context.lineWidth = Math.min(cw, ch) * .48;
    context.shadowColor = "#20dbff";
    context.shadowBlur = 15;
    context.beginPath();
    let first = true;
    for (const key of trail) {
      const [x, y] = key.split(",").map(Number);
      const px = (x + .5) * cw, py = (y + .5) * ch;
      if (first) { context.moveTo(px, py); first = false; } else context.lineTo(px, py);
    }
    context.stroke();
    context.restore();
  }

  function drawCycle(cw, ch) {
    const radius = Math.min(cw, ch) * .34;
    context.save();
    context.translate((player.x + .5) * cw, (player.y + .5) * ch);
    context.rotate(Math.atan2(direction.y, direction.x));
    context.fillStyle = "#d8fcff";
    context.shadowColor = "#63f4ff";
    context.shadowBlur = 20;
    context.beginPath();
    context.moveTo(radius * 1.4, 0);
    context.lineTo(-radius, -radius * .8);
    context.lineTo(-radius * .65, 0);
    context.lineTo(-radius, radius * .8);
    context.closePath();
    context.fill();
    context.restore();
  }

  function frame(now) {
    if (lastTick === null) lastTick = now;
    accumulator += Math.min(now - lastTick, baseTick * 2);
    lastTick = now;
    const elapsed = state === "playing" ? Math.floor((now - startTime) / 1000) : 0;
    timeDisplay.textContent = formatTime(elapsed);
    const tick = Math.max(58, baseTick - Math.floor(ticks / 24) * 4);
    while (accumulator >= tick && state === "playing") { update(); accumulator -= tick; }
    draw();
    requestAnimationFrame(frame);
  }

  startButton.addEventListener("click", startGame);
  soundToggle.addEventListener("click", () => {
    muted = !muted;
    soundToggle.textContent = `AUDIO: ${muted ? "OFF" : "ON"}`;
    soundToggle.setAttribute("aria-pressed", String(!muted));
    if (!muted) playTone(520, .1, "triangle");
  });
  window.addEventListener("keydown", handleKey);
  document.querySelectorAll("[data-direction]").forEach(button => {
    button.addEventListener("pointerdown", event => {
      event.preventDefault();
      steer(button.dataset.direction);
    });
  });
  requestAnimationFrame(frame);
})();
