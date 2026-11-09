// Air pressure: a box of gas particles, drawn flat.
//
// Each particle flies in a straight line until it hits a wall and bounces off.
// Every bounce gives the wall a tiny push. Pressure is how hard all those pushes
// add up to, on each bit of wall. So pressure goes up when:
//   - there are more particles (more hits),
//   - the box is smaller (each particle hits the walls more often),
//   - the gas is hotter (particles move faster, so they hit more often and harder).

const W = 960;
const H = 560;
const BOX = { x: 60, y: 60, h: 400 };
const R = 4; // particle radius in pixels

let particles = [];
let count, width, temp, readouts;
let impulse = 0; // pushes on the walls since the last measurement
let pressure = 1; // smoothed, compared with normal
let hitRate = 0;
let flashes = []; // little marks where particles hit the walls

// Particle speed grows with the square root of the absolute temperature.
const speedFor = (celsius) => 2.2 * Math.sqrt((celsius + 273) / 293);

function makeParticle(boxW) {
  const a = Math.random() * 2 * Math.PI;
  const s = speedFor(temp.value()) * (0.6 + 0.8 * Math.random());
  return { x: BOX.x + R + Math.random() * (boxW - 2 * R), y: BOX.y + R + Math.random() * (BOX.h - 2 * R), vx: s * Math.cos(a), vy: s * Math.sin(a) };
}

