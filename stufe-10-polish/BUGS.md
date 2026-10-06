# BUGS — Stufe 10: Polish & Wow

| Nr. | Beschreibung | Schritte zur Reproduktion | Erwartetes Verhalten | Tatsächliches Verhalten | Behoben in Stufe |
|---|---|---|---|---|---|
| 1 | Multiplayer-Matches sind nicht serverautoritativ. | Multiplayer-Lobby hosten und Bewegungsereignisse manipulieren. | Server validiert die vollständige Runde einschließlich Kollisionen. | Server synchronisiert Zustände und Power-up-Ereignisse, die Spielsimulation bleibt clientseitig. | — |
| 2 | Die 3D-Crash-Szene benötigt CDN-Verbindung und WebGL. | Internet oder WebGL deaktivieren und einen Run beenden. | Cinematische 3D-Szene erscheint. | Das 2D-Spiel bleibt verfügbar; bei fehlendem Three.js wird die Crash-Szene übersprungen. | — |
