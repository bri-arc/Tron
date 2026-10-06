# Stufe 10 — Polish & Wow

## Starten

Im Verzeichnis `stufe-10-polish` `npm install` und `npm start` ausführen. Der Express-Server stellt die Anwendung unter `http://localhost:3000` bereit.

## Architekturentscheidungen

- Replay-State versetzt die Engine in einen pausierten Zustand. `ReplayManager` zeichnet ein zentriertes Overlay mit halber Wiedergabegeschwindigkeit; Escape, Enter oder Leertaste überspringt die Wiederholung. Danach folgt bei einem Spielende Ergebnis/Neustart.
- Replay, 2D-Hauptansicht und 3D-Crash-Szene verwenden Cycle-Sprites, die versetzte zweite Trail-Linie als Lichtwand sowie zeitbasiertes Derezzing.
- `TrailManager` behält Kollisionszellen, während der Renderer die Darstellung über 1,4 Sekunden vom hinteren Ende her derezzed. Renderingseffekte ändern keine Kollisionsgeometrie.
- Die Lichtwand wird als versetzte 2D-Render-Layer gezeichnet; Cycle-Sprite-Lean, Sparks, Shockwave und Screen-Shake sind ebenfalls Präsentationszustände.
- Near-Miss wird nur für den menschlichen Spieler gewertet, über eine Cooldown-/Combo-Grenze entprellt und triggert kurze globale Zeitlupe.
- Gamepad-Achsen/D-Pad werden als Richtungsereignisse gepollt. Web Audio Motor-Tonhöhe folgt der Tickrate; Fahrer werden per Stereo-Panning im Grid positioniert. Der bestehende Mute-Schalter schaltet auch die Motoren stumm.
- Last Cycle Standing beendet den Run, sobald höchstens ein Rider lebt.

## Steuerung

Pfeiltasten oder Gamepad. `P` pausiert; im Replay überspringen Escape/Enter/Leertaste.
