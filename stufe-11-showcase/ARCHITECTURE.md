# Architektur — Stufe 11

Stufe 11 übernimmt den modularen Stand aus Stufe 10 und ergänzt `AttractMode` als Zustandsadapter, der nach Inaktivität eine nicht-wertende KI-Demo startet. Eingaben verlassen die Demo und kehren zum Startbildschirm zurück; Demo-Züge ändern weder Punkte noch Rekord.

Arena-Varianten werden über `Arena.configureLevel()` erzeugt und verwenden dieselbe Blockierabfrage für Spieler und KI. `SurvivalPlanner` und `AIOpponent` beurteilen damit auch Hindernisse konsistent. `AudioManager.setIntensity()` wechselt die Musikintensität anhand der Zahl aktiver Fahrer. Das Theme wird im LocalStorage gespeichert und über CSS-Variablen sowie Fahrerpalette angewendet.

Der Composition Root bleibt `main.js`; Arena, Attract-Modus, KI, Audio und Theme-Präferenz sind getrennte Zuständigkeiten. Replay und Crash-Visualisierung bleiben optionale, vom normalen 2D-Gameplay isolierte Systeme.

Alle Simulationszüge laufen über `TurnResolver`, inklusive der Demo-Fahrer. Replay und 3D-Crash-Szene lesen dieselbe pausierbare `GameClock`; Three.js wird erst beim Crash geladen und bei Lade- oder WebGL-Fehlern zeitbegrenzt durch die 2D-Ergebnisansicht ersetzt.
