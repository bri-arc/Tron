# Stufe 3 — Architektur

## Starten

ES-Module benötigen einen lokalen HTTP-Server. Im Repository-Hauptverzeichnis ausführen:

```sh
npx serve .
```

Danach `stufe-3-architektur/` über den ausgegebenen lokalen Host öffnen. `file://` wird nicht unterstützt.

## Komponenten und Entscheidungen

- `main.js` ist der Composition Root und erstellt genau eine `GameEngine`.
- `GameEngine` koordiniert Tick-basierte Simulation und verbindet Komponenten; fachliche Zuständigkeiten liegen in `src/`.
- `Grid`, `Arena`, `Player`, `TrailManager` und `CollisionEngine` kapseln Spiellogik und Kollisionen.
- `GameRenderer`, `UIManager`, `AudioManager`, `ScoreManager` und `ParticleSystem` kapseln Darstellung und Seiteneffekte.
- `config.js` enthält gemeinsam genutzte unveränderliche Gameplay-Konfiguration.
- ES-Module verwenden explizite Imports/Exports; es gibt keinen Build-Schritt.
- Das 2D-Canvas-Rendering und die zellbasierte Bewegung bleiben unverändert; Pause, Leben und Level werden durch die Engine ergänzt.

Die getrennte Stufenstruktur erhält die historische Stufe 1/2 unverändert und lässt jeden späteren Stand unabhängig starten.
