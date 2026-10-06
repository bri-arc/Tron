# Stufe 4 — Premium

## Architektur

Die in Stufe 3 eingeführte Engine/Manager-Aufteilung bleibt erhalten. `ParticleSystem` ist für zeitbasierte Partikel zuständig; `AudioManager` erzeugt die Synthwave-Begleitung nur nach einer bewussten Start-Eingabe. Die visuellen Kameraeffekte verändern ausschließlich den Canvas-Render-Transform, niemals Rasterpositionen oder Kollisionen. Der Loader ist eine unabhängige UI-Transition.

## Neue Effekte

- Explosionsfunken in Spielerfarbe beim Crash, Canvas-Blitz und kurzzeitiges Bildschirmwackeln.
- Animierter Ladebildschirm und verstärkte Neon-Glow-Layer.
- Prozedural erzeugte, leise Synthwave-Sequenz und weiterhin synthetisierte Spielsignale.
- Spielregeln und Raster-Kollisionen bleiben unverändert.

## Start

ES-Module benötigen einen lokalen HTTP-Server. Aus dem Repository-Hauptverzeichnis mit `npx serve .` starten und anschließend `stufe-4-premium/` öffnen. Audio startet nach dem ersten Klick auf „Run starten“ und kann oben stummgeschaltet werden.
