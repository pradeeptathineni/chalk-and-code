// Mixing colours: light adds, paint takes away.
//
// Light: red + green + blue spotlights ADD together. Red + green = yellow; all three = white.
//   Every screen makes its colours this way, from tiny red, green and blue dots.
// Paint: each paint SOAKS UP (absorbs) some colours and reflects the rest.
//   Cyan soaks up red, magenta soaks up green, yellow soaks up blue. All three: nearly black.
// Objects: a thing's colour is the light it reflects. A red apple reflects red and soaks up the rest,
//   so under blue light there's nothing for it to reflect, and it looks black.

const W = 960;
const H = 560;

let mode = "light";
let spots = [];
let lights = {}; // for objects mode: which coloured lamps are on
let readouts;
let dragging = null;

// Each object: what fraction of red, green and blue light it reflects.
const THINGS = [
  { name: "red apple", r: 0.9, g: 0.08, b: 0.08, draw: "apple" },
  { name: "green leaf", r: 0.1, g: 0.8, b: 0.12, draw: "leaf" },
  { name: "banana", r: 0.95, g: 0.85, b: 0.1, draw: "banana" },
  { name: "blueberry", r: 0.12, g: 0.15, b: 0.85, draw: "berry" },
  { name: "white T-shirt", r: 0.95, g: 0.95, b: 0.95, draw: "shirt" },
];

function resetSpots() {
  spots =
    mode === "light"
      ? [
          { x: 400, y: 220, c: [255, 0, 0], name: "red" },
          { x: 520, y: 220, c: [0, 255, 0], name: "green" },
          { x: 460, y: 320, c: [0, 0, 255], name: "blue" },
        ]
      : [
          { x: 400, y: 220, c: [0, 255, 255], name: "cyan" },
          { x: 520, y: 220, c: [255, 0, 255], name: "magenta" },
          { x: 460, y: 320, c: [255, 255, 0], name: "yellow" },
        ];
}

