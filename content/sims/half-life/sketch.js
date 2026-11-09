// Half-life: random for one atom, predictable for many.
//
// Every second, each undecayed atom has the same small chance of decaying.
// You can't predict which atom will go next, but after one half-life,
// about half of them have gone. After another, half of what's left, and so on:
//     atoms left = starting atoms × (1/2) ^ (time ÷ half-life)
//
// Coin mode: flip a coin for every atom. Heads, it decays. Each flip is one half-life.

const W = 960;
const H = 560;
const COLS = 20;
const ROWS = 20;
const N = COLS * ROWS;
const CELL = 22;
const GRID = { x: 40, y: 60 };
const GRAPH = { x: 540, y: 80, w: 380, h: 330 };

let atoms = []; // true = still undecayed
let flashes = [];
let t = 0;
let running = false;
let halfLife, readouts;
let history = [{ t: 0, n: N }];
let coinFlips = 0;
let startBtn;

function reset() {
  atoms = new Array(N).fill(true);
  flashes = [];
  t = 0;
  coinFlips = 0;
  running = false;
  history = [{ t: 0, n: N }];
  if (startBtn) startBtn.textContent = "Start";
}

const left = () => atoms.filter(Boolean).length;

new p5((p) => {
  let stage;

  p.setup = () => {
    stage = document.getElementById("stage");
    p.createCanvas(W, H).parent(stage);
    SimKit.fit(p, stage, W / H);
    p.textFont("Helvetica");

    const controls = document.getElementById("controls");
    halfLife = SimKit.slider(controls, { label: "Half-life", min: 1, max: 10, step: 0.5, value: 3, unit: "s", onChange: reset });

    const buttons = document.getElementById("buttons");
    startBtn = SimKit.button(buttons, { label: "Start", primary: true, onClick: () => { running = !running; startBtn.textContent = running ? "Pause" : "Start"; } });
    SimKit.button(buttons, { label: "Flip a coin for every atom", onClick: flipCoins });
    SimKit.button(buttons, { label: "Reset", onClick: reset });

    readouts = SimKit.readouts(document.getElementById("readouts"), { n: "Atoms left", time: "Time", hl: "Half-lives passed", expect: "Formula predicts" });
    reset();
  };

  p.windowResized = () => SimKit.fit(p, stage, W / H);

  function decay(i) {
    atoms[i] = false;
    flashes.push({ i, life: 20 });
  }

  function flipCoins() {
    running = false;
    startBtn.textContent = "Start";
    for (let i = 0; i < N; i++) if (atoms[i] && Math.random() < 0.5) decay(i);
    coinFlips++;
    t = coinFlips * halfLife.value();
    history.push({ t, n: left() });
  }

  p.draw = () => {
    p.scale(p.width / W);
    p.background(Chalk.board);

    if (running) {
      const dt = 1 / 60;
      // Chance of decaying in this tiny slice of time, the same for every atom:
      const chance = 1 - Math.pow(0.5, dt / halfLife.value());
      for (let i = 0; i < N; i++) if (atoms[i] && Math.random() < chance) decay(i);
      t += dt;
      if (p.frameCount % 6 === 0) history.push({ t, n: left() });
      if (left() === 0) {
        running = false;
        startBtn.textContent = "Start";
      }
    }

    // Atoms
    p.noStroke();
    for (let i = 0; i < N; i++) {
      const x = GRID.x + (i % COLS) * CELL + CELL / 2;
      const y = GRID.y + Math.floor(i / COLS) * CELL + CELL / 2;
      p.fill(atoms[i] ? Chalk.yellow : "#3b4d44");
      p.circle(x, y, CELL * 0.7);
    }
    for (const f of flashes) {
      const x = GRID.x + (f.i % COLS) * CELL + CELL / 2;
      const y = GRID.y + Math.floor(f.i / COLS) * CELL + CELL / 2;
      p.noFill();
      p.stroke(242, 159, 181, f.life * 12);
      p.strokeWeight(2);
      p.circle(x, y, CELL * 0.7 + (20 - f.life) * 1.5);
      f.life--;
    }
    p.strokeWeight(1);
    flashes = flashes.filter((f) => f.life > 0);
    p.noStroke();
    p.fill(Chalk.dim);
    p.textSize(13);
    p.textAlign(p.LEFT, p.TOP);
    p.fill(Chalk.yellow);
    p.text("● not yet decayed", GRID.x, GRID.y + ROWS * CELL + 10);
    p.fill("#6b7f75");
    p.text("● decayed", GRID.x + 140, GRID.y + ROWS * CELL + 10);

    // Graph: atoms left against time, with the formula's smooth curve
    const hl = halfLife.value();
    const tMax = 5 * hl;
    const gx = (tt) => GRAPH.x + (Math.min(tt, tMax) / tMax) * GRAPH.w;
    const gy = (n) => GRAPH.y + GRAPH.h - (n / N) * GRAPH.h;
    p.stroke(Chalk.dim);
    p.line(GRAPH.x, GRAPH.y, GRAPH.x, GRAPH.y + GRAPH.h);
    p.line(GRAPH.x, GRAPH.y + GRAPH.h, GRAPH.x + GRAPH.w, GRAPH.y + GRAPH.h);
    // Half-life gridlines
    for (let k = 1; k <= 5; k++) {
      p.stroke(Chalk.grid);
      p.line(gx(k * hl), GRAPH.y, gx(k * hl), GRAPH.y + GRAPH.h);
      p.line(GRAPH.x, gy(N / 2 ** k), GRAPH.x + GRAPH.w, gy(N / 2 ** k));
      p.noStroke();
      p.fill(Chalk.dim);
      p.textSize(11);
      p.textAlign(p.CENTER, p.TOP);
      p.text(`${k}`, gx(k * hl), GRAPH.y + GRAPH.h + 6);
      p.textAlign(p.RIGHT, p.CENTER);
      if (k <= 3) p.text(`${N / 2 ** k}`, GRAPH.x - 6, gy(N / 2 ** k));
    }
    p.textAlign(p.RIGHT, p.CENTER);
    p.text(`${N}`, GRAPH.x - 6, gy(N));
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text("half-lives passed", GRAPH.x + GRAPH.w / 2, GRAPH.y + GRAPH.h + 24);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("atoms left", GRAPH.x, GRAPH.y - 8);

    // Prediction curve
    p.noFill();
    p.stroke(Chalk.blue);
    p.drawingContext.setLineDash([5, 5]);
    p.beginShape();
    for (let k = 0; k <= 100; k++) {
      const tt = (k / 100) * tMax;
      p.vertex(gx(tt), gy(N * Math.pow(0.5, tt / hl)));
    }
    p.endShape();
    p.drawingContext.setLineDash([]);
    // What actually happened
    p.stroke(Chalk.yellow);
    p.strokeWeight(2.5);
    p.beginShape();
    for (const h of history) p.vertex(gx(h.t), gy(h.n));
    p.endShape();
    p.strokeWeight(1);
    p.noStroke();
    p.textSize(12);
    p.fill(Chalk.yellow);
    p.textAlign(p.RIGHT, p.TOP);
    p.text("— what happened", GRAPH.x + GRAPH.w, GRAPH.y);
    p.fill(Chalk.blue);
    p.text("- - formula", GRAPH.x + GRAPH.w, GRAPH.y + 16);

    readouts.set("n", `${left()} of ${N}`);
    readouts.set("time", `${t.toFixed(1)} s`);
    readouts.set("hl", `${(t / hl).toFixed(1)}`);
    readouts.set("expect", `${Math.round(N * Math.pow(0.5, t / hl))}`);
  };
});
