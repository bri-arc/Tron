# BUGS — Stufe 7: Multiplayer

| Nr. | Beschreibung | Schritte zur Reproduktion | Erwartetes Verhalten | Tatsächliches Verhalten | Behoben in Stufe |
|---|---|---|---|---|---|
| 1 | Spielsimulation ist clientautoritativ. | Zwei Browser verbinden und manipulierte Clientdaten senden. | Server weist unmögliche Bewegungen und Kollisionen zurück. | Serverseitige Feldvalidierung prüft Datentyp und Grid-Grenzen, führt aber keine vollständige Match-Simulation aus. | — |