new p5((p) => {
  let stage;
  const modeBtns = {};
  const lampBoxes = {};
  let controls;

  p.setup = () => {
    stage = document.getElementById("stage");
    p.createCanvas(W, H).parent(stage);
    SimKit.fit(p, stage, W / H);
    p.textFont("Helvetica");

    controls = document.getElementById("controls");
    for (const [k, label] of [["r", "Red lamp"], ["g", "Green lamp"], ["b", "Blue lamp"]]) {
      lights[k] = true;
      lampBoxes[k] = SimKit.checkbox(controls, { label, checked: true, onChange: (v) => (lights[k] = v) });
    }

    const buttons = document.getElementById("buttons");
    modeBtns.light = SimKit.button(buttons, { label: "Mix light", onClick: () => setMode("light") });
    modeBtns.paint = SimKit.button(buttons, { label: "Mix paint", onClick: () => setMode("paint") });
    modeBtns.objects = SimKit.button(buttons, { label: "Light on things", onClick: () => setMode("objects") });
    SimKit.button(buttons, { label: "Only blue light", onClick: () => { setMode("objects"); setLamps(false, false, true); } });
    SimKit.button(buttons, { label: "Only red light", onClick: () => { setMode("objects"); setLamps(true, false, false); } });

    readouts = SimKit.readouts(document.getElementById("readouts"), { info: "What's happening" });
    setMode("light");
  };

  p.windowResized = () => SimKit.fit(p, stage, W / H);

  function setLamps(r, g, b) {
    Object.entries({ r, g, b }).forEach(([k, v]) => {
      lights[k] = v;
      lampBoxes[k].input.checked = v;
    });
  }

  function setMode(m) {
    mode = m;
    for (const [k, b] of Object.entries(modeBtns)) b.className = k === m ? "primary" : "";
    controls.style.display = m === "objects" ? "" : "none";
    if (m !== "objects") resetSpots();
  }

  const mx = () => (p.mouseX * W) / p.width;
  const my = () => (p.mouseY * W) / p.width;
  p.mousePressed = () => {
    if (mode === "objects") return;
    dragging = spots.find((s) => Math.hypot(mx() - s.x, my() - s.y) < 110) || null;
    if (dragging) return false;
  };
  p.mouseDragged = () => {
    if (!dragging) return;
    dragging.x = Math.min(W - 60, Math.max(60, mx()));
    dragging.y = Math.min(H - 60, Math.max(60, my()));
    return false;
  };
  p.mouseReleased = () => (dragging = null);

  p.draw = () => {
    p.scale(p.width / W);
    if (mode === "light") drawLight();
    else if (mode === "paint") drawPaint();
    else drawObjects();
  };

  function drawLight() {
    p.background(0);
    p.noStroke();
    p.blendMode(p.ADD); // light adds up
    for (const s of spots) {
      p.fill(...s.c);
      p.circle(s.x, s.y, 220);
    }
    p.blendMode(p.BLEND);
    p.fill(Chalk.dim);
    p.textSize(14);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Three spotlights on a dark wall. Drag them around.", 20, 20);
    readouts.set("info", "Light adds: red + green = yellow, green + blue = cyan, red + blue = magenta, and all three together make white.");
  }

  function drawPaint() {
    p.background(255);
    p.noStroke();
    p.blendMode(p.MULTIPLY); // each paint soaks up some colours, so overlaps get darker
    for (const s of spots) {
      p.fill(...s.c);
      p.circle(s.x, s.y, 220);
    }
    p.blendMode(p.BLEND);
    p.fill(80);
    p.textSize(14);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Three blobs of paint on white paper. Drag them around.", 20, 20);
    readouts.set("info", "Paint takes away: each paint soaks up some colours. Cyan + yellow = green, cyan + magenta = blue, magenta + yellow = red, and all three soak up almost everything: nearly black.");
  }

  function drawObjects() {
    // The colour of the lamp light falling on the scene
    const L = { r: lights.r ? 1 : 0, g: lights.g ? 1 : 0, b: lights.b ? 1 : 0 };
    p.background(25 * L.r + 12, 25 * L.g + 12, 25 * L.b + 12);
    // Lamps
    const lampCol = [255 * L.r, 255 * L.g, 255 * L.b];
    p.noStroke();
    p.fill(60);
    p.rect(450, 0, 60, 40, 0, 0, 10, 10);
    p.fill(...lampCol, 60);
    p.quad(455, 40, 505, 40, 900, 430, 60, 430);
    p.fill(...lampCol);
    p.circle(480, 42, 26);

    // Each thing shows only the light it reflects: lamp colour × what it reflects
    THINGS.forEach((t, i) => {
      const c = [255 * L.r * t.r, 255 * L.g * t.g, 255 * L.b * t.b];
      const x = 120 + i * 180;
      const y = 340;
      drawThing(t.draw, x, y, c);
      p.noStroke();
      p.fill(Chalk.chalk);
      p.textSize(14);
      p.textAlign(p.CENTER, p.TOP);
      p.text(t.name, x, 440);
      p.fill(Chalk.dim);
      p.textSize(12);
      const seen = colourName(c);
      p.text(`looks ${seen}`, x, 460);
    });
    const on = ["r", "g", "b"].filter((k) => lights[k]).map((k) => ({ r: "red", g: "green", b: "blue" })[k]);
    readouts.set("info", on.length === 3 ? "White light (red + green + blue): everything shows its everyday colour." : on.length ? `Only ${on.join(" and ")} light: each thing can only reflect the light that's there.` : "No light at all: nothing to reflect, so everything is black.");
  }

  function drawThing(kind, x, y, c) {
    p.stroke(255, 255, 255, 50); // faint outline so black things still show
    p.strokeWeight(1);
    p.fill(...c);
    if (kind === "apple") {
      p.circle(x - 14, y, 70);
      p.circle(x + 14, y, 70);
      p.fill(90, 60, 30);
      p.rect(x - 2, y - 50, 4, 16);
      p.noStroke();
    } else if (kind === "leaf") {
      p.ellipse(x, y, 60, 110);
    } else if (kind === "banana") {
      p.push();
      p.translate(x, y);
      p.rotate(-0.4);
      p.arc(0, -20, 120, 90, 0.2, Math.PI - 0.2, p.CHORD);
      p.pop();
    } else if (kind === "berry") {
      for (const [dx, dy] of [[-20, 10], [20, 10], [0, -18]]) p.circle(x + dx, y + dy, 46);
    } else {
      p.rect(x - 40, y - 40, 80, 90, 6);
      p.rect(x - 62, y - 40, 30, 36, 6);
      p.rect(x + 32, y - 40, 30, 36, 6);
    }
  }

  function colourName([r, g, b]) {
    const m = Math.max(r, g, b);
    if (m < 40) return "black";
    const hi = (v) => v > m * 0.55;
    const key = `${hi(r) ? "r" : ""}${hi(g) ? "g" : ""}${hi(b) ? "b" : ""}`;
    return { r: "red", g: "green", b: "blue", rg: "yellow", gb: "cyan", rb: "magenta", rgb: m > 180 ? "white" : "grey" }[key] || "dark";
  }
});
