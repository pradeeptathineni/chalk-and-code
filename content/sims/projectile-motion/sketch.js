// Projectile motion: two independent motions glued together.
// Sideways: no force, so vx stays constant.  Up/down: gravity, so vy changes by g every second.
// Optional air drag (linear, F = -k v) shows why real balls fall short of the ideal path.

const WORLD_W = 60; // metres shown across
let speed, angle, gravity, height, drag;
let showComponents, showGhosts;
let ball = null; // {x, y, vx, vy, t, path: []}
let ghosts = []; // earlier paths, kept faintly for comparison
let peak = null;
let landed = null;
let readouts;

new p5((p) => {
  let stage;
  let scale; // pixels per metre

  p.setup = () => {
    stage = document.getElementById("stage");
    p.createCanvas(960, 540).parent(stage);
    SimKit.fit(p, stage, 16 / 9);
    p.textFont("Helvetica, Arial, sans-serif");

    const controls = document.getElementById("controls");
    speed = SimKit.slider(controls, { label: "Launch speed", min: 5, max: 30, step: 0.5, value: 18, unit: "m/s" });
    angle = SimKit.slider(controls, { label: "Launch angle", min: 0, max: 90, step: 1, value: 45, unit: "°", digits: 0 });
    height = SimKit.slider(controls, { label: "Launch height", min: 0, max: 20, step: 0.5, value: 0, unit: "m" });
    gravity = SimKit.slider(controls, { label: "Gravity g", min: 1.6, max: 24.8, step: 0.1, value: 9.8, unit: "m/s²" });
    drag = SimKit.slider(controls, { label: "Air drag k", min: 0, max: 0.5, step: 0.01, value: 0, unit: "1/s", digits: 2 });
    showComponents = SimKit.checkbox(controls, { label: "Show vx and vy arrows", checked: true });
    showGhosts = SimKit.checkbox(controls, { label: "Keep earlier paths", checked: true });

    const buttons = document.getElementById("buttons");
    SimKit.button(buttons, { label: "Launch", primary: true, onClick: launch });
    SimKit.button(buttons, { label: "Clear paths", onClick: () => (ghosts = []) });
    SimKit.button(buttons, { label: "Try: Moon (g = 1.6)", onClick: () => gravity.set(1.6) });
    SimKit.button(buttons, { label: "Try: 30° vs 60°", onClick: complementary });

    readouts = SimKit.readouts(document.getElementById("readouts"), {
      t: "Time",
      range: "Range",
      peak: "Max height",
      vx: "vx",
      vy: "vy",
    });
  };

  p.windowResized = () => SimKit.fit(p, stage, 16 / 9);

  function launch() {
    if (ball && showGhosts.value()) ghosts.push(ball.path);
    if (!showGhosts.value()) ghosts = [];
    const th = (angle.value() * Math.PI) / 180;
    ball = {
      x: 0,
      y: height.value(),
      vx: speed.value() * Math.cos(th),
      vy: speed.value() * Math.sin(th),
      t: 0,
      path: [{ x: 0, y: height.value() }],
      flying: true,
    };
    peak = { x: 0, y: height.value() };
    landed = null;
  }

  // Two launches whose angles add to 90°: same range on flat ground with no drag.
  function complementary() {
    height.set(0);
    drag.set(0);
    angle.set(30);
    launch();
    const first = ball;
    setTimeout(() => {
      if (ball === first) {
        angle.set(60);
        launch();
      }
    }, 1500);
  }

  function step(dt) {
    const k = drag.value();
    const g = gravity.value();
    // Small sub-steps keep the numbers honest at any frame rate.
    const n = 8;
    const h = dt / n;
    for (let i = 0; i < n && ball.flying; i++) {
      const ax = -k * ball.vx;
      const ay = -g - k * ball.vy;
      ball.vx += ax * h;
      ball.vy += ay * h;
      ball.x += ball.vx * h;
      ball.y += ball.vy * h;
      ball.t += h;
      if (ball.y > peak.y) peak = { x: ball.x, y: ball.y };
      if (ball.y <= 0 && ball.t > 0.01) {
        ball.y = 0;
        ball.flying = false;
        landed = { x: ball.x, t: ball.t };
      }
    }
    ball.path.push({ x: ball.x, y: ball.y });
  }

  const sx = (m) => 40 + m * scale;
  const sy = (m) => p.height - 40 - m * scale;

  p.draw = () => {
    scale = (p.width - 80) / WORLD_W;
    SimKit.grid(p, 5 * scale);

    // Ground and distance marks every 10 m.
    p.stroke(Chalk.chalk);
    p.strokeWeight(2);
    p.line(0, sy(0), p.width, sy(0));
    p.noStroke();
    p.fill(Chalk.dim);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    for (let m = 0; m <= WORLD_W; m += 10) p.text(`${m} m`, sx(m), sy(0) + 6);
    p.textAlign(p.LEFT, p.BASELINE);

    // Launch platform.
    if (height.value() > 0) {
      p.fill(Chalk.grid);
      p.rect(sx(0) - 20, sy(height.value()), 20, height.value() * scale);
    }

    // Aim line before launch.
    if (!ball || !ball.flying) {
      const th = (angle.value() * Math.PI) / 180;
      p.stroke(Chalk.dim);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([6, 6]);
      p.line(sx(0), sy(height.value()), sx(0) + Math.cos(th) * 80, sy(height.value()) - Math.sin(th) * 80);
      p.drawingContext.setLineDash([]);
    }

    // Earlier paths.
    p.noFill();
    p.strokeWeight(1.5);
    for (const path of ghosts) {
      p.stroke(170, 184, 176, 110);
      p.beginShape();
      for (const q of path) p.vertex(sx(q.x), sy(q.y));
      p.endShape();
    }

    if (ball) {
      if (ball.flying) step(Math.min(p.deltaTime / 1000, 0.05));

      p.stroke(Chalk.yellow);
      p.strokeWeight(2.5);
      p.beginShape();
      for (const q of ball.path) p.vertex(sx(q.x), sy(q.y));
      p.endShape();

      p.noStroke();
      p.fill(Chalk.chalk);
      p.circle(sx(ball.x), sy(ball.y), 14);

      if (showComponents.value() && ball.flying) {
        const k = 4; // pixels per m/s
        SimKit.arrow(p, sx(ball.x), sy(ball.y), ball.vx * k, 0, Chalk.blue, "vx");
        SimKit.arrow(p, sx(ball.x), sy(ball.y), 0, -ball.vy * k, Chalk.pink, "vy");
      }

      if (peak) {
        p.stroke(Chalk.green);
        p.strokeWeight(1);
        p.drawingContext.setLineDash([3, 5]);
        p.line(sx(peak.x), sy(peak.y), sx(peak.x), sy(0));
        p.drawingContext.setLineDash([]);
      }

      readouts.set("t", `${ball.t.toFixed(2)} s`);
      readouts.set("range", landed ? `${landed.x.toFixed(1)} m` : `${ball.x.toFixed(1)} m so far`);
      readouts.set("peak", `${peak.y.toFixed(1)} m`);
      readouts.set("vx", `${ball.vx.toFixed(1)} m/s`);
      readouts.set("vy", `${ball.vy.toFixed(1)} m/s`);
    }
  };
});
