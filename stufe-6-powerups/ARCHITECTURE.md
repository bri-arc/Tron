# Architektur — Stufe 6

`PowerUpManager` verantwortet Spawn-Timing, freie Spawnzellen, Seltenheiten und Zeichnung der Items. `GameEngine` verarbeitet den Pickup und wendet den Effekt auf den Spielerzustand an; `GameRenderer` stellt Fahrer, Arena und Trails dar. Die Grid-Positionen der Items sind damit dieselben Zellen, die auch für Kollisionen gelten.

Neue Power-up-Arten werden über Definitionen und Engine-Effektbehandlung ergänzt. `AudioManager` und UI bleiben gekapselt; die KI- und Kollisionsmodule werden nicht mit Spawnlogik gekoppelt.

`GameClock` liefert die pausierbare Zeitbasis für Spawn-Cooldowns und Effektfristen. `TurnResolver` entscheidet für alle Fahrer vor dem Commit; Ghost umgeht nur Trail-Kollisionen. `PowerUpEffects` hält die Effektregeln aus der Engine heraus. Trail-Löschung behält die besetzte Kopfzelle, während die Bombe alle lebenden Fahrerköpfe schützt und nur Trail-Zellen entfernt.
