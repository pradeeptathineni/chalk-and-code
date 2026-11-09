// Solid, liquid, gas: particles that jiggle and stick.
//
// Every pair of particles pulls on each other gently when they're close,
// and pushes apart hard if they get too close (this is the Lennard-Jones rule,
// a standard model of how atoms and molecules attract and repel).
// Temperature is how fast the particles jiggle on average.
//   Cold: the pull wins, and particles lock into a neat pattern (solid).
//   Warmer: they jiggle loose but still cling together (liquid).
//   Hot: the jiggling wins and they fly apart (gas).
// A little gravity pulls everything towards the floor, like in a real cup.

const W = 960;
const H = 560;
const SIG = 22; // particle size in pixels (1 unit in the physics)
const BOX = { x: 40, y: 40, w: 600, h: 440 };
const LX = BOX.w / SIG;
const LY = BOX.h / SIG;
const N = 90;
const DT = 0.004;
const STEPS = 12; // physics steps per frame
const G = 0.12; // gravity in physics units
const CUT2 = 2.5 * 2.5;

let ps = [];
let target, readouts;
let T = 0.1; // current temperature (physics units)

function lattice() {
  ps = [];
  const cols = 15;
  const dx = 1.12;
  const dy = 0.97;
  for (let i = 0; i < N; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    ps.push({ x: 4 + c * dx + (r % 2) * dx * 0.5, y: LY - 0.7 - r * dy, vx: 0, vy: 0, ax: 0, ay: 0 });
  }
}

function forces() {
  for (const p of ps) {
    p.ax = 0;
    p.ay = G; // gravity (y grows downwards)
  }
  for (let i = 0; i < N; i++) {
    const a = ps[i];
    for (let j = i + 1; j < N; j++) {
      const b = ps[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const r2 = dx * dx + dy * dy;
      if (r2 > CUT2) continue;
      const ir2 = 1 / Math.max(r2, 0.64);
      const ir6 = ir2 * ir2 * ir2;
      const f = 24 * ir2 * ir6 * (2 * ir6 - 1); // positive pushes apart, negative pulls together
      a.ax += f * dx;
      a.ay += f * dy;
      b.ax -= f * dx;
      b.ay -= f * dy;
    }
  }
}

function step(goal) {
  for (const p of ps) {
    p.vx += 0.5 * DT * p.ax;
    p.vy += 0.5 * DT * p.ay;
    p.x += DT * p.vx;
    p.y += DT * p.vy;
    // Walls: bounce
    if (p.x < 0.5) { p.x = 0.5; p.vx = Math.abs(p.vx); }
    if (p.x > LX - 0.5) { p.x = LX - 0.5; p.vx = -Math.abs(p.vx); }
    if (p.y < 0.5) { p.y = 0.5; p.vy = Math.abs(p.vy); }
    if (p.y > LY - 0.5) { p.y = LY - 0.5; p.vy = -Math.abs(p.vy); }
  }
  forces();
  let ke = 0;
  for (const p of ps) {
    p.vx += 0.5 * DT * p.ax;
    p.vy += 0.5 * DT * p.ay;
    ke += 0.5 * (p.vx * p.vx + p.vy * p.vy);
  }
  T = ke / N; // in 2D, average kinetic energy per particle = temperature
  // Thermostat: nudge every speed so the temperature drifts towards the goal (like a stove or a freezer).
  const k = Math.sqrt(1 + 0.02 * (goal / Math.max(T, 1e-4) - 1));
  for (const p of ps) {
    p.vx *= k;
    p.vy *= k;
  }
}

// Count the particles flying free (fewer than 2 close neighbours). Few in a solid or liquid, most in a gas.
function freeCount() {
  const near = new Array(N).fill(0);
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const dx = ps[i].x - ps[j].x;
      const dy = ps[i].y - ps[j].y;
      if (dx * dx + dy * dy < 1.35 * 1.35) {
        near[i]++;
        near[j]++;
      }
    }
  }
  return near.filter((n) => n < 2).length;
}

function stateOf(free) {
  if (T < 0.38 && free < N * 0.1) return "solid";
  if (free < N * 0.25) return "liquid";
  if (free < N * 0.6) return "boiling: liquid and gas";
  return "gas";
}

new p5((p) => {
  let stage;
  let state = "solid";
  let free = 0;

  p.setup = () => {
    stage = document.getElementById("stage");
    p.createCanvas(W, H).parent(stage);
    SimKit.fit(p, stage, W / H);
    p.textFont("Helvetica");

    const controls = document.getElementById("controls");
    target = SimKit.slider(controls, { label: "Heat ← cold · hot →", min: 0.05, max: 3, step: 0.01, value: 0.15, digits: 2 });
    target.input.parentElement.querySelector("output").style.visibility = "hidden";

    const buttons = document.getElementById("buttons");
    SimKit.button(buttons, { label: "Freeze it", onClick: () => target.set(0.1) });
    SimKit.button(buttons, { label: "Melt it", onClick: () => target.set(0.5) });
    SimKit.button(buttons, { label: "Boil it", onClick: () => target.set(2.2) });
    SimKit.button(buttons, { label: "Start again", primary: true, onClick: () => { target.set(0.15); lattice(); } });

    readouts = SimKit.readouts(document.getElementById("readouts"), { state: "Right now it's a", t: "Particles flying free" });
    lattice();
    forces();
  };

  p.windowResized = () => SimKit.fit(p, stage, W / H);

  p.draw = () => {
    p.scale(p.width / W);
    p.background(Chalk.board);
    for (let i = 0; i < STEPS; i++) step(target.value());
    if (p.frameCount % 10 === 0) {
      free = freeCount();
      state = stateOf(free);
    }

    // Container
    p.noFill();
    p.stroke(Chalk.chalk);
    p.strokeWeight(3);
    p.rect(BOX.x, BOX.y, BOX.w, BOX.h, 4);
    p.strokeWeight(1);

    // Particles coloured by their own speed: blue slow, orange fast
    p.noStroke();
    ps.forEach((q, i) => {
      const s = Math.min(1, Math.hypot(q.vx, q.vy) / 2.4);
      p.fill(i === 40 ? "#e05a5a" : p.lerpColor(p.color(Chalk.blue), p.color("#f2a35c"), s));
      p.circle(BOX.x + q.x * SIG, BOX.y + q.y * SIG, SIG * 0.9);
    });

    // Thermometer
    const tx = 760;
    const top = 70;
    const bot = 430;
    const frac = Math.min(1, T / 3);
    p.fill("#2c3a33");
    p.stroke(Chalk.dim);
    p.rect(tx - 14, top, 28, bot - top, 14);
    p.circle(tx, bot + 14, 50);
    p.noStroke();
    p.fill("#e05a5a");
    p.rect(tx - 7, bot - frac * (bot - top - 10), 14, frac * (bot - top - 10) + 10, 7);
    p.circle(tx, bot + 14, 36);
    p.fill(Chalk.dim);
    p.textSize(13);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("hot", tx + 26, top + 10);
    p.text("cold", tx + 26, bot);

    // Big state label
    const like = { solid: "like ice", liquid: "like water", "boiling: liquid and gas": "like a boiling pot", gas: "like steam" }[state];
    p.fill(Chalk.chalk);
    p.textSize(26);
    p.textAlign(p.LEFT, p.TOP);
    p.text(state.split(":")[0].toUpperCase(), 820, 200);
    p.textSize(15);
    p.fill(Chalk.dim);
    p.text(like, 820, 236);

    readouts.set("state", `${state} (${like})`);
    readouts.set("t", `${free} of ${N}`);
  };
});
