export class UIManager {
  constructor() {
    this.overlay = document.querySelector("#overlay");
    this.title = document.querySelector("#overlay-title");
    this.kicker = document.querySelector("#overlay-kicker");
    this.copy = document.querySelector("#overlay-copy");
    this.score = document.querySelector("#score");
    this.time = document.querySelector("#time");
    this.record = document.querySelector("#high-score");
    this.lives = document.querySelector("#lives");
    this.level = document.querySelector("#level");
    this.message = document.querySelector("#game-message");
    this.button = document.querySelector("#start-button");
  }
  render(data) {
    this.score.textContent = data.score.toString().padStart(6, "0");
    this.time.textContent = data.time;
    this.lives.textContent = String(data.lives);
    this.level.textContent = String(data.level).padStart(2, "0");
    this.record.textContent = data.record.toString().padStart(6, "0");
  }
  overlayState(kicker, title, copy, button) {
    this.kicker.textContent = kicker; this.title.textContent = title;
    this.copy.textContent = copy; this.button.textContent = button;
  }
  hideOverlay() { this.overlay.classList.add("is-hidden"); }
  showOverlay() { this.overlay.classList.remove("is-hidden"); }
}
