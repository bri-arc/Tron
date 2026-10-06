# Stufe 8 — Power KI

## Starten

Für Singleplayer vom Repository-Hauptverzeichnis `npx serve .` ausführen und `stufe-8-power-ki/` öffnen. Für Multiplayer im Stufenverzeichnis `npm install` und `npm start` ausführen.

## Architektur

`SurvivalPlanner` ist ein zusätzliches, seiteneffektfreies Bewertungsmodul. Es führt pro möglichem Zug eine Flood-fill/BFS-Flächensuche auf dem aktuellen freien Raster aus. Eine zweite Distanzkarte je Gegner bewertet per Voronoi, welche freien Zellen die KI vor anderen Fahrern erreichen kann. Arena-Hindernisse und alle Trails werden als blockierte Zellen berücksichtigt.

## Neue Schwierigkeit

Im Menü steht zusätzlich „Expert Survival ★“ zur Verfügung. Easy, Standard und Aggressiv behalten ihre Heuristiken aus Stufe 5; die Expert-Auswertung wird nur für diese neue Auswahl genutzt.

Die Lobby-Browser- und Power-up-Event-Synchronisierung aus Stufe 7 bleibt als optionale Netzwerkschicht erhalten.
