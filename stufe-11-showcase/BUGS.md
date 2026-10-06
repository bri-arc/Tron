# BUGS — Stufe 11: Showcase

| Nr. | Beschreibung | Schritte zur Reproduktion | Erwartetes Verhalten | Tatsächliches Verhalten | Behoben in Stufe |
|---|---|---|---|---|---|
| 1 | Multiplayer-Matches werden nicht serverautoritativ simuliert. | Lobby hosten und mit mehreren Clients fahren. | Server validiert Turns, Kollisionen und Power-ups für alle Clients. | Server synchronisiert Positionen/Power-up-Ereignisse, der Spielclient bleibt für die Simulation maßgeblich. | — |
| 2 | Die separate Crash-Szene lädt Three.js von cdnjs. | Internetzugriff oder WebGL deaktivieren und Run beenden. | 3D-Crash-Szene wird vollständig angezeigt. | 2D-Ergebnis bleibt erhalten; Three.js-Fallback wird angezeigt. | — |
