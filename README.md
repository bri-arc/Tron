# Tron - Neon Grid

Ein modernes Browser-Arcade-Spiel, entwickelt als chronologische Reihe aus elf eigenständig startbaren Stufen. Die Startseite `index.html` verlinkt alle Versionen; jede Stufe enthält eigene Architektur- und Bug-Dokumentation.

## Spielen

Im Repository-Root einen statischen Webserver starten, zum Beispiel:

```sh
npx serve .
```

Anschließend die angezeigte lokale URL öffnen und eine Stufe auf der Übersichtsseite wählen. ES-Module benötigen einen HTTP-Server; `file://` ist nicht ausreichend.

## Multiplayer-Prototyp

Die Multiplayer-Server befinden sich in den Stufen 7 bis 11. Im jeweiligen Stufenverzeichnis:

```sh
npm install
npm start
```

Danach `http://localhost:3000` öffnen. Multiplayer ist ein lokaler Prototyp und noch keine produktionsreife, serverautoritative Plattform.

## Tests

Die Node-Tests jeder modularen Stufe können aus dem Repository-Root gemeinsam ausgeführt werden:

```sh
node --test
```

Die Stufen 3 bis 11 haben separate, eigenständig lauffähige Testverzeichnisse. Historische Stufen 1 und 2 behalten ihren ursprünglichen Vanilla-JavaScript-Aufbau.
