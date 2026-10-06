# Architektur — Stufe 1: MVP

Diese historische MVP-Stufe verwendet ausschließlich HTML, CSS, Vanilla JavaScript und Canvas. `game.js` kapselt Eingabe, feste Tick-Simulation, Zellbelegung, Kollisionen und Zeichnung gemeinsam, damit der kleinstmögliche spielbare Kern ohne Menü- oder Audio-System nachvollziehbar bleibt.

Die Spiellogik arbeitet auf einem festen 40 × 24-Raster. `requestAnimationFrame` plus Zeitakkumulator entkoppelt den Simulations-Tick von der Bildrate. Die belegten Zellen sind zugleich Kollisionsgrundlage und verhindern, dass Bildschirmauflösung Gameplay-Regeln verändert.
