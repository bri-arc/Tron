# Stufe 6 — Power-ups

## Starten

Vom Repository-Hauptverzeichnis `npx serve .` ausführen und `stufe-6-powerups/` über den lokalen HTTP-Server öffnen. ES-Module können nicht per `file://` geladen werden.

## Architekturentscheidungen

`PowerUpManager` verwaltet Spawn-Zeitpunkte, Seltenheitsgewichte, legale freie Zellen und Darstellung; `GameEngine.applyPowerup` aktiviert typisierte Effekte. Damit bleiben temporäre Zustände von der Bewegungs- und Kollisionsdomäne getrennt. Globale Geschwindigkeitsmodifikatoren betreffen die gesamte Simulation, sodass der Tick nicht zwischen Fahrern auseinanderläuft.

## Inhalt

Speed Boost, Slow Motion, Shield, Trail Erase, Ghost Mode, Grid Bomb und 2× Multiplikator. Das Statusfeld zeigt aktive Buffs, den Spawn-Cooldown oder den aktuellen Pickup. Seltene Effekte haben bewusst geringere Spawn-Gewichte.

## Einschränkung

Power-ups werden automatisiert durch Überfahren aufgenommen. „Grid Bomb“ eliminiert nahe KI-Fahrer und löscht deren Spur; sie wirkt nicht auf den menschlichen Cycle.