new p5((p) => {
  let stage;
  let lastTemp = 20;

  p.setup = () => {
    stage = document.getElementById("stage");
    p.createCanvas(W, H).parent(stage);
    SimKit.fit(p, stage, W / H);
    p.textFont("Helvetica");

    const controls = document.getElementById("controls");
    count = SimKit.slider(controls, { label: "Amount of air (particles)", min: 10, max: 300, step: 10, value: 100, digits: 0, onChange: setCount });
    width = SimKit.slider(controls, { label: "Size of the box (push the piston)", min: 150, max: 640, step: 5, value: 500, unit: "px", digits: 0 });
    temp = SimKit.slider(controls, { label: "Temperature", min: -100, max: 300, step: 5, value: 20, unit: "°C", digits: 0, onChange: setTemp });

    const buttons = document.getElementById("buttons");
    SimKit.button(buttons, { label: "Back to normal", primary: true, onClick: () => { count.set(100); width.set(500); temp.set(20); setTemp(20); setCount(); } });
    SimKit.button(buttons, { label: "Squeeze to half", onClick: () => width.set(250) });
    SimKit.button(buttons, { label: "Pump in double", onClick: () => { count.set(200); setCount(); } });
    SimKit.button(buttons, { label: "Suck out most of the air", onClick: () => { count.set(10); setCount(); } });

    readouts = SimKit.readouts(document.getElementById("readouts"), { p: "Pressure", hits: "Hits on the walls", speed: "Particle speed" });
    setCount();
  };

  p.windowResized = () => SimKit.fit(p, stage, W / H);

  function setCount() {
    const n = count.value();
    while (particles.length < n) particles.push(makeParticle(width.value()));
    particles.length = n;
  }

  function setTemp(c) {
    // Heating speeds every particle up by the same factor.
    const k = speedFor(c) / speedFor(lastTemp);
    for (const q of particles) {
      q.vx *= k;
      q.vy *= k;
    }
    lastTemp = c;
  }

  p.draw = () => {
    p.scale(p.width / W);
    p.background(Chalk.board);
    const boxW = width.value();
    const right = BOX.x + boxW;

    // Move particles and bounce them off the walls, adding up the pushes.
    let hits = 0;
    for (let step = 0; step < 2; step++) {
      for (const q of particles) {
        q.x += q.vx;
        q.y += q.vy;
        if (q.x < BOX.x + R) { q.x = BOX.x + R; q.vx = Math.abs(q.vx); impulse += 2 * q.vx; hits++; flashes.push({ x: BOX.x, y: q.y, t: 8 }); }
        if (q.x > right - R) { q.x = right - R; impulse += 2 * Math.abs(q.vx); q.vx = -Math.abs(q.vx); hits++; flashes.push({ x: right, y: q.y, t: 8 }); }
        if (q.y < BOX.y + R) { q.y = BOX.y + R; q.vy = Math.abs(q.vy); impulse += 2 * q.vy; hits++; flashes.push({ x: q.x, y: BOX.y, t: 8 }); }
        if (q.y > BOX.y + BOX.h - R) { q.y = BOX.y + BOX.h - R; impulse += 2 * Math.abs(q.vy); q.vy = -Math.abs(q.vy); hits++; flashes.push({ x: q.x, y: BOX.y + BOX.h, t: 8 }); }
      }
    }

    // Pressure = total push on the walls ÷ length of wall. Averaged over time, that works out as
    //     pressure ∝ (number of particles × average speed²) ÷ space inside the box
    // We compare with "normal": 100 particles at 20 °C in a box 500 wide.
    // (1.0533 is the average of speed² for the random starting speeds, 0.6 to 1.4 times the typical speed.)
    const perimeter = 2 * (boxW + BOX.h);
    const meanV2 = particles.reduce((s, q) => s + q.vx * q.vx + q.vy * q.vy, 0) / particles.length;
    const v0 = speedFor(20);
    const target = (particles.length * meanV2) / (boxW * BOX.h) / ((100 * v0 * v0 * 1.0533) / (500 * BOX.h));
    pressure += (target - pressure) * 0.08;
    hitRate += (hits * 30 - hitRate) * 0.05;
    impulse = 0;
    const rel = pressure;

    // Box and piston
    p.noFill();
    p.stroke(Chalk.chalk);
    p.strokeWeight(3);
    p.line(BOX.x, BOX.y, right, BOX.y);
    p.line(BOX.x, BOX.y + BOX.h, right, BOX.y + BOX.h);
    p.line(BOX.x, BOX.y, BOX.x, BOX.y + BOX.h);
    p.strokeWeight(1);
    p.noStroke();
    p.fill("#9aa3ab");
    p.rect(right, BOX.y - 10, 14, BOX.h + 20, 3);
    p.rect(right + 14, BOX.y + BOX.h / 2 - 8, 720 - right, 16);
    p.fill(Chalk.dim);
    p.textSize(13);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("piston", right + 7, BOX.y - 14);

    // Flashes where particles hit
    for (const f of flashes) {
      p.fill(242, 212, 107, f.t * 25);
      p.circle(f.x, f.y, 10);
      f.t--;
    }
    flashes = flashes.filter((f) => f.t > 0);

    // Particles (one red one to follow)
    const t = temp.value();
    const warm = Math.max(0, Math.min(1, (t + 100) / 400));
    particles.forEach((q, i) => {
      p.fill(i === 0 ? "#e05a5a" : p.lerpColor(p.color(Chalk.blue), p.color("#f2a35c"), warm));
      p.circle(q.x, q.y, i === 0 ? 2 * R + 4 : 2 * R);
    });

    // Gauge
    const gx = 840;
    const gy = 200;
    p.fill("#2c3a33");
    p.stroke(Chalk.dim);
    p.circle(gx, gy, 170);
    p.noStroke();
    p.fill(Chalk.dim);
    p.textSize(12);
    p.textAlign(p.CENTER, p.CENTER);
    for (let k = 0; k <= 4; k++) {
      const a = Math.PI * (0.75 + (1.5 * k) / 4);
      p.text(`${k}×`, gx + 66 * Math.cos(a), gy + 66 * Math.sin(a));
    }
    const a = Math.PI * (0.75 + 1.5 * Math.min(4, rel) / 4);
    p.stroke(Chalk.yellow);
    p.strokeWeight(3);
    p.line(gx, gy, gx + 55 * Math.cos(a), gy + 55 * Math.sin(a));
    p.strokeWeight(1);
    p.noStroke();
    p.fill(Chalk.chalk);
    p.textSize(14);
    p.text("pressure", gx, gy + 100);

    readouts.set("p", `${rel.toFixed(2)} × normal`);
    readouts.set("hits", `${Math.round(hitRate)} per second in the sim (real air: trillions of trillions on every fingernail-sized patch)`);
    readouts.set("speed", `real air at ${t} °C: about ${Math.round(470 * Math.sqrt((t + 273) / 293))} m/s, faster than a jet airliner`);
  };
});
