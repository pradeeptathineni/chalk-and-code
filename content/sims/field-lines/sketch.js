// Pushes without touching: magnetic and electric fields.
//
// Every pole (north or south) or charge (+ or −) makes a field around it.
// The field from one pole points away from a north pole (or + charge) and
// towards a south pole (or − charge), and gets weaker with distance:
//
//     field = strength / distance²   (pointing straight away from the pole)
//
// Add up the field from every pole and you get the field anywhere on the board.
// A compass needle lines up with it. Like poles push apart; unlike poles pull together.

const W = 960;
const H = 560;
const MAGNET_L = 140; // length of a bar magnet on screen
const MAGNET_T = 34; // thickness

let things = []; // magnets: {kind:"magnet", x, y, angle}; charges: {kind:"charge", x, y, q}
let dragging = null;
let showLines, showCompass, readouts;

function setup2Magnets() {
  things = [
    { kind: "magnet", x: 300, y: 280, angle: 0 },
    { kind: "magnet", x: 640, y: 280, angle: 0 },
  ];
}
function setup1Magnet() {
  things = [{ kind: "magnet", x: 480, y: 280, angle: 0 }];
}
function setupCharges() {
  things = [
    { kind: "charge", x: 340, y: 280, q: 1 },
    { kind: "charge", x: 620, y: 280, q: -1 },
  ];
}

// The poles of everything on the board, as {x, y, q}. A magnet's north pole counts as +1, south as −1.
function poles() {
  const list = [];
  for (const t of things) {
    if (t.kind === "charge") list.push({ x: t.x, y: t.y, q: t.q, owner: t });
    else {
      const d = MAGNET_L / 2 - 12;
      const cx = Math.cos(t.angle);
      const cy = Math.sin(t.angle);
      list.push({ x: t.x + d * cx, y: t.y + d * cy, q: 1, owner: t }); // north end
      list.push({ x: t.x - d * cx, y: t.y - d * cy, q: -1, owner: t }); // south end
    }
  }
  return list;
}

// Field at (x, y): add up strength / distance² from every pole, pointing away from + and towards −.
function fieldAt(x, y, list, skipOwner) {
  let fx = 0;
  let fy = 0;
  for (const p of list) {
    if (p.owner === skipOwner) continue;
    const dx = x - p.x;
    const dy = y - p.y;
    const r2 = Math.max(dx * dx + dy * dy, 100);
    const r = Math.sqrt(r2);
    fx += (p.q * dx) / (r2 * r);
    fy += (p.q * dy) / (r2 * r);
  }
  return { fx, fy };
}

// Push or pull on the second object from the first: force on each pole = its q × the field there.
function forceOnSecond() {
  if (things.length < 2) return null;
  const list = poles();
  const b = things[1];
  let fx = 0;
  let fy = 0;
  for (const p of list.filter((p) => p.owner === b)) {
    const f = fieldAt(p.x, p.y, list, b);
    fx += p.q * f.fx;
    fy += p.q * f.fy;
  }
  // Positive "towards" means the second object is pulled towards the first.
  const a = things[0];
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const d = Math.hypot(dx, dy) || 1;
  return { fx, fy, towards: (fx * dx + fy * dy) / d, size: Math.hypot(fx, fy) };
}

