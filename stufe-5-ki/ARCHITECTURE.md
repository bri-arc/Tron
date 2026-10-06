# Architektur — Stufe 5

`AIOpponent` kapselt Richtungswahl und Schwierigkeitsverhalten und nutzt dieselben `Arena`, `TrailManager` und `CollisionEngine`-Verträge wie der menschliche Fahrer. Damit gibt es keine separate, abweichende Kollisionswelt für die KI. `TurnResolver` sammelt zunächst alle Richtungsentscheidungen und `MovementResolver` wertet die Zielzellen gemeinsam aus; erst danach schreibt `GameEngine` Fahrerpositionen und Spuren. Gleichzeitige Zielkollisionen und Kopf-an-Kopf-Tauschbewegungen scheiden beide Fahrer aus.

`GameClock` ist die pausierbare Zeitquelle für Simulation, Effekte und Modusdauer. Modi und Schwierigkeitswahl bleiben an der UI-Konfiguration angebunden. Die KI ist als eigenes Modul isoliert, sodass spätere Planner-Strategien ergänzt werden können, ohne Rendering oder Spielersteuerung zu verändern.
