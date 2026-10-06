# Architektur — Stufe 3

`main.js` startet die `GameEngine`. Die Engine besitzt den Simulationszustand und erstellt derzeit selbst fachlich abgegrenzte Module aus `src/`: `Grid`, `Arena`, `Player`, `TrailManager`, `CollisionEngine`, `ScoreManager`, `AudioManager`, `UIManager`, `GameRenderer` und `ParticleSystem`. Damit ist `main.js` noch kein vollständiger Composition Root.

`CollisionEngine`, `Grid` und `GameClock` enthalten DOM-freie Logik und sind unter Node testbar. Die Simulationsregeln bleiben grid- und tickbasiert. `GameEngine` bindet aber noch DOM, Canvas und `requestAnimationFrame` direkt ein; deshalb ist die vollständige Engine aktuell nicht unter Node testbar. Rendering und DOM-Updates sind zumindest von der Kollisionserkennung getrennt. `config.js` enthält Taktung, Raster, Steuerung und Balancing-Werte.

Die Entkopplung der Engine und die ausschließliche Abhängigkeitskomposition in `main.js` bleiben bekannte Architekturarbeiten für eine spätere Refactoring-Stufe. Der Browser benötigt keinen Bundler, aber einen lokalen HTTP-Server für ES-Module.

Der Stand ist eigenständig und wurde aus Stufe 2 abgeleitet. Spätere Stufen kopieren diesen Stand und ergänzen neue Komponenten, statt Historienstände zu überschreiben.
