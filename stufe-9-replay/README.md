# Stufe 9 — Replay- und Crash-System

## Starten

Im Verzeichnis `stufe-9-replay` `npm install` und `npm start` ausführen. Der Express-Server stellt die Anwendung unter `http://localhost:3000` bereit.

## Architektur

- `ReplayBuffer` hält pro Render-Frame bis zu fünf Sekunden Cycle-Positionen, Richtung, Trail, Power-up und Spielstatus.
- `EventSystem` entkoppelt Crash-Erkennung von der Crash-Visualisierung.
- `CameraManager` bestimmt den fokussierten Rider; `ReplayManager` spielt die letzten drei Sekunden mit halber Geschwindigkeit im TV-Inset ab.
- `CrashManager` startet Rider-Replays. Gegner-Replays laufen als kleines Fenster weiter, während das Hauptspiel aktiv ist.
- `src/CrashScene.js` erzeugt nach dem Ausscheiden eine separate Three.js-Szene mit Neon-Raster, Trails, Cycles und einer animierten Explosionsgeometrie. Das normale Gameplay bleibt Canvas-2D. Ohne WebGL/Three.js bleibt das 2D-Ergebnis erhalten.

## Betrieb

Multiplayer-Lobby und Serverstart entsprechen Stufe 7. Three.js wird für die separate Crash-Szene über cdnjs geladen; zum Betrieb der Szene ist Internetzugriff erforderlich. Singleplayer und das 2D-Spiel benötigen diese Bibliothek nicht. Spielmodule sind ES-Module; die Seite über den lokalen Express-Server starten.
