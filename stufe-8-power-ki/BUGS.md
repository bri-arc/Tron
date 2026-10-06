# BUGS — Stufe 8: Power KI

| Nr. | Beschreibung | Schritte zur Reproduktion | Erwartetes Verhalten | Tatsächliches Verhalten | Behoben in Stufe |
|---|---|---|---|---|---|
| 1 | Flood-fill wertet eine aktuelle Belegung aus und plant nicht über mehrere künftige Gegnerzüge. | Expert Survival in sehr dichtem Grid beobachten. | KI kann Gegnerhandlungen vollständig antizipieren. | Die Flächen- und Voronoi-Bewertung ist eine Ein-Zug-Heuristik; Ergebnisse bleiben reaktiv. | — |
