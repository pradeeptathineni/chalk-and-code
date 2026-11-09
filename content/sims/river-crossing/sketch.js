// River crossing: relative velocity as vector addition.
// v(boat, ground) = v(boat, water) + v(water, ground)
// Heading is measured from straight across: 0° points at the far bank, negative angles point upstream.

const RIVER_W = 40; // metres across
const RIVER_L = 80; // metres of river shown along the flow
let boatSpeed, heading, current;
let boat = null; // {x, y, t, path, moving}
let readouts;

new p5((p) => {
  let stage;
  let scale;

  p.setup = () => {
    stage = document.getElementById("stage");
    p.createCanvas(960, 560).parent(stage);
    SimKit.fit(p, stage, 12 / 7);
    p.textFont("Helvetica");

    const controls = document.getElementById("controls");
    boatSpeed = SimKit.slider(controls, { label: "Boat speed (in still water)", min: 1, max: 8, step: 0.5, value: 4, unit: "m/s", onChange: reset });
    heading = SimKit.slider(controls, { label: "Heading (0° = straight across)", min: -80, max: 80, step: 1, value: 0, unit: "°", digits: 0, onChange: reset });
    current = SimKit.slider(controls, { label: "River current", min: 0, max: 6, step: 0.5, value: 2, unit: "m/s", onChange: reset });

    const buttons = document.getElementById("buttons");
    SimKit.button(buttons, { label: "Cross", primary: true, onClick: cross });
    SimKit.button(buttons, { label: "Reset", onClick: reset });
    SimKit.button(buttons, {
      label: "Show me: land opposite",
      onClick: () => {
        const ratio = current.value() / boatSpeed.value();
        if (ratio >= 1) {
          alert("The current is as fast as the boat or faster, so no heading lands straight across. Try a faster boat.");
          return;
        }
        heading.set(-Math.round((Math.asin(ratio) * 180) / Math.PI));
        cross();
      },
    });

    readouts = SimKit.readouts(document.getElementById("readouts"), {
      ground: "Speed over ground",
      time: "Time to cross",
      drift: "Downstream drift",
    });
    reset();
  };

  p.windowResized = () => SimKit.fit(p, stage, 12 / 7);

  function velocity() {
    const th = (heading.value() * Math.PI) / 180;
    // x runs downstream (to the right), y runs across (up the screen).
    return {
      bx: boatSpeed.value() * Math.sin(th),
      by: boatSpeed.value() * Math.cos(th),
      wx: current.value(),
      wy: 0,
    };
  }

  function reset() {
    boat = { x: 20, y: 0, t: 0, path: [{ x: 20, y: 0 }], moving: false };
    const v = velocity();
    const gx = v.bx + v.wx;
    const gy = v.by;
    readouts.set("ground", `${Math.hypot(gx, gy).toFixed(2)} m/s`);
    readouts.set("time", `${(RIVER_W / gy).toFixed(1)} s`);
    readouts.set("drift", `${((gx * RIVER_W) / gy).toFixed(1)} m`);
  }

  function cross() {
    reset();
    boat.moving = true;
  }

  const sx = (m) => 20 + m * scale;
  const sy = (m) => p.height - 50 - m * scale;

  p.draw = () => {
    scale = Math.min((p.width - 40) / RIVER_L, (p.height - 100) / RIVER_W);
    p.background(Chalk.board);

    // Banks and water.
    p.noStroke();
    p.fill("#284a5a");
    p.rect(sx(0), sy(RIVER_W), RIVER_L * scale, RIVER_W * scale);
    p.fill(Chalk.grid);
    p.rect(0, sy(0), p.width, 50);
    p.rect(0, 0, p.width, sy(RIVER_W));

    // Flowing current lines.
    p.stroke(143, 201, 242, 90);
    p.strokeWeight(2);
    const shift = ((p.millis() / 1000) * current.value() * scale) % 60;
    for (let row = 4; row < RIVER_W; row += 8) {
      for (let x = -60 + shift; x < RIVER_L * scale; x += 60) {
        p.line(sx(0) + x, sy(row), sx(0) + x + 20, sy(row));
      }
    }

    // Docks: start and the point straight across.
    p.noStroke();
    p.fill(Chalk.chalk);
    p.rect(sx(20) - 6, sy(0), 12, 10);
    p.fill(Chalk.green);
    p.rect(sx(20) - 6, sy(RIVER_W) - 10, 12, 10);
    p.textSize(12);
    p.text("dock", sx(20) + 10, sy(0) + 14);
    p.text("straight across", sx(20) + 10, sy(RIVER_W) - 14);

    const v = velocity();
    if (boat.moving) {
      const dt = Math.min(p.deltaTime / 1000, 0.05);
      boat.x += (v.bx + v.wx) * dt;
      boat.y += v.by * dt;
      boat.t += dt;
      boat.path.push({ x: boat.x, y: boat.y });
      if (boat.y >= RIVER_W || boat.x > RIVER_L + 10) boat.moving = false;
    }

    // Path so far.
    p.noFill();
    p.stroke(Chalk.yellow);
    p.strokeWeight(2);
    p.beginShape();
    for (const q of boat.path) p.vertex(sx(q.x), sy(q.y));
    p.endShape();

    // Boat, drawn pointing where it is heading (not where it is going).
    p.push();
    p.translate(sx(boat.x), sy(boat.y));
    p.rotate((heading.value() * Math.PI) / 180);
    p.noStroke();
    p.fill(Chalk.chalk);
    p.triangle(0, -14, -7, 8, 7, 8);
    p.pop();

    // Vector triangle, drawn large in a corner box so it is easy to read:
    // boat-through-water + water = boat-over-ground.
    const k = 16; // pixels per m/s
    const boxW = 230;
    const boxH = 200;
    const bx0 = sx(RIVER_L) - boxW - 10;
    const by0 = sy(RIVER_W) + 12;
    p.noStroke();
    p.fill(31, 47, 40, 220);
    p.rect(bx0, by0, boxW, boxH, 8);
    p.fill(Chalk.chalk);
    p.textSize(13);
    p.text("Adding velocities", bx0 + 10, by0 + 18);
    const ox = bx0 + 70;
    const oy = by0 + boxH - 24;
    SimKit.arrow(p, ox, oy, v.bx * k, -v.by * k, Chalk.chalk, "");
    SimKit.arrow(p, ox + v.bx * k, oy - v.by * k, v.wx * k, 0, Chalk.blue, "");
    SimKit.arrow(p, ox, oy, (v.bx + v.wx) * k, -v.by * k, Chalk.yellow, "");
    p.noStroke();
    p.textSize(12);
    p.fill(Chalk.chalk);
    p.text("white: boat through water", bx0 + 10, by0 + 36);
    p.fill(Chalk.blue);
    p.text("blue: water over ground", bx0 + 10, by0 + 52);
    p.fill(Chalk.yellow);
    p.text("yellow: boat over ground", bx0 + 10, by0 + 68);
  };
});
