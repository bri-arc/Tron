# Architektur — Stufe 8

`SurvivalPlanner` bewertet erreichbare freie Zellen und Voronoi-Reichweite innerhalb der Arena. `AIOpponent` nutzt ihn nur für die zusätzliche Expert-Schwierigkeit; bisherige Schwierigkeitsstufen behalten ihre vorhandene Bewertungsroutine. Der Planner konsumiert die bestehenden Grid-, Arena- und Trail-Schnittstellen, bleibt unabhängig von DOM, Audio und Rendering.

Die Suche ist synchron und pro KI-Zug begrenzt auf die aktuelle Arena. Bei Erweiterung der Spielfeldgröße sollte die Sucharbeit profiliert und gegebenenfalls budgetiert werden.

`TurnResolver` übernimmt die gemeinsamen Richtungsentscheidungen und die Kollisionen gleicher Zielzellen. `GameClock` ist Zeitquelle für Simulation, Effektdauer und Power-up-Cooldowns; die KI selbst bleibt deterministisch gegenüber dem übergebenen Arena- und Trailzustand.
