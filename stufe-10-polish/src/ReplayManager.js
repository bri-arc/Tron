export class ReplayManager {
  constructor(buffer, canvas, monitor, camera) {
    this.buffer = buffer; this.canvas = canvas; this.monitor = monitor;
    this.camera = camera;
    this.context = canvas.getContext("2d"); this.frames = []; this.startedAt = 0; this.active = false; this.focusId = "player";
    this.onComplete = () => {};
  }
  start(focusId, now) {
    if (this.active) return false;
    this.frames = this.buffer.recent(3000);
    if (this.frames.length < 2) return false;
    this.focusId = focusId; this.startedAt = now; this.active = true; this.monitor.hidden = false;
    return true;
  }
  skip(now) {
    if (!this.active) return;
    this.active = false;
    this.monitor.hidden = true;
    this.onComplete(now);
  }
  draw(now) {
    if (!this.active) return;
    const sourceDuration = Math.max(1, this.frames.at(-1).time - this.frames[0].time);
    const playbackProgress = Math.min(1, (now - this.startedAt) / 2 / sourceDuration);
    const index = Math.min(this.frames.length - 1, Math.floor(playbackProgress * (this.frames.length - 1)));
    const frame = this.frames[index];
    if (!frame) return;
    const ctx = this.context, cw = this.canvas.width / 40, ch = this.canvas.height / 24;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "#03070b"; ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const focused = this.camera.focus(frame, this.focusId);
    const offsetX = focused ? this.canvas.width / 2 - (focused.x + .5) * cw : 0;
    const offsetY = focused ? this.canvas.height / 2 - (focused.y + .5) * ch : 0;
    ctx.save(); ctx.translate(offsetX, offsetY);
    for (const trail of frame.trails) {
      const first = trail.derezzAt === null ? 0 : Math.min(trail.cells.length,
        Math.floor(trail.cells.length * Math.max(0, frame.time - trail.derezzAt) / 1400));
      const cells = trail.cells.slice(first);
      ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.strokeStyle = `${trail.color}88`; ctx.shadowBlur = 0; ctx.lineWidth = Math.min(cw, ch) * .62; ctx.beginPath();
      cells.forEach((cell, i) => {
        const x = (cell.x + .5) * cw, y = (cell.y + .5) * ch;
        if (!i) ctx.moveTo(x + 1, y + 3); else ctx.lineTo(x + 1, y + 3);
      });
      ctx.stroke();
      ctx.strokeStyle = trail.color; ctx.shadowColor = trail.color; ctx.shadowBlur = 7;
      ctx.lineWidth = Math.min(cw, ch) * .4; ctx.beginPath();
      cells.forEach((cell, i) => {
        const x = (cell.x + .5) * cw, y = (cell.y + .5) * ch;
        if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke(); ctx.restore();
    }
    for (const rider of frame.riders) {
      ctx.save(); ctx.translate((rider.x + .5) * cw, (rider.y + .5) * ch);
      ctx.rotate(Math.atan2(rider.dy, rider.dx));
      ctx.fillStyle = "#d8fcff"; ctx.shadowColor = rider.color; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.moveTo(cw * .48, 0); ctx.lineTo(-cw * .35, -ch * .3);
      ctx.lineTo(-cw * .22, 0); ctx.lineTo(-cw * .35, ch * .3); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    if (frame.powerup) {
      ctx.fillStyle = frame.powerup.color;
      ctx.beginPath(); ctx.arc((frame.powerup.x + .5) * cw, (frame.powerup.y + .5) * ch, 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    if ((now - this.startedAt) / 2 >= sourceDuration) {
      this.active = false; this.monitor.hidden = true; this.onComplete(now);
    }
  }
}
