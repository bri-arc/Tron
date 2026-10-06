# Architektur — Stufe 2: Arcade

Stufe 2 behält die einzelne `game.js`-Simulation aus dem MVP bewusst bei, um die Arcade-Erweiterung als eigenständigen historischen Stand zu erhalten. Die Datei koordiniert den Spielzustand, Eingabe, feste Grid-Ticks, Wertung, LocalStorage und Canvas-Rendering; die Audio-Synthese nutzt Web Audio nach erster Benutzerinteraktion.

Highscore-Zugriffe sind gegen nicht verfügbare Browser-Speicherung abgesichert. Das Ende einer Runde, Neustart und Arcade-UI sind DOM-Overlays; Bewegung und Kollisionen bleiben zellbasiert. Die Aufteilung in fachliche ES-Module beginnt in Stufe 3.
