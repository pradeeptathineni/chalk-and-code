// The light spectrum: every kind of light is a wave travelling at the same speed, c.
// Only the wavelength changes. Frequency follows from  c = wavelength × frequency.
//
// The slider works in powers of ten, because the spectrum covers waves from
// a kilometre long (10^3 m) down to smaller than an atom (10^-12 m).

const C = 3.0e8; // speed of light in metres per second
const LOG_LONG = 3; // left end of the bar: 10^3 m = 1 km
const LOG_SHORT = -12; // right end of the bar: 10^-12 m = 1 picometre

// Bands from longest to shortest. `min` is the shortest wavelength in the band, in metres.
// Real band edges are fuzzy; these are the usual textbook values.
const BANDS = [
  { name: "Radio", min: 1, color: "#c9a26b", meet: "AM and FM radio, TV broadcasts, walkie-talkies" },
  { name: "Microwave", min: 1e-3, color: "#d98f6b", meet: "wifi, Bluetooth, phones, GPS, microwave ovens, weather radar" },
  { name: "Infrared", min: 7e-7, color: "#e0736b", meet: "TV remotes, the warmth from your skin or a stove, night-vision and heat cameras" },
  { name: "Visible", min: 3.8e-7, color: "#f4f1e8", meet: "everything your eyes can see: the colours of the rainbow" },
  { name: "Ultraviolet", min: 1e-8, color: "#b38cf2", meet: "sunburn, black lights, lamps that clean water and air" },
  { name: "X-ray", min: 1e-11, color: "#8fb5f2", meet: "X-rays at the doctor and dentist, airport bag scanners" },
  { name: "Gamma ray", min: 0, color: "#8ff2d9", meet: "radioactive atoms, exploding stars, some cancer treatments" },
];

// "One wave is about as long as ..." (shortest wavelength for each comparison, in metres)
const SIZES = [
  { min: 100, text: "a sports field, or much longer" },
  { min: 1, text: "somewhere between a person and a house" },
  { min: 0.05, text: "your hand, or a ruler" },
  { min: 1e-3, text: "between a grain of rice and a coin" },
  { min: 1e-5, text: "between a hair's width and a grain of sand" },
  { min: 1e-7, text: "a bacterium, far too small to see" },
  { min: 1e-9, text: "a virus" },
  { min: 1e-11, text: "an atom" },
  { min: 0, text: "the tiny nucleus at the centre of an atom" },
];

const PRESETS = [
  { label: "FM radio", m: 3 },
  { label: "Wifi", m: 0.125 },
  { label: "TV remote", m: 9.4e-7 },
  { label: "Red", m: 6.8e-7 },
  { label: "Green", m: 5.3e-7 },
  { label: "Violet", m: 4.0e-7 },
  { label: "Sunburn UV", m: 3.0e-7 },
  { label: "X-ray", m: 1e-10 },
];

let wave; // the slider: its value is -log10(wavelength), so sliding right means shorter waves
let readouts;
let phase = 0;

const wavelength = () => Math.pow(10, -wave.value());
const bandOf = (m) => BANDS.find((b) => m >= b.min);
const sizeOf = (m) => SIZES.find((s) => m >= s.min);

// Turns a visible wavelength (380 to 750 nm) into a colour on screen.
// This is an approximation: screens can't show every spectral colour exactly.
function visibleColor(nm) {
  let r = 0, g = 0, b = 0;
  if (nm < 440) { r = (440 - nm) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = (645 - nm) / 65; }
  else { r = 1; }
  // Fade out towards the edges of what eyes can see.
  let f = 1;
  if (nm < 420) f = 0.3 + (0.7 * (nm - 380)) / 40;
  if (nm > 700) f = 0.3 + (0.7 * (750 - nm)) / 50;
  f = Math.max(0, Math.min(1, f));
  return [255 * r * f, 255 * g * f, 255 * b * f].map((v) => Math.round(Math.max(v, 30)));
}

function waveColor(m) {
  const nm = m * 1e9;
  if (nm >= 380 && nm <= 750) return visibleColor(nm);
  return bandOf(m).color;
}

// 0.000000125 -> "125 nm"; 0.125 -> "12.5 cm"
function niceLength(m) {
  const units = [
    [1e3, "km"], [1, "m"], [1e-2, "cm"], [1e-3, "mm"], [1e-6, "µm"], [1e-9, "nm"], [1e-12, "pm"],
  ];
  for (const [size, name] of units) if (m >= size * 0.999) return `${trim(m / size)} ${name}`;
  return `${trim(m / 1e-12)} pm`;
}

