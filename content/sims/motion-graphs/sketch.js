// Motion graphs: one cart, three graphs.
// Constant acceleration, so x(t) = x0 + v0 t + ½ a t² and v(t) = v0 + a t.
// The graphs are drawn from the same numbers that move the cart, so what you see
// on the track and what you see on the graphs can never disagree.

const T_MAX = 10; // seconds shown on each graph
const X_RANGE = 10; // track runs from -10 m to +10 m
const V_RANGE = 10; // m/s shown on the velocity graph
const A_RANGE = 4; // m/s² shown on the acceleration graph

let x0, v0, a;
let t = 0;
let running = false;
let trail = []; // [{t, x, v}]
let readouts;

new p5((p) => {
  let stage;

  p.setup = () => {
    stage = document.getElementById("stage");
    const c = p.createCanvas(960, 600);
    c.parent(stage);
    SimKit.fit(p, stage, 16 / 10);
    p.textFont("Helvetica");

    const controls = document.getElementById("controls");
    x0 = SimKit.slider(controls, { label: "Start position x₀", min: -8, max: 8, step: 0.5, value: -6, unit: "m", onChange: reset });
    v0 = SimKit.slider(controls, { label: "Start velocity v₀", min: -6, max: 6, step: 0.5, value: 2, unit: "m/s", onChange: reset });
    a = SimKit.slider(controls, { label: "Acceleration a", min: -3, max: 3, step: 0.1, value: 0, unit: "m/s²", onChange: reset });

    const buttons = document.getElementById("buttons");
    const go = SimKit.button(buttons, {
      label: "Go",
      primary: true,
      onClick: () => {
        if (t >= T_MAX || hitEnd()) reset();
        running = !running;
        go.textContent = running ? "Pause" : "Go";
      },
    });
    SimKit.button(buttons, {
      label: "Reset",
      onClick: () => {
        reset();
        go.textContent = "Go";
      },
    });
    SimKit.button(buttons, {
      label: "Try: turn around",
      onClick: () => {
        x0.set(-2);
        v0.set(5);
        a.set(-2);
        reset();
        go.textContent = "Go";
      },
    });

    readouts = SimKit.readouts(document.getElementById("readouts"), { t: "Time", x: "Position", v: "Velocity", a: "Acceleration" });
    reset();
  };

  p.windowResized = () => SimKit.fit(p, stage, 16 / 10);

  function state(time) {
    return {
      x: x0.value() + v0.value() * time + 0.5 * a.value() * time * time,
      v: v0.value() + a.value() * time,
    };
  }

  function hitEnd() {
    const { x } = state(t);
    return Math.abs(x) >= X_RANGE;
  }

  function reset() {
    running = false;
    t = 0;
    trail = [{ t: 0, ...state(0) }];
  }

  p.draw = () => {
    if (running) {
      const dt = Math.min(p.deltaTime / 1000, 0.05);
      t = Math.min(t + dt, T_MAX);
      trail.push({ t, ...state(t) });
      if (t >= T_MAX || hitEnd()) running = false;
    }

    const W = p.width;
    const H = p.height;
    SimKit.grid(p, W / 24);

    drawTrack(0, 0, W, H * 0.34);
    const gy = H * 0.38;
    const gh = H * 0.58;
    const gw = (W - 40) / 3;
    drawGraph(10, gy, gw, gh, "position x (m)", X_RANGE, (s) => s.x, Chalk.yellow);
    drawGraph(20 + gw, gy, gw, gh, "velocity v (m/s)", V_RANGE, (s) => s.v, Chalk.blue);
    drawGraph(30 + 2 * gw, gy, gw, gh, "acceleration a (m/s²)", A_RANGE, () => a.value(), Chalk.pink);

    const now = state(t);
    readouts.set("t", `${t.toFixed(2)} s`);
    readouts.set("x", `${now.x.toFixed(2)} m`);
    readouts.set("v", `${now.v.toFixed(2)} m/s`);
    readouts.set("a", `${a.value().toFixed(1)} m/s²`);
  };

  function drawTrack(x, y, w, h) {
    const left = x + 30;
    const right = x + w - 30;
    const ty = y + h * 0.7;
    const toPx = (m) => p.map(m, -X_RANGE, X_RANGE, left, right);

    p.stroke(Chalk.chalk);
    p.strokeWeight(2);
    p.line(left, ty, right, ty);
    p.noStroke();
    p.fill(Chalk.dim);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    for (let m = -X_RANGE; m <= X_RANGE; m += 2) {
      p.stroke(Chalk.dim);
      p.line(toPx(m), ty - 4, toPx(m), ty + 4);
      p.noStroke();
      p.text(m, toPx(m), ty + 8);
    }

    const { x: cx, v } = state(t);
    const px = toPx(p.constrain(cx, -X_RANGE, X_RANGE));
    p.fill(Chalk.yellow);
    p.noStroke();
    p.rectMode(p.CENTER);
    p.rect(px, ty - 16, 44, 22, 5);
    p.fill(Chalk.board);
    p.circle(px - 12, ty - 4, 10);
    p.circle(px + 12, ty - 4, 10);
    p.rectMode(p.CORNER);

    // Velocity arrow above the cart (scaled), acceleration arrow above that.
    SimKit.arrow(p, px, ty - 40, v * 8, 0, Chalk.blue, "v");
    SimKit.arrow(p, px, ty - 64, a.value() * 16, 0, Chalk.pink, "a");
    p.textAlign(p.LEFT, p.BASELINE);
  }

  function drawGraph(x, y, w, h, label, range, pick, color) {
    p.noFill();
    p.stroke(Chalk.dim);
    p.strokeWeight(1);
    p.rect(x, y, w, h, 6);
    const mid = y + h / 2;
    p.line(x, mid, x + w, mid); // zero line

    p.noStroke();
    p.fill(Chalk.chalk);
    p.textSize(14);
    p.text(label, x + 8, y + 18);
    p.fill(Chalk.dim);
    p.textSize(11);
    p.text(`+${range}`, x + 6, y + 32);
    p.text(`−${range}`, x + 6, y + h - 6);
    p.text("t →", x + w - 26, mid - 6);

    p.stroke(color);
    p.strokeWeight(2.5);
    p.noFill();
    p.beginShape();
    for (const s of trail) {
      const gx = p.map(s.t, 0, T_MAX, x, x + w);
      const gy = p.map(p.constrain(pick(s), -range, range), -range, range, y + h - 4, y + 4);
      p.vertex(gx, gy);
    }
    p.endShape();
  }
});
