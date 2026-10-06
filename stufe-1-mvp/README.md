# Stufe 1 — MVP

## Starten

`index.html` direkt in einem modernen Browser öffnen. Es werden weder ein Build-Schritt noch externe Bibliotheken benötigt.

## Architekturentscheidungen

- Die Stufe ist ein eigenständig lauffähiger statischer Stand mit HTML, CSS und Vanilla JavaScript. Damit bleibt sie unabhängig vom Node-Projektgerüst.
- Das Spielfeld verwendet ein festes logisches Raster von 40 × 24 Zellen. Rendering und Bildschirmgröße beeinflussen weder Tick-Bewegung noch Kollisionsregeln.
- `game.js` enthält in dieser MVP-Stufe den Spielzustand, die Eingabeverarbeitung, Simulation und Canvas-Zeichnung. Die Spielregeln bleiben dadurch nachvollziehbar; eine Aufteilung in Engine- und Manager-Komponenten folgt erst mit der Architektur-Stufe.
- Die belegten Rasterzellen werden als `Set` gespeichert. Wand- und Spur-Kollisionen prüfen dieselben ganzzahligen Zellen wie die Bewegung.
- Der Haupt-Tick wird von `requestAnimationFrame` getaktet; ein Akkumulator hält die Bewegung unabhängig von der Bildrate auf einem festen Raster-Takt.
- Das Hauptverzeichnis ist das Entwicklungsarchiv. Jede Stufe erhält einen eigenen, direkt spielbaren Ordner sowie eine eigene `BUGS.md`; spätere Stufen sollen aus dem vorherigen Stand hervorgehen.

## Steuerung

Pfeiltasten zum Lenken. Eine direkte 180°-Wende wird ignoriert. Nach einem Crash startet `R` die Runde neu.
