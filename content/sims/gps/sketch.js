// Finding yourself with GPS (drawn flat, as if seen from above).
//
// Each satellite sends out the time. The phone notes when each signal arrives:
//     distance = speed of light × time the signal took
// One distance puts you somewhere on a circle around that satellite.
// Two circles cross at two points. A third circle picks the one right point.
// (Real GPS works in 3D, so it uses spheres, and a fourth satellite to fix the phone's clock.)

const W = 960;
const H = 560;
const KM_PER_PX = 50; // map scale: 1 pixel = 50 km
const C_KM_PER_MS = 300; // light travels 300 km every millisecond

const SATS = [
  { x: 150, y: 110, color: "#f29fb5", name: "A" },
  { x: 820, y: 140, color: "#8fc9f2", name: "B" },
  { x: 520, y: 500, color: "#9fe0a8", name: "C" },
];

let phone = { x: 430, y: 270 };
let shown = 0; // how many circles to show
let clockError, readouts;
let dragging = false;

new p5((p) => {
  let stage;

  p.setup = () => {
    stage = document.getElementById("stage");
    p.createCanvas(W, H).parent(stage);
    SimKit.fit(p, stage, W / H);
    p.textFont("Helvetica");

    const controls = document.getElementById("controls");
    clockError = SimKit.slider(controls, { label: "Phone's clock is wrong by", min: 0, max: 3, step: 0.1, value: 0, unit: "ms" });

    const buttons = document.getElementById("buttons");
    SimKit.button(buttons, { label: "Show the next circle", primary: true, onClick: () => (shown = Math.min(3, shown + 1)) });
    SimKit.button(buttons, { label: "Hide circles", onClick: () => (shown = 0) });

    readouts = SimKit.readouts(document.getElementById("readouts"), { A: "Signal A took", B: "Signal B took", C: "Signal C took", where: "So you are" });
  };

  p.windowResized = () => SimKit.fit(p, stage, W / H);

  const mx = () => (p.mouseX * W) / p.width;
  const my = () => (p.mouseY * W) / p.width;
  p.mousePressed = () => {
    if (Math.hypot(mx() - phone.x, my() - phone.y) < 40) {
      dragging = true;
      return false;
    }
  };
  p.mouseDragged = () => {
    if (!dragging) return;
    phone.x = Math.min(W - 20, Math.max(20, mx()));
    phone.y = Math.min(H - 20, Math.max(20, my()));
    return false;
  };
  p.mouseReleased = () => (dragging = false);

  p.draw = () => {
    p.scale(p.width / W);
    SimKit.grid(p, 40);

    // Travel time for each signal, plus the phone's clock error (a slow clock makes every signal look later).
    const times = SATS.map((s) => (Math.hypot(phone.x - s.x, phone.y - s.y) * KM_PER_PX) / C_KM_PER_MS + clockError.value());

    // Circles: the distances the phone *thinks* it is from each satellite
    for (let i = 0; i < shown; i++) {
      const s = SATS[i];
      const rPx = (times[i] * C_KM_PER_MS) / KM_PER_PX;
      p.noFill();
      p.stroke(s.color);
      p.strokeWeight(2);
      p.circle(s.x, s.y, 2 * rPx);
      p.strokeWeight(1);
    }

    for (const s of SATS) drawSatellite(s);

    // The phone
    p.noStroke();
    p.fill("#2b2b2b");
    p.rect(phone.x - 11, phone.y - 18, 22, 36, 4);
    p.fill(Chalk.yellow);
    p.rect(phone.x - 8, phone.y - 14, 16, 24, 2);
    p.fill(Chalk.dim);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("drag me", phone.x, phone.y + 22);

    // Scale bar
    p.stroke(Chalk.chalk);
    p.line(40, H - 30, 40 + 1000 / KM_PER_PX, H - 30);
    p.noStroke();
    p.fill(Chalk.chalk);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("1,000 km", 40, H - 34);

    SATS.forEach((s, i) => readouts.set(s.name, `${times[i].toFixed(2)} ms = ${Math.round(times[i] * C_KM_PER_MS).toLocaleString()} km away`));
    const where = [
      "anywhere! Show a circle.",
      "somewhere on circle A",
      "at one of the two places where circles A and B cross",
      clockError.value() > 0.05 ? "lost: the circles don't meet at one point (the clock is wrong)" : "exactly where all three circles meet",
    ][shown];
    readouts.set("where", where);
  };

  function drawSatellite(s) {
    p.push();
    p.translate(s.x, s.y);
    p.noStroke();
    p.fill("#9aa3ab");
    p.rect(-26, -6, 16, 12);
    p.rect(10, -6, 16, 12);
    p.fill(s.color);
    p.rect(-10, -10, 20, 20, 3);
    p.fill(Chalk.board);
    p.textSize(13);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(s.name, 0, 1);
    p.pop();
  }
});
