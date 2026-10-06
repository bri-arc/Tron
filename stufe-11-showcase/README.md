# Stufe 11 — Showcase

## Architekturentscheidungen

- Die Attract-Demo verwendet dieselben Rider-, Grid- und Trail-Objekte wie ein Run. `isDemo` sperrt Score-, Power-up- und Highscore-Schreibpfade; jede Benutzereingabe bricht die Demo ab.
- `Arena.configureLevel` erzeugt abwechselnd Hindernisreihen und engere Randzonen. Kollisionsprüfung und alle KI-Planer fragen dieselbe `Arena`-Abstraktion ab.
- `AudioManager.setIntensity` wechselt bei weniger lebenden Fahrern das Tempo der Synth-Sequenz. Die Musik bleibt prozedural und benötigt keine externen Audiodateien.
- `setTheme` lädt und speichert `classic`/`bugs` in LocalStorage und setzt CSS- sowie Cycle-Farbpaletten zentral.
- Einzelspieler läuft weiterhin ohne Socket-Verbindung. Die Multiplayer-Lobby bleibt als optionaler Transport aus Stufe 7 vorhanden.
- Lobby-Browser und Power-up-Spawn/Pickup-Nachrichten werden über den optionalen Server mit späteren Stufen weitergereicht; autoritatives Multiplayer-Matchmaking bleibt ein bekanntes offenes Thema.

## Run / Multiplayer

Für Singleplayer vom Repository-Hauptverzeichnis `npx serve .` ausführen und `stufe-11-showcase/` öffnen. Für Multiplayer im Stufenordner `npm install` und `npm start`; danach über `http://localhost:3000` zugreifen.
