export class GameRenderer {
  constructor(engine) {
    this.engine = engine;
  }

  render() {
    const engine = this.engine;
    const cellWidth = engine.canvas.width / engine.grid.columns;
    const cellHeight = engine.canvas.height / engine.grid.rows;

    engine.ctx.clearRect(0, 0, engine.canvas.width, engine.canvas.height);
    engine.ctx.fillStyle = "#03070b";
    engine.ctx.fillRect(0, 0, engine.canvas.width, engine.canvas.height);
    engine.ctx.strokeStyle = "rgba(38,129,151,.21)";
    engine.ctx.lineWidth = 1;
    engine.ctx.beginPath();

    for (let x = 0; x <= engine.grid.columns; x += 1) {
      engine.ctx.moveTo(x * cellWidth + .5, 0);
      engine.ctx.lineTo(x * cellWidth + .5, engine.canvas.height);
    }
    for (let y = 0; y <= engine.grid.rows; y += 1) {
      engine.ctx.moveTo(0, y * cellHeight + .5);
      engine.ctx.lineTo(engine.canvas.width, y * cellHeight + .5);
    }
    engine.ctx.stroke();

    engine.ctx.save();
    engine.ctx.lineCap = "round";
    engine.ctx.lineJoin = "round";
    engine.ctx.strokeStyle = "rgba(25,203,239,.78)";
    engine.ctx.lineWidth = Math.min(cellWidth, cellHeight) * .48;
    engine.ctx.shadowColor = "#20dbff";
    engine.ctx.shadowBlur = 15;
    engine.ctx.beginPath();
    engine.trails.points.forEach((cell, index) => {
      const point = engine.grid.center(cell.x, cell.y, engine.canvas.width, engine.canvas.height);
      if (index === 0) engine.ctx.moveTo(point.x, point.y);
      else engine.ctx.lineTo(point.x, point.y);
    });
    engine.ctx.stroke();
    engine.ctx.restore();

    if (!engine.player) return;
    const radius = Math.min(cellWidth, cellHeight) * .34;
    const point = engine.grid.center(engine.player.x, engine.player.y, engine.canvas.width, engine.canvas.height);
    engine.ctx.save();
    engine.ctx.translate(point.x, point.y);
    engine.ctx.rotate(Math.atan2(engine.player.direction.y, engine.player.direction.x));
    engine.ctx.fillStyle = "#d8fcff";
    engine.ctx.shadowColor = engine.player.color;
    engine.ctx.shadowBlur = 20;
    engine.ctx.beginPath();
    engine.ctx.moveTo(radius * 1.4, 0);
    engine.ctx.lineTo(-radius, -radius * .8);
    engine.ctx.lineTo(-radius * .65, 0);
    engine.ctx.lineTo(-radius, radius * .8);
    engine.ctx.closePath();
    engine.ctx.fill();
    engine.ctx.restore();
  }
}
