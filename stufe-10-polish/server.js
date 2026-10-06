"use strict";

const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, { maxHttpBufferSize: 1e5 });
const lobbies = new Map();
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const powerupTypes = new Set(["speed", "slow", "shield", "clear", "ghost", "bomb", "multiplier"]);

app.use(express.static(__dirname, { extensions: ["html"] }));

function makeCode() {
  let code;
  do {
    code = Array.from({ length: 5 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  } while (lobbies.has(code));
  return code;
}

function lobbyFor(socket) {
  return [...lobbies.values()].find(lobby => lobby.players.has(socket.id));
}

function publishLobby(lobby) {
  io.to(lobby.code).emit("lobby:players", {
    code: lobby.code,
    players: [...lobby.players.values()].map(({ id, name, ready }) => ({ id, name, ready }))
  });
  publishLobbyList();
}

function publishLobbyList() {
  const open = [...lobbies.values()]
    .filter(lobby => lobby.state === "waiting" && lobby.players.size < 8)
    .map(lobby => ({ code: lobby.code, players: lobby.players.size }));
  io.emit("lobby:list", open);
}

io.on("connection", socket => {
  socket.emit("connection:status", { connected: true });
  socket.on("lobby:list", reply => {
    const open = [...lobbies.values()]
      .filter(lobby => lobby.state === "waiting" && lobby.players.size < 8)
      .map(lobby => ({ code: lobby.code, players: lobby.players.size }));
    socket.emit("lobby:list", open);
    if (typeof reply === "function") reply({ ok: true, lobbies: open });
  });
  socket.on("lobby:create", (payload, reply = () => {}) => {
    const lobby = { code: makeCode(), players: new Map(), state: "waiting" };
    lobby.players.set(socket.id, { id: socket.id, name: cleanName(payload?.name), ready: false });
    lobbies.set(lobby.code, lobby);
    socket.join(lobby.code);
    socket.data.lobbyCode = lobby.code;
    reply({ ok: true, code: lobby.code });
    publishLobby(lobby);
  });
  socket.on("lobby:join", (payload, reply = () => {}) => {
    const code = String(payload?.code ?? "").toUpperCase();
    const lobby = lobbies.get(code);
    if (!lobby || lobby.state !== "waiting" || lobby.players.size >= 8) {
      reply({ ok: false, error: "Lobby nicht gefunden oder voll." });
      return;
    }
    const player = { id: socket.id, name: cleanName(payload?.name), ready: false };
    lobby.players.set(socket.id, player);
    socket.join(code);
    socket.data.lobbyCode = code;
    reply({ ok: true, code });
    publishLobby(lobby);
  });
  socket.on("lobby:ready", (ready, reply = () => {}) => {
    const lobby = lobbyFor(socket);
    const player = lobby?.players.get(socket.id);
    if (!lobby || !player) { reply({ ok: false, error: "Keine aktive Lobby." }); return; }
    player.ready = Boolean(ready);
    publishLobby(lobby);
    reply({ ok: true });
  });
  socket.on("game:start", (...args) => {
    const reply = args.find(argument => typeof argument === "function") ?? (() => {});
    const lobby = lobbyFor(socket);
    if (!lobby || lobby.players.size < 2 || [...lobby.players.values()].some(player => !player.ready)) {
      reply({ ok: false, error: "Mindestens zwei READY-Fahrer werden benötigt." });
      return;
    }
    lobby.state = "playing";
    io.to(lobby.code).emit("game:start", { code: lobby.code });
    publishLobbyList();
    reply({ ok: true });
  });
  socket.on("game:state", state => {
    const lobby = lobbyFor(socket);
    if (!lobby || lobby.state !== "playing" || !validState(state)) return;
    socket.to(lobby.code).volatile.emit("game:state", { id: socket.id, ...state });
  });
  socket.on("powerup:sync", payload => {
    const lobby = lobbyFor(socket);
    const action = payload?.action;
    const x = payload?.x, y = payload?.y;
    if (lobby && lobby.state === "playing" &&
        ["spawn", "collect"].includes(action) && powerupTypes.has(payload?.type) &&
        Number.isInteger(x) && x >= 0 && x < 40 && Number.isInteger(y) && y >= 0 && y < 24) {
      socket.to(lobby.code).emit("powerup:sync", { id: socket.id, action, type: payload.type, x, y });
    }
  });
  socket.on("chat:message", payload => {
    const lobby = lobbyFor(socket);
    const message = String(payload?.message ?? "").trim().slice(0, 240);
    if (!lobby || !message) return;
    const player = lobby.players.get(socket.id);
    io.to(lobby.code).emit("chat:message", { name: player.name, message, at: Date.now() });
  });
  socket.on("disconnect", () => {
    const lobby = lobbyFor(socket);
    if (!lobby) return;
    lobby.players.delete(socket.id);
    if (!lobby.players.size) lobbies.delete(lobby.code);
    else publishLobby(lobby);
    publishLobbyList();
  });
});

function cleanName(name) {
  return String(name || "Rider").replace(/[<>&"']/g, "").trim().slice(0, 18) || "Rider";
}

function validState(state) {
  return state && Number.isInteger(state.x) && Number.isInteger(state.y) &&
    state.x >= 0 && state.x < 40 && state.y >= 0 && state.y < 24 &&
    Number.isInteger(state.dx) && Number.isInteger(state.dy) &&
    Math.abs(state.dx) + Math.abs(state.dy) === 1;
}

const port = Number(process.env.PORT) || 3000;
server.listen(port, () => console.log(`Neon Grid multiplayer server listening on http://localhost:${port}`));
