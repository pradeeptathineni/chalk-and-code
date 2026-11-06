// Chalk & Code sim kit: small helpers shared by every p5.js sim.
// Each sim keeps its physics in its own sketch.js; this file only builds controls
// and draws the chalkboard look, so a sim reads like a lesson, not like plumbing.

const Chalk = {
  board: "#1f2f28",
  grid: "#2b4237",
  chalk: "#f4f1e8",
  dim: "#aab8b0",
  yellow: "#f2d46b",
  pink: "#f29fb5",
  blue: "#8fc9f2",
  green: "#9fe0a8",
};

const SimKit = {
  // A labelled slider. Returns { value() } and calls onChange(value) on input.
  slider(parent, { label, min, max, step, value, unit = "", digits = 1, onChange }) {
    const wrap = document.createElement("label");
    wrap.className = "control";
    const row = document.createElement("span");
    row.className = "row";
    const name = document.createElement("span");
    name.textContent = label;
    const out = document.createElement("output");
    row.append(name, out);
    const input = document.createElement("input");
    Object.assign(input, { type: "range", min, max, step, value });
    const show = () => (out.textContent = `${Number(input.value).toFixed(digits)} ${unit}`.trim());
    input.addEventListener("input", () => {
      show();
      if (onChange) onChange(Number(input.value));
    });
    show();
    wrap.append(row, input);
    parent.append(wrap);
    return {
      value: () => Number(input.value),
      set: (v) => {
        input.value = v;
        show();
      },
      input,
    };
  },

  checkbox(parent, { label, checked = false, onChange }) {
    const wrap = document.createElement("label");
    wrap.className = "check";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checked;
    input.addEventListener("change", () => onChange && onChange(input.checked));
    wrap.append(input, document.createTextNode(label));
    parent.append(wrap);
    return { value: () => input.checked, input };
  },

  button(parent, { label, primary = false, onClick }) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    if (primary) b.className = "primary";
    b.addEventListener("click", onClick);
    parent.append(b);
    return b;
  },

  // Readouts: SimKit.readouts(el, { t: "Time" }) then r.set("t", "1.20 s")
  readouts(parent, labels) {
    const spans = {};
    for (const [key, label] of Object.entries(labels)) {
      const s = document.createElement("span");
      const b = document.createElement("b");
      b.textContent = "–";
      s.append(`${label}: `, b);
      parent.append(s);
      spans[key] = b;
    }
    return { set: (key, text) => (spans[key].textContent = text) };
  },

  // Light chalkboard grid, spacing in pixels.
  grid(p, spacing) {
    p.background(Chalk.board);
    p.stroke(Chalk.grid);
    p.strokeWeight(1);
    for (let x = 0; x <= p.width; x += spacing) p.line(x, 0, x, p.height);
    for (let y = 0; y <= p.height; y += spacing) p.line(0, y, p.width, y);
  },

  // An arrow from (x, y) along (dx, dy) in pixels, with a label at the tip.
  arrow(p, x, y, dx, dy, color, label) {
    const len = Math.hypot(dx, dy);
    if (len < 1) return;
    p.push();
    p.stroke(color);
    p.fill(color);
    p.strokeWeight(3);
    p.line(x, y, x + dx, y + dy);
    p.translate(x + dx, y + dy);
    p.rotate(Math.atan2(dy, dx));
    const h = Math.min(10, len * 0.4);
    p.noStroke();
    p.triangle(0, 0, -h, h * 0.5, -h, -h * 0.5);
    p.pop();
    if (label) {
      p.noStroke();
      p.fill(color);
      p.textSize(14);
      p.text(label, x + dx + 6, y + dy - 6);
    }
  },

  // Fit the canvas to its container width, keeping an aspect ratio.
  fit(p, stage, aspect) {
    const w = Math.min(stage.clientWidth || 800, 960);
    p.resizeCanvas(w, Math.round(w / aspect));
  },
};