function niceFrequency(hz) {
  const units = [
    [1e18, "EHz"], [1e15, "PHz"], [1e12, "THz"], [1e9, "GHz"], [1e6, "MHz"], [1e3, "kHz"], [1, "Hz"],
  ];
  for (const [size, name] of units) if (hz >= size) return `${trim(hz / size)} ${name}`;
  return `${trim(hz)} Hz`;
}

// Round to a sensible number of digits and drop trailing zeros after the point: 12.50 -> 12.5
const trim = (x) => {
  const s = x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2);
  return s.includes(".") ? s.replace(/\.?0+$/, "") : s;
};

new p5((p) => {
  let stage;
  const W = 960;
  const H = 560;
  const BAR = { x: 40, y: 64, w: 880, h: 44 };
  const xOf = (m) => BAR.x + ((LOG_LONG - Math.log10(m)) / (LOG_LONG - LOG_SHORT)) * BAR.w;

  p.setup = () => {
    stage = document.getElementById("stage");
    p.createCanvas(W, H).parent(stage);
    SimKit.fit(p, stage, W / H);
    p.textFont("Helvetica");

    const controls = document.getElementById("controls");
    wave = SimKit.slider(controls, {
      label: "Wavelength (slide right for shorter waves)",
      min: -LOG_LONG, max: -LOG_SHORT, step: 0.001, value: Math.log10(1 / 6.8e-7),
      onChange: update,
    });
    wave.input.parentElement.querySelector("output").id = "wavelength-out";

    const buttons = document.getElementById("buttons");
    for (const pr of PRESETS) {
      SimKit.button(buttons, { label: pr.label, onClick: () => { wave.set(-Math.log10(pr.m)); update(); } });
    }

    readouts = SimKit.readouts(document.getElementById("readouts"), {
      band: "Kind of light",
      length: "Wavelength",
      freq: "Frequency",
      see: "Can your eyes see it?",
    });
    update();
  };

  p.windowResized = () => SimKit.fit(p, stage, W / H);

  function update() {
    const m = wavelength();
    const nm = m * 1e9;
    document.getElementById("wavelength-out").textContent = niceLength(m);
    readouts.set("band", bandOf(m).name);
    readouts.set("length", niceLength(m));
    // c = wavelength × frequency, so frequency = c / wavelength
    readouts.set("freq", `${niceFrequency(C / m)} (waves per second)`);
    readouts.set("see", nm >= 380 && nm <= 750 ? "Yes" : "No");
  }

  p.draw = () => {
    p.scale(p.width / W);
    p.background(Chalk.board);
    const m = wavelength();
    drawBar(m);
    drawWave(m);
    drawFacts(m);
  };

  function drawBar(m) {
    // Bands as coloured blocks, longest waves on the left.
    let left = BAR.x;
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textSize(13);
    for (const b of BANDS) {
      const right = b.min > 0 ? xOf(b.min) : BAR.x + BAR.w;
      p.noStroke();
      if (b.name === "Visible") {
        // The rainbow is a very thin slice of the whole spectrum.
        for (let x = left; x < right; x += 0.5) {
          const wl = Math.pow(10, LOG_LONG - ((x - BAR.x) / BAR.w) * (LOG_LONG - LOG_SHORT));
          p.fill(...visibleColor(wl * 1e9));
          p.rect(x, BAR.y, 0.6, BAR.h);
        }
        p.fill(Chalk.chalk);
        p.text("Visible", (left + right) / 2, BAR.y - 20);
        p.stroke(Chalk.dim);
        p.line((left + right) / 2, BAR.y - 18, (left + right) / 2, BAR.y - 2);
      } else {
        const c = p.color(b.color);
        c.setAlpha(110);
        p.fill(c);
        p.rect(left, BAR.y, right - left, BAR.h);
        p.fill(Chalk.chalk);
        if (right - left > 40) p.text(b.name, (left + right) / 2, BAR.y - 4);
      }
      left = right;
    }

    // Scale underneath, one tick per factor of 1000.
    p.stroke(Chalk.dim);
    p.fill(Chalk.dim);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    const ticks = [[1e3, "1 km"], [1, "1 m"], [1e-3, "1 mm"], [1e-6, "1 µm"], [1e-9, "1 nm"], [1e-12, "1 pm"]];
    for (const [v, label] of ticks) {
      const x = xOf(v);
      p.line(x, BAR.y + BAR.h, x, BAR.y + BAR.h + 6);
      p.noStroke();
      p.text(label, x, BAR.y + BAR.h + 9);
      p.stroke(Chalk.dim);
    }
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.text("← longer waves, less energy", BAR.x, BAR.y + BAR.h + 28);
    p.textAlign(p.RIGHT, p.TOP);
    p.text("shorter waves, more energy →", BAR.x + BAR.w, BAR.y + BAR.h + 28);

    // Where we are now.
    const x = xOf(m);
    p.stroke(Chalk.yellow);
    p.strokeWeight(3);
    p.line(x, BAR.y - 6, x, BAR.y + BAR.h + 6);
    p.noStroke();
    p.fill(Chalk.yellow);
    p.triangle(x - 7, BAR.y - 14, x + 7, BAR.y - 14, x, BAR.y - 5);
    p.strokeWeight(1);
  }

  function drawWave(m) {
    const top = 192;
    const mid = 285;
    const amp = 55;
    // The wave on screen is not to scale (real ones range from kilometres to smaller than atoms).
    // Longer real waves get longer screen waves, so you can see the pattern.
    const t = (LOG_LONG - Math.log10(m)) / (LOG_LONG - LOG_SHORT); // 0 = longest, 1 = shortest
    const screenLambda = 420 * Math.pow(10 / 420, t);

    // Every wave moves at the same speed on screen, just as all light moves at c.
    // Shorter waves therefore pass by more often: a higher frequency.
    phase += 2.2;

    p.fill(Chalk.dim);
    p.textSize(12);
    p.textAlign(p.LEFT, p.TOP);
    p.text("The wave (not to scale). Every kind of light travels at the same speed: about 300,000 km every second.", 40, top - 22);

    p.noFill();
    p.stroke(...[].concat(waveColor(m)));
    p.strokeWeight(3);
    p.beginShape();
    for (let x = 40; x <= 920; x += 1) {
      p.vertex(x, mid - amp * Math.sin((2 * Math.PI * (x - phase)) / screenLambda));
    }
    p.endShape();
    p.strokeWeight(1);

    const nm = m * 1e9;
    if (nm < 380 || nm > 750) {
      p.noStroke();
      p.fill(Chalk.dim);
      p.textAlign(p.RIGHT, p.TOP);
      p.text("Drawn in a made-up colour: your eyes can't see this light.", 920, mid + amp + 12);
    }

    // Mark one wavelength when it fits on screen.
    if (screenLambda > 40 && screenLambda < 700) {
      // Find a crest: sin(...) = 1 when (x - phase) / λ = 1/4 + k.
      let x0 = phase + screenLambda / 4;
      while (x0 > 40 + screenLambda) x0 -= screenLambda;
      while (x0 < 40) x0 += screenLambda;
      if (x0 + screenLambda <= 920) {
        const y = mid - amp - 18;
        p.stroke(Chalk.yellow);
        p.line(x0, y, x0 + screenLambda, y);
        p.line(x0, y - 5, x0, y + 5);
        p.line(x0 + screenLambda, y - 5, x0 + screenLambda, y + 5);
        p.noStroke();
        p.fill(Chalk.yellow);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text("one wavelength", Math.max(90, x0 + screenLambda / 2), y - 6);
      }
    }
  }

  function drawFacts(m) {
    const b = bandOf(m);
    const y = 380;
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.fill(Chalk.chalk);
    p.textSize(22);
    p.text(b.name, 40, y);

    p.textSize(15);
    p.fill(Chalk.yellow);
    p.text("Where you meet it", 40, y + 40);
    p.fill(Chalk.chalk);
    p.text(b.meet, 40, y + 60, 420);

    p.fill(Chalk.yellow);
    p.text("One wave is about the size of", 500, y + 40);
    p.fill(Chalk.chalk);
    p.text(sizeOf(m).text, 500, y + 60, 420);

    p.fill(Chalk.yellow);
    p.text("Safe?", 500, y + 110);
    p.fill(Chalk.chalk);
    let safe = "Yes. This light passes harmlessly around and through us every day.";
    if (b.name === "Ultraviolet") safe = "Too much is harmful: it causes sunburn. Sunscreen and shade block it.";
    if (b.name === "X-ray" || b.name === "Gamma ray") safe = "Enough energy to damage cells, so doctors use small, careful doses and lead shields.";
    if (b.name === "Visible") safe = "Yes, but never stare at the Sun or into a laser.";
    p.text(safe, 500, y + 130, 420);
  }
});