new p5((p) => {
  let stage;

  p.setup = () => {
    stage = document.getElementById("stage");
    p.createCanvas(W, H).parent(stage);
    SimKit.fit(p, stage, W / H);
    p.textFont("Helvetica");

    const controls = document.getElementById("controls");
    showCompass = SimKit.checkbox(controls, { label: "Show compass needles", checked: true });
    showLines = SimKit.checkbox(controls, { label: "Show field lines", checked: true });

    const buttons = document.getElementById("buttons");
    SimKit.button(buttons, { label: "Two magnets", primary: true, onClick: setup2Magnets });
    SimKit.button(buttons, { label: "One magnet", onClick: setup1Magnet });
    SimKit.button(buttons, { label: "Two charges", onClick: setupCharges });
    SimKit.button(buttons, { label: "Flip the right one", onClick: flip });

    readouts = SimKit.readouts(document.getElementById("readouts"), { what: "The two are", how: "How strongly" });
    setup2Magnets();
  };

  p.windowResized = () => SimKit.fit(p, stage, W / H);

  function flip() {
    const t = things[things.length - 1];
    if (t.kind === "magnet") t.angle += Math.PI;
    else t.q = -t.q;
  }

  const mx = () => (p.mouseX * W) / p.width;
  const my = () => (p.mouseY * W) / p.width;

  p.mousePressed = () => {
    let best = null;
    let bestD = 80;
    for (const t of things) {
      const d = Math.hypot(mx() - t.x, my() - t.y);
      if (d < bestD) {
        best = t;
        bestD = d;
      }
    }
    dragging = best;
    if (best) return false;
  };
  p.mouseDragged = () => {
    if (!dragging) return;
    dragging.x = Math.min(W - 40, Math.max(40, mx()));
    dragging.y = Math.min(H - 40, Math.max(40, my()));
    return false;
  };
  p.mouseReleased = () => {
    dragging = null;
  };

  p.draw = () => {
    p.scale(p.width / W);
    SimKit.grid(p, 40);
    const list = poles();
    if (showLines.value()) drawLines(list);
    if (showCompass.value()) drawCompasses(list);
    for (const t of things) (t.kind === "magnet" ? drawMagnet : drawCharge)(t);
    drawForce();
  };

  function drawCompasses(list) {
    for (let x = 30; x < W; x += 40) {
      for (let y = 30; y < H; y += 40) {
        if (things.some((t) => Math.hypot(x - t.x, y - t.y) < (t.kind === "magnet" ? 70 : 30))) continue;
        const f = fieldAt(x, y, list);
        const len = Math.hypot(f.fx, f.fy);
        if (len === 0) continue;
        const ux = f.fx / len;
        const uy = f.fy / len;
        // Brighter needles where the field is stronger.
        const bright = Math.min(255, 70 + 4e6 * len);
        p.strokeWeight(2);
        p.stroke(242, 159, 181, bright); // the end pointing along the field (where a compass's north end points)
        p.line(x, y, x + 11 * ux, y + 11 * uy);
        p.stroke(143, 201, 242, bright);
        p.line(x, y, x - 11 * ux, y - 11 * uy);
      }
    }
    p.strokeWeight(1);
  }

  // Follow the field step by step from each + pole: that traces a field line.
  function drawLines(list) {
    const starts = list.filter((q) => q.q > 0);
    const dir = starts.length ? 1 : -1;
    const from = starts.length ? starts : list;
    p.noFill();
    p.stroke(244, 241, 232, 90);
    p.strokeWeight(1.2);
    for (const s of from) {
      const n = s.owner.kind === "charge" ? 16 : 14;
      for (let k = 0; k < n; k++) {
        const a = (2 * Math.PI * k) / n;
        let x = s.x + 8 * Math.cos(a);
        let y = s.y + 8 * Math.sin(a);
        p.beginShape();
        for (let i = 0; i < 700; i++) {
          p.vertex(x, y);
          const f = fieldAt(x, y, list);
          const len = Math.hypot(f.fx, f.fy);
          if (len === 0) break;
          x += (dir * 4 * f.fx) / len;
          y += (dir * 4 * f.fy) / len;
          if (x < -20 || x > W + 20 || y < -20 || y > H + 20) break;
          if (list.some((q) => q.q === -s.q * dir * dir && q !== s && Math.hypot(x - q.x, y - q.y) < 6)) break;
        }
        p.endShape();
      }
    }
    p.strokeWeight(1);
  }

  function drawMagnet(t) {
    p.push();
    p.translate(t.x, t.y);
    p.rotate(t.angle);
    p.noStroke();
    p.fill("#d9506b");
    p.rect(0, -MAGNET_T / 2, MAGNET_L / 2, MAGNET_T, 0, 6, 6, 0);
    p.fill("#4f86c6");
    p.rect(-MAGNET_L / 2, -MAGNET_T / 2, MAGNET_L / 2, MAGNET_T, 6, 0, 0, 6);
    p.fill(255);
    p.textSize(20);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("N", MAGNET_L / 4, 1);
    p.text("S", -MAGNET_L / 4, 1);
    p.pop();
  }

  function drawCharge(t) {
    p.noStroke();
    p.fill(t.q > 0 ? "#d9506b" : "#4f86c6");
    p.circle(t.x, t.y, 44);
    p.fill(255);
    p.textSize(30);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(t.q > 0 ? "+" : "−", t.x, t.y + 1);
  }

  function drawForce() {
    const f = forceOnSecond();
    if (!f) {
      readouts.set("what", "on its own (add another to see a push or pull)");
      readouts.set("how", "–");
      return;
    }
    const pulling = f.towards > 0;
    readouts.set("what", pulling ? "pulling together (attracting)" : "pushing apart (repelling)");
    const s = f.size * 1e7;
    readouts.set("how", s > 150 ? "very strongly" : s > 40 ? "strongly" : s > 10 ? "a little" : "hardly at all");
    // Arrow on the second object showing the push or pull it feels.
    const b = things[1];
    const scale = Math.min(110, 15 + 6 * Math.sqrt(s));
    SimKit.arrow(p, b.x, b.y - 40, (scale * f.fx) / f.size, (scale * f.fy) / f.size, Chalk.yellow, pulling ? "pull" : "push");
  }
});
