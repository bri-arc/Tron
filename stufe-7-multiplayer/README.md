# Stufe 7 — Multiplayer

## Start

Im Ordner `stufe-7-multiplayer` `npm install` und anschließend `npm start` ausführen. Die App läuft auf `http://localhost:3000` (oder `PORT`). Einzelspieler bleibt ohne Lobby-Auswahl spielbar.

## Architektur

`server.js` hält Lobby-Mitgliedschaft und Ready-Zustand, stellt wartende Lobbys für den Browser bereit, prüft Spielfeld-Koordinaten und Richtungsvektoren und verteilt flüchtige Positionsupdates, Power-up-Spawn/Pickup-Ereignisse und Chat. `src/MultiplayerClient.js` ist eine optionale Socket.IO-Transport-Integration, die `main.js` initialisiert; die Spielsimulation bleibt im Canvas-Client. Lobby-Codes sind kurzlebige In-Memory-Räume und werden gelöscht, sobald der letzte Socket die Lobby verlässt.

## Einschränkung

Dies ist ein lokaler Netzwerk-Prototyp: Es gibt weder persistente Accounts noch serverautoritative Kollisionen/Matchmaking, Rate-Limits oder Produktionsbetrieb. Für echtes öffentliches Matchmaking ist eine serverautoritative Simulationsinstanz erforderlich.
