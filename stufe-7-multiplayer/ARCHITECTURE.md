# Architektur — Stufe 7

Der Browser-Multiplayer-Client liegt als `src/MultiplayerClient.js` vor und wird vom Composition Root `main.js` initialisiert. Die Socket.IO-Verbindung bleibt optional: die lokale Engine und der Singleplayer funktionieren unabhängig vom Verbindungsstatus. `server.js` kapselt Lobby, Ready-Status, Chat und Match-Synchronisierung; Clients übertragen Zustandsereignisse statt den lokalen Render-Loop zu teilen.

Netzwerkereignisse werden über Browser-Custom-Events an die Engine angebunden. So bleibt die Socket.IO-Abhängigkeit außerhalb der Domänenmodule. Lobbyfehler und Trennung betreffen die Netzwerkoberfläche und stoppen nicht den Singleplayer.

Die lokale Simulation nutzt `GameClock` auch für Spawn-Cooldowns und Power-up-Fristen. `TurnResolver` löst die Züge gleichzeitig auf, bevor Spielerzustand oder Trails verändert werden; Speed und Slow Motion steuern dabei den gemeinsamen Tick aller Fahrer.
