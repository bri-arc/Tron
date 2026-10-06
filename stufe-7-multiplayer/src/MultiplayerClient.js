export function initMultiplayer() {

  const status = document.querySelector("#connection-status");
  const hostButton = document.querySelector("#host-game");
  const joinButton = document.querySelector("#join-game");
  const readyButton = document.querySelector("#ready-toggle");
  const startMatchButton = document.querySelector("#start-match");
  const chatButton = document.querySelector("#chat-toggle");
  const details = document.querySelector("#lobby-details");
  const lobbyBrowser = document.querySelector("#lobby-browser");
  const playerList = document.querySelector("#player-list");
  const codeInput = document.querySelector("#lobby-code");
  const chatPanel = document.querySelector("#chat-panel");
  const messages = document.querySelector("#chat-messages");
  let socket = null;
  let ready = false;

  function showStatus(text) { status.textContent = text; }
  function connect() {
    if (socket?.connected) return socket;
    if (typeof window.io !== "function") {
      showStatus("SERVER NICHT ERREICHBAR · SOLO SPIELBAR");
      return null;
    }
    socket ??= window.io({ reconnection: true, timeout: 5000 });
    socket.on("connect", () => showStatus("VERBUNDEN · LOBBY WÄHLEN"));
    socket.on("disconnect", () => showStatus("VERBINDUNG GETRENNT · RECONNECT…"));
    socket.on("connection:status", () => showStatus("VERBUNDEN · LOBBY WÄHLEN"));
    socket.on("lobby:players", payload => {
      codeInput.value = payload.code;
      details.hidden = false;
      playerList.textContent = `LOBBY ${payload.code} · ${payload.players.map(player => `${player.name}${player.ready ? " ✓" : ""}`).join(" / ")}`;
      readyButton.disabled = false;
      startMatchButton.disabled = payload.players.length < 2 || payload.players.some(player => !player.ready);
      chatButton.disabled = false;
    });
    socket.on("lobby:list", lobbies => {
      lobbyBrowser.replaceChildren();
      if (!lobbies.length) {
        const empty = document.createElement("span");
        empty.textContent = "KEINE OFFENEN LOBBYS";
        lobbyBrowser.append(empty);
        return;
      }
      for (const lobby of lobbies) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = `${lobby.code} · ${lobby.players}/8`;
        button.addEventListener("click", () => {
          codeInput.value = lobby.code;
          requestLobby("lobby:join", { name: "Rider", code: lobby.code });
        });
        lobbyBrowser.append(button);
      }
    });
    socket.on("game:state", state => window.dispatchEvent(new CustomEvent("ng:remote-state", { detail: state })));
    socket.on("powerup:sync", payload => window.dispatchEvent(new CustomEvent("ng:remote-powerup", { detail: payload })));
    socket.on("game:start", () => window.dispatchEvent(new Event("ng:multiplayer-start")));
    socket.on("chat:message", payload => {
      const item = document.createElement("li");
      item.textContent = `${payload.name}: ${payload.message}`;
      messages.append(item);
      messages.scrollTop = messages.scrollHeight;
    });
    window.addEventListener("ng:local-state", event => socket.emit("game:state", event.detail));
    window.addEventListener("ng:local-powerup", event => socket.emit("powerup:sync", event.detail));
    window.addEventListener("ng:multiplayer-start", () => document.querySelector("#start-button").click());
    return socket;
  }

  function requestLobby(eventName, payload) {
    const activeSocket = connect();
    if (!activeSocket) return;
    activeSocket.emit(eventName, payload, reply => {
      if (!reply?.ok) showStatus(reply?.error ?? "LOBBY-AKTION FEHLGESCHLAGEN");
      else showStatus(`LOBBY ${reply.code} · READY-WAITING`);
    });
  }

  hostButton.addEventListener("click", () => requestLobby("lobby:create", { name: "Rider" }));
  document.querySelector("#lobby-browser-toggle").addEventListener("click", () => {
    lobbyBrowser.hidden = !lobbyBrowser.hidden;
    if (!lobbyBrowser.hidden) connect()?.emit("lobby:list");
  });
  joinButton.addEventListener("click", () => requestLobby("lobby:join", { name: "Rider", code: codeInput.value }));
  readyButton.addEventListener("click", () => {
    ready = !ready;
    const activeSocket = connect();
    activeSocket?.emit("lobby:ready", ready, reply => {
      if (reply?.ok) readyButton.textContent = ready ? "NOT READY" : "READY";
      else showStatus(reply?.error ?? "READY FEHLGESCHLAGEN");
    });
  });
  startMatchButton.addEventListener("click", () => {
    connect()?.emit("game:start", reply => {
      if (!reply?.ok) showStatus(reply?.error ?? "MATCH-START FEHLGESCHLAGEN");
    });
  });
  chatButton.addEventListener("click", () => { chatPanel.hidden = !chatPanel.hidden; });
  document.querySelector("#chat-form").addEventListener("submit", event => {
    event.preventDefault();
    const input = document.querySelector("#chat-input");
    if (input.value.trim()) socket?.emit("chat:message", { message: input.value });
    input.value = "";
  });
}
