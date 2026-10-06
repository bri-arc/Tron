# Architektur — Stufe 4

Die Premium-Stufe baut auf den Modulen aus Stufe 3 auf. `GameEngine` koordiniert den Ablauf; `GameRenderer` zeichnet Canvas-Effekte, `ParticleSystem` verwaltet Partikel, `AudioManager` kapselt Web Audio und `UIManager` hält DOM-Interaktionen vom Gameplay fern.

Die visuellen Effekte sind Darstellungszustand und ändern weder Grid-Kollisionen noch Tick-Bewegung. Die Synthwave-/Effekt-Audioausgabe wird clientseitig erzeugt. `config.js` bleibt der zentrale Ort für gemeinsame Gameplay-Werte.

Der aktuelle Renderer nutzt Canvas-Glow; eine separate `mix-blend-mode: screen`-Ebene und die strikte Farbtrennung Cyan (aktiv/sicher) versus Orange (Gefahr/Kollision) sind in diesem Stand noch nicht umgesetzt.

Der Browser lädt `main.js` als ES-Modul; jede Stufe bleibt in ihrem eigenen Verzeichnis start- und vergleichbar.
