# Stufe 2 — Arcade

Start `index.html` directly in a modern browser. This is a dependency-free static build.

## Changes

- Start/game-over overlay, restart action, live score and survival timer.
- The fixed grid tick accelerates with survival time. Each safe cell is worth 10 points; survival time adds a final bonus.
- Best score is persisted in LocalStorage. Storage errors are reported in the console and the run remains playable.
- Web Audio API synthesizes start, scoring and crash cues; browser audio begins only after user interaction. Audio can be muted.
- Responsive HUD and neon arcade typography.

## Architecture

This is still a single-file simulation to keep the stage close to the MVP. Local-storage access is isolated behind a small adapter and generated audio is isolated in `playTone`. Stage 3 splits gameplay into explicit domain services.

## Steuerung

Pfeiltasten steuern. Enter/Space oder der Start-Button startet einen Run; der Button startet ihn auch neu.
