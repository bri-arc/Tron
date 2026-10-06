# Architektur — Stufe 10

Stufe 10 ergänzt den gemeinsamen Renderer um kontinuierliche Trail-Linien, Lightcycle-Formen und Derezz-Zustände. `NearMissManager` kapselt die Erkennung und Wertung knapper Vorbeifahrten; `GamepadController` kapselt die Gamepad API. Die Engine koordiniert diese Module, ohne die zellbasierte Kollisionsdomäne aufzugeben.

Crash-Replays pausieren den Simulationszustand und werden über `ReplayManager` separat gezeichnet. Die 3D-Crash-Ansicht bleibt ein isolierter Adapter. Audioeffekte und die Mute-Oberfläche sind in `AudioManager` bzw. `UIManager` gekapselt.

`TurnResolver` hält die gemeinsame Zugauflösung auch mit Ghost- und Schild-Effekten konsistent. Replay-Überspringen und Wiedergabe verwenden dieselbe pausierbare `GameClock`; Drei-Sekunden-Replays verändern nicht die eigentliche Simulation.
