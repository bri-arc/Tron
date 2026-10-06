# Architektur — Stufe 9

`ReplayBuffer` speichert zeitlich begrenzte Snapshots; `EventSystem` verteilt Crash-Ereignisse; `CameraManager` berechnet den Fokus; `ReplayManager` rendert die Wiederholung in ein separates Canvas; `CrashManager` verbindet Ereignis und Wiedergabe. `CrashScene.js` kapselt die optionale Three.js-Inszenierung und wird im Composition Root initialisiert.

Replaydaten sind unveränderliche Momentaufnahmen und beeinflussen den normalen 2D-Simulationszustand nicht. Multiplayer bleibt ein optionaler Adapter außerhalb des Gameplay-Kerns. Three.js wird nur für die Crash-Ansicht benötigt; das Hauptspiel bleibt Canvas-2D.

`GameClock` treibt Replayfortschritt und Spielzeit. Three.js wird bei Bedarf geladen und Renderer-/WebGL-Fehler fallen auf das 2D-Ergebnis zurück; ein Watchdog blendet die Crash-Ansicht unabhängig von der Szene aus. `TurnResolver` löst Fahrerbewegungen vor dem Zustands-Commit gemeinsam auf.
