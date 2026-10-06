# Stufe 5 — KI-Gegner

## Starten

Vom Repository-Hauptverzeichnis `npx serve .` ausführen und `stufe-5-ki/` über den lokalen HTTP-Server öffnen. ES-Module können nicht per `file://` geladen werden.

## Architektur

`AIOpponent` reuses `Player` movement state while selecting only non-reversing legal moves. `TrailManager` stores occupancy separately from per-rider paths, allowing every cycle to retain its own neon color and collision footprint. Difficulty changes risk/target preferences; all decisions are local and deterministic apart from the explicitly unpredictable Easy tie-break.

## Neue Features

- Drei Gegner mit unterschiedlichen Neonfarben und je eigener Spur.
- Easy (gelegentliche suboptimale Abzweigung), Standard (freier Raum bevorzugen) und Aggressiv (bei gleicher Sicherheit zum nächsten Fahrer tendieren).
- Survival, Last Cycle Standing und 90-Sekunden-Time-Attack über das Startmenü.
- Der Single-player-Pilot und die Stage-3-Pause/Leben bleiben erhalten.

## Einschränkung

Die Gegner sind regelbasierte Heuristiken und keine trainierten Agenten. Eine kollisionsreiche Arena kann ihre Entscheidungen überlisten; Flood-fill und Voronoi-Scoring folgen separat in Stufe 8.
