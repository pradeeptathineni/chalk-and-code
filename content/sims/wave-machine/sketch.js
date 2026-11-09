// Wave machine: a wave carries energy along, but each bit of the rope only moves up and down.
//
// For a steady wave started from the left end:
//     displacement = amplitude × sin(2π × (frequency × t − x / wavelength))
// and every wave obeys
//     speed = wavelength × frequency
//
// Pulses just add up where they meet (superposition), then carry on as if nothing happened.

const W = 960;
const H = 560;
const PX_PER_M = 100; // 100 pixels on screen = 1 metre
const X0 = 40; // where the rope starts
const LEN = 880; // rope length in pixels (8.8 m)
const BEADS = 89;

let amp, freq, speed, slinky, readouts;
let mode = "steady"; // "steady" or "pulses"
let t = 0; // seconds since the wave started
let pulses = []; // {from: "left"|"right", t0, sign}

new p5((p) => {
  let stage;
  let steadyBtn;

  p.setup = () => {
    stage = document.getElementById("stage");
    p.createCanvas(W, H).parent(stage);
    SimKit.fit(p, stage, W / H);
    p.textFont("Helvetica");

    const controls = document.getElementById("controls");
    amp = SimKit.slider(controls, { label: "Amplitude (how big)", min: 10, max: 90, step: 1, value: 50, unit: "cm", digits: 0 });
    freq = SimKit.slider(controls, { label: "Frequency (shakes per second)", min: 0.2, max: 3, step: 0.1, value: 1, unit: "Hz" });
    speed = SimKit.slider(controls, { label: "Wave speed", min: 0.5, max: 4, step: 0.1, value: 2, unit: "m/s" });
    slinky = SimKit.checkbox(controls, { label: "Slinky (push and pull) instead of rope", onChange: () => {} });

    const buttons = document.getElementById("buttons");
    steadyBtn = SimKit.button(buttons, { label: "Steady wave", primary: true, onClick: () => { mode = "steady"; t = 0; pulses = []; } });
    SimKit.button(buttons, { label: "Pulse from the left", onClick: () => addPulse("left", 1) });
    SimKit.button(buttons, { label: "Pulse from the right", onClick: () => addPulse("right", 1) });
    SimKit.button(buttons, { label: "Upside-down pulse from the right", onClick: () => addPulse("right", -1) });

    readouts = SimKit.readouts(document.getElementById("readouts"), { l: "Wavelength", f: "Frequency", v: "Speed", check: "Wavelength × frequency" });
  };

  p.windowResized = () => SimKit.fit(p, stage, W / H);

  function addPulse(from, sign) {
    if (mode !== "pulses") {
      mode = "pulses";
      pulses = [];
      t = 0;
    }
    pulses.push({ from, t0: t, sign });
  }

  // Displacement (pixels) of the rope at distance x (pixels from the left end) at time t.
  function displacement(x) {
    const A = amp.value(); // cm → we draw 1 cm as 1 px
    const v = speed.value() * PX_PER_M; // pixels per second
    if (mode === "steady") {
      if (x > v * t) return 0; // the wave hasn't got here yet
      const lambda = v / freq.value();
      return A * Math.sin(2 * Math.PI * (freq.value() * t - x / lambda));
    }
    let y = 0;
    const width = 40;
    for (const pl of pulses) {
      const travelled = v * (t - pl.t0);
      const centre = pl.from === "left" ? travelled - width * 2 : LEN - travelled + width * 2;
      y += pl.sign * A * Math.exp(-Math.pow((x - centre) / width, 2));
    }
    return y;
  }

  p.draw = () => {
    p.scale(p.width / W);
    SimKit.grid(p, 50);
    t += 1 / 60;
    pulses = pulses.filter((pl) => speed.value() * PX_PER_M * (t - pl.t0) < LEN + 200);

    const mid = 250;
    const lambdaM = speed.value() / freq.value();

    // Rest line
    p.stroke(Chalk.dim);
    p.drawingContext.setLineDash([4, 6]);
    p.line(X0, mid, X0 + LEN, mid);
    p.drawingContext.setLineDash([]);

    if (!slinky.value()) {
      // Rope: each bead moves up and down only.
      p.noFill();
      p.stroke(Chalk.chalk);
      p.strokeWeight(3);
      p.beginShape();
      for (let x = 0; x <= LEN; x += 4) p.vertex(X0 + x, mid - displacement(x));
      p.endShape();
      p.strokeWeight(1);
      for (let i = 0; i < BEADS; i++) {
        const x = (i * LEN) / (BEADS - 1);
        const red = i === 30;
        p.noStroke();
        p.fill(red ? "#e05a5a" : Chalk.blue);
        p.circle(X0 + x, mid - displacement(x), red ? 16 : 7);
      }
    } else {
      // Slinky: each coil moves left and right only, so the wave shows as squashed and stretched bits.
      for (let i = 0; i < BEADS; i++) {
        const x = (i * LEN) / (BEADS - 1);
        const dx = 0.35 * displacement(x);
        const red = i === 30;
        p.stroke(red ? "#e05a5a" : Chalk.blue);
        p.strokeWeight(red ? 5 : 2);
        p.line(X0 + x + dx, mid - 60, X0 + x + dx, mid + 60);
      }
      p.strokeWeight(1);
    }

    // The hand shaking the left end (steady mode)
    if (mode === "steady") {
      p.noStroke();
      p.fill("#e8c39e");
      const hy = slinky.value() ? 0 : displacement(0);
      const hx = slinky.value() ? 0.35 * displacement(0) : 0;
      p.circle(X0 - 10 + hx, mid - hy, 26);
    }

    // Measure one wavelength with a ruler under the rope.
    if (mode === "steady" && lambdaM * PX_PER_M < LEN - 20) {
      const ry = mid + 130;
      const len = lambdaM * PX_PER_M;
      const startX = X0 + 120;
      p.stroke(Chalk.yellow);
      p.strokeWeight(2);
      p.line(startX, ry, startX + len, ry);
      p.line(startX, ry - 8, startX, ry + 8);
      p.line(startX + len, ry - 8, startX + len, ry + 8);
      p.strokeWeight(1);
      p.noStroke();
      p.fill(Chalk.yellow);
      p.textSize(14);
      p.textAlign(p.CENTER, p.TOP);
      p.text(`one wavelength = ${lambdaM.toFixed(2)} m`, startX + len / 2, ry + 12);
    }

    // Metre marks
    p.fill(Chalk.dim);
    p.noStroke();
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    for (let m = 0; m <= 8; m++) p.text(`${m} m`, X0 + m * PX_PER_M, H - 30);

    p.textAlign(p.LEFT, p.TOP);
    p.textSize(14);
    p.fill(Chalk.chalk);
    p.text(mode === "steady" ? "Watch the red bead: it only goes " + (slinky.value() ? "back and forth." : "up and down.") + " The wave moves along; the " + (slinky.value() ? "slinky" : "rope") + " stays put." : "Pulses pass right through each other. Where they overlap, they add up.", X0, 30);

    steadyBtn.className = mode === "steady" ? "primary" : "";
    if (mode === "steady") {
      readouts.set("l", `${lambdaM.toFixed(2)} m`);
      readouts.set("f", `${freq.value().toFixed(1)} Hz`);
      readouts.set("v", `${speed.value().toFixed(1)} m/s`);
      readouts.set("check", `${lambdaM.toFixed(2)} × ${freq.value().toFixed(1)} = ${(lambdaM * freq.value()).toFixed(1)} m/s, the speed`);
    } else {
      readouts.set("l", "–");
      readouts.set("f", "–");
      readouts.set("v", `${speed.value().toFixed(1)} m/s`);
      readouts.set("check", "–");
    }
  };
});
