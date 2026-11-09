// Electromagnets and generators: electricity and magnetism are two sides of one thing.
//
// Electromagnet: current flowing round a coil makes a magnetic field, just like a bar magnet.
//   strength ∝ turns of wire × current, and an iron core makes it many times stronger.
//
// Generator: a magnet moving near a coil pushes current round the wire.
//   current ∝ turns of wire × how fast the magnet moves (and nothing at all if it stops).

const W = 960;
const H = 560;
const COIL = { x1: 300, x2: 540, y: 230, r: 46 }; // the coil, wound along the x axis
const CORE_BOOST = 40; // how many times stronger an iron core makes this coil (real cores: hundreds)

let mode = "electromagnet";
let turns, current, core, readouts;
let reversed = false;
let switchOn = true;

// Generator state
let magnetX = 120;
let lastMagnetX = 120;
let made = 0; // current made, smoothed for the meter
let dragging = false;
let auto = false;
let autoT = 0;

new p5((p) => {
  let stage;
  let turnsCtl, currentCtl, coreCtl, switchBtn, reverseBtn, autoBtn, emBtn, genBtn;

  p.setup = () => {
    stage = document.getElementById("stage");
    p.createCanvas(W, H).parent(stage);
    SimKit.fit(p, stage, W / H);
    p.textFont("Helvetica");

    const controls = document.getElementById("controls");
    turns = SimKit.slider(controls, { label: "Turns of wire", min: 5, max: 50, step: 1, value: 20, digits: 0 });
    current = SimKit.slider(controls, { label: "Current", min: 0, max: 3, step: 0.1, value: 1.5, unit: "A" });
    core = SimKit.checkbox(controls, { label: "Iron nail inside the coil", checked: true });
    turnsCtl = turns.input.parentElement;
    currentCtl = current.input.parentElement;
    coreCtl = core.input.parentElement;

    const buttons = document.getElementById("buttons");
    emBtn = SimKit.button(buttons, { label: "Electromagnet", primary: true, onClick: () => setMode("electromagnet") });
    genBtn = SimKit.button(buttons, { label: "Generator", onClick: () => setMode("generator") });
    switchBtn = SimKit.button(buttons, { label: "Switch off", onClick: () => { switchOn = !switchOn; switchBtn.textContent = switchOn ? "Switch off" : "Switch on"; } });
    reverseBtn = SimKit.button(buttons, { label: "Reverse the battery", onClick: () => (reversed = !reversed) });
    autoBtn = SimKit.button(buttons, { label: "Move it for me", onClick: () => { auto = !auto; autoBtn.textContent = auto ? "Stop moving" : "Move it for me"; } });

    readouts = SimKit.readouts(document.getElementById("readouts"), { a: "Strength", b: "Paperclips lifted", c: "Compass turned" });
    setMode("electromagnet");
  };

  p.windowResized = () => SimKit.fit(p, stage, W / H);

  function setMode(m) {
    mode = m;
    const em = m === "electromagnet";
    currentCtl.style.display = em ? "" : "none";
    coreCtl.style.display = em ? "" : "none";
    switchBtn.style.display = em ? "" : "none";
    reverseBtn.style.display = em ? "" : "none";
    autoBtn.style.display = em ? "none" : "";
    turnsCtl.style.display = "";
    emBtn.className = em ? "primary" : "";
    genBtn.className = em ? "" : "primary";
    readouts.relabel(em);
  }

  const mx = () => (p.mouseX * W) / p.width;
  const my = () => (p.mouseY * W) / p.width;
  p.mousePressed = () => {
    if (mode === "generator" && Math.abs(mx() - magnetX) < 90 && Math.abs(my() - COIL.y) < 40) {
      dragging = true;
      auto = false;
      autoBtn.textContent = "Move it for me";
      return false;
    }
  };
  p.mouseDragged = () => {
    if (!dragging) return;
    magnetX = Math.min(COIL.x2 - 40, Math.max(90, mx()));
    return false;
  };
  p.mouseReleased = () => (dragging = false);

  p.draw = () => {
    p.scale(p.width / W);
    SimKit.grid(p, 40);
    if (mode === "electromagnet") drawElectromagnet();
    else drawGenerator();
  };

  // ---------- Electromagnet ----------

  function strength() {
    if (!switchOn) return 0;
    return turns.value() * current.value() * (core.value() ? CORE_BOOST : 1);
  }

  function drawElectromagnet() {
    const B = strength();
    const dir = reversed ? -1 : 1; // +1: north pole on the right
    const n = turns.value();

    // Field lines: the coil acts like a bar magnet with poles at its ends.
    if (B > 0) {
      const alpha = Math.min(160, 25 + B / 12);
      const north = { x: dir > 0 ? COIL.x2 + 20 : COIL.x1 - 20, y: COIL.y };
      const south = { x: dir > 0 ? COIL.x1 - 20 : COIL.x2 + 20, y: COIL.y };
      p.noFill();
      p.stroke(244, 241, 232, alpha);
      for (let k = 1; k <= 5; k++) {
        const h = 40 + k * 34;
        p.bezier(north.x, north.y, north.x + dir * h, north.y - h * 1.6, south.x - dir * h, south.y - h * 1.6, south.x, south.y);
        p.bezier(north.x, north.y, north.x + dir * h, north.y + h * 1.6, south.x - dir * h, south.y + h * 1.6, south.x, south.y);
      }
    }

    // Iron nail
    if (core.value()) {
      p.noStroke();
      p.fill("#8a8f94");
      p.rect(COIL.x1 - 30, COIL.y - 12, COIL.x2 - COIL.x1 + 60, 24, 3);
      p.triangle(COIL.x2 + 30, COIL.y - 12, COIL.x2 + 30, COIL.y + 12, COIL.x2 + 60, COIL.y);
      p.rect(COIL.x1 - 40, COIL.y - 20, 12, 40, 2);
    }

    // Coil: one loop drawn for each turn
    p.noFill();
    p.strokeWeight(3);
    p.stroke("#d9894f");
    for (let i = 0; i < n; i++) {
      const x = COIL.x1 + ((i + 0.5) * (COIL.x2 - COIL.x1)) / n;
      p.ellipse(x, COIL.y, 12, COIL.r * 2);
    }
    p.strokeWeight(1);

    // Pole labels
    if (B > 0) {
      p.noStroke();
      p.textSize(22);
      p.textAlign(p.CENTER, p.CENTER);
      p.fill("#f29fb5");
      p.text("N", dir > 0 ? COIL.x2 + 40 : COIL.x1 - 60, COIL.y - 50);
      p.fill(Chalk.blue);
      p.text("S", dir > 0 ? COIL.x1 - 60 : COIL.x2 + 40, COIL.y - 50);
    }

    // Wires and battery
    const by = 470;
    p.stroke(Chalk.chalk);
    p.strokeWeight(2);
    p.noFill();
    p.line(COIL.x1, COIL.y + COIL.r, COIL.x1, by);
    p.line(COIL.x2, COIL.y + COIL.r, COIL.x2, by);
    p.line(COIL.x1, by, 390, by);
    p.line(450, by, COIL.x2, by);
    p.strokeWeight(1);
    p.noStroke();
    p.fill("#3a3a3a");
    p.rect(390, by - 22, 60, 44, 4);
    p.fill(Chalk.yellow);
    p.rect(390 + (reversed ? 0 : 52), by - 22, 8, 44);
    p.fill(Chalk.chalk);
    p.textSize(16);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(reversed ? "+   −" : "−   +", 420, by);
    p.textSize(13);
    p.text(switchOn ? `battery: ${current.value().toFixed(1)} A` : "switched off", 420, by + 36);

    // Moving dots show the current flowing (faster dots = more current)
    if (B > 0) {
      const speed = current.value() * (reversed ? -1 : 1);
      const path = [[COIL.x2, by], [COIL.x2, COIL.y + COIL.r], [COIL.x1, COIL.y + COIL.r], [COIL.x1, by], [390, by]];
      const total = path.reduce((s, pt, i) => (i ? s + Math.hypot(pt[0] - path[i - 1][0], pt[1] - path[i - 1][1]) : 0), 0);
      p.fill(Chalk.yellow);
      for (let k = 0; k < 12; k++) {
        let d = (((p.frameCount * speed * 2 + (k * total) / 12) % total) + total) % total;
        for (let i = 1; i < path.length; i++) {
          const seg = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
          if (d <= seg) {
            const t = d / seg;
            p.circle(path[i - 1][0] + t * (path[i][0] - path[i - 1][0]), path[i - 1][1] + t * (path[i][1] - path[i - 1][1]), 6);
            break;
          }
          d -= seg;
        }
      }
    }

    // Paperclips: a pile on the table, and a chain hanging from the right end
    const lifted = Math.min(12, Math.floor(B / 120));
    const tipX = COIL.x2 + 60;
    for (let i = 0; i < lifted; i++) clip(tipX + (i % 2 ? 6 : -6), COIL.y + 22 + i * 18, i % 2 ? 0.3 : -0.3);
    for (let i = 0; i < 12 - lifted; i++) clip(640 + (i % 4) * 22, 470 - Math.floor(i / 4) * 10, (i * 1.7) % 3);

    // Compass: lines up with Earth's field (pointing up the screen) plus the coil's field.
    const cx = 800;
    const cy = 140;
    const fx = dir * B * 0.0006; // coil's field at the compass, mostly sideways
    const angle = Math.atan2(fx, 1); // 0 = pointing north (up)
    p.noStroke();
    p.fill(255, 255, 255, 30);
    p.circle(cx, cy, 110);
    p.stroke(Chalk.dim);
    p.noFill();
    p.circle(cx, cy, 110);
    p.push();
    p.translate(cx, cy);
    p.rotate(angle);
    p.noStroke();
    p.fill("#d9506b");
    p.triangle(-8, 0, 8, 0, 0, -44);
    p.fill(Chalk.chalk);
    p.triangle(-8, 0, 8, 0, 0, 44);
    p.pop();
    p.noStroke();
    p.fill(Chalk.dim);
    p.textSize(13);
    p.textAlign(p.CENTER, p.TOP);
    p.text("compass (north is up)", cx, cy + 62);

    readouts.set("a", B ? `${Math.round(B)} = ${n} turns × ${current.value().toFixed(1)} A${core.value() ? " × 40 for the iron core" : ""}` : "0: no current, no magnet");
    readouts.set("b", `${lifted}`);
    readouts.set("c", `${Math.round((Math.abs(angle) * 180) / Math.PI)}° ${angle > 0.01 ? "to the right" : angle < -0.01 ? "to the left" : ""}`.trim());
  }

  function clip(x, y, rot) {
    p.push();
    p.translate(x, y);
    p.rotate(rot);
    p.noFill();
    p.stroke("#c7ccd1");
    p.strokeWeight(2);
    p.rect(-4, -8, 8, 16, 4);
    p.strokeWeight(1);
    p.pop();
  }

  // ---------- Generator ----------

  function drawGenerator() {
    if (auto) {
      autoT += 0.04;
      magnetX = 230 + 150 * Math.sin(autoT);
    }
    // Faraday's discovery: only a *changing* field makes current.
    const v = magnetX - lastMagnetX; // pixels moved this frame
    lastMagnetX = magnetX;
    const tip = magnetX + 60; // right end of the magnet
    const near = Math.exp(-Math.pow((tip - (COIL.x1 + 60)) / 140, 2)); // strongest as the tip enters the coil
    const target = turns.value() * v * near * 0.05;
    made += (target - made) * 0.25;

    // Coil (no core)
    const n = turns.value();
    p.noFill();
    p.strokeWeight(3);
    p.stroke("#d9894f");
    for (let i = 0; i < n; i++) {
      const x = COIL.x1 + ((i + 0.5) * (COIL.x2 - COIL.x1)) / n;
      p.ellipse(x, COIL.y, 12, COIL.r * 2);
    }
    p.strokeWeight(1);

    // Bar magnet (draggable)
    p.noStroke();
    p.fill("#4f86c6");
    p.rect(magnetX - 60, COIL.y - 16, 60, 32, 6, 0, 0, 6);
    p.fill("#d9506b");
    p.rect(magnetX, COIL.y - 16, 60, 32, 0, 6, 6, 0);
    p.fill(255);
    p.textSize(18);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("S", magnetX - 30, COIL.y + 1);
    p.text("N", magnetX + 30, COIL.y + 1);
    p.fill(Chalk.dim);
    p.textSize(13);
    p.text("drag me ↔", magnetX, COIL.y - 32);

    // Wires: coil → meter → back to the coil, with a bulb in the right-hand wire
    const by = 450;
    const bulbY = 360;
    p.stroke(Chalk.chalk);
    p.strokeWeight(2);
    p.line(COIL.x1, COIL.y + COIL.r, COIL.x1, by);
    p.line(COIL.x2, COIL.y + COIL.r, COIL.x2, bulbY - 16);
    p.line(COIL.x2, bulbY + 16, COIL.x2, by);
    p.line(COIL.x1, by, 360, by);
    p.line(480, by, COIL.x2, by);
    p.strokeWeight(1);

    // Meter: needle swings one way as the magnet goes in, the other way as it comes out.
    const mcx = 420;
    p.noStroke();
    p.fill("#2c3a33");
    p.arc(mcx, by + 10, 120, 120, Math.PI, 2 * Math.PI);
    p.stroke(Chalk.dim);
    p.noFill();
    p.arc(mcx, by + 10, 120, 120, Math.PI, 2 * Math.PI);
    const needle = Math.max(-1.3, Math.min(1.3, made * 0.5));
    p.stroke(Chalk.yellow);
    p.strokeWeight(3);
    p.line(mcx, by + 10, mcx + 52 * Math.sin(needle), by + 10 - 52 * Math.cos(needle));
    p.strokeWeight(1);
    p.noStroke();
    p.fill(Chalk.dim);
    p.textSize(13);
    p.textAlign(p.CENTER, p.TOP);
    p.text("current meter", mcx, by + 18);

    // Bulb glows with the size of the current, whichever way it flows.
    const glow = Math.min(1, Math.abs(made) / 2);
    p.noStroke();
    p.fill(242, 212, 107, 30 + 160 * glow);
    p.circle(COIL.x2, bulbY, 32 + 50 * glow);
    p.fill(242, 212, 107, 90 + 165 * glow);
    p.circle(COIL.x2, bulbY, 30);
    p.fill(Chalk.dim);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("bulb", COIL.x2 + 50, bulbY);

    readouts.set("a", `${made >= 0 ? "" : "−"}${Math.abs(made).toFixed(2)} (relative)`);
    readouts.set("b", Math.abs(made) < 0.05 ? "none: the magnet isn't moving" : made > 0 ? "flowing one way (magnet going in)" : "flowing the other way (magnet coming out)");
    readouts.set("c", glow > 0.6 ? "bright" : glow > 0.15 ? "glowing" : "off");
  }
});

// Readout labels change with the mode, so add a small helper to the readouts object.
const _readouts = SimKit.readouts;
SimKit.readouts = function (parent, labels) {
  const r = _readouts(parent, labels);
  const spans = [...parent.children];
  r.relabel = (em) => {
    const names = em ? ["Strength", "Paperclips lifted", "Compass turned"] : ["Current made", "Direction", "Bulb"];
    spans.forEach((s, i) => (s.firstChild.textContent = `${names[i]}: `));
  };
  return r;
};
