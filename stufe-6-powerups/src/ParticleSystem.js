export class ParticleSystem {
  constructor() { this.items = []; }
  emit(x, y, color = "#43eaff", count = 34) {
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 35 + Math.random() * 150;
      this.items.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 380 + Math.random() * 480, maxLife: 860, size: 1 + Math.random() * 3, color });
    }
  }
  update(delta) {
    this.items = this.items.filter(item => {
      item.life -= delta;
      item.x += item.vx * delta / 1000;
      item.y += item.vy * delta / 1000;
      item.vx *= .985; item.vy *= .985;
      return item.life > 0;
    });
  }
  draw(ctx) {
    ctx.save();
    for (const item of this.items) {
      ctx.globalAlpha = Math.max(0, item.life / item.maxLife);
      ctx.fillStyle = item.color; ctx.shadowColor = item.color; ctx.shadowBlur = 12;
      ctx.fillRect(item.x, item.y, item.size, item.size);
    }
    ctx.restore();
  }
}
