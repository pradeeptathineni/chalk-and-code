// Who can hear it? Hearing ranges of people and animals.
//
// A sound's pitch is its frequency: how many times per second it shakes the air (hertz, Hz).
// Sound travels through air at about 340 m/s, so one wave in air is
//     wavelength = 340 ÷ frequency
// Below about 20 Hz is infrasound; above about 20,000 Hz is ultrasound. People can't hear either.

const W = 960;
const H = 560;
const LOG_MIN = -1; // 0.1 Hz
const LOG_MAX = 7.3; // 20 MHz
const SOUND_SPEED = 340;

// Approximate hearing ranges in Hz. Every animal (and person) differs, so treat these as rough.
const HEARERS = [
  { name: "Elephant", lo: 16, hi: 12000 },
  { name: "Person (young)", lo: 20, hi: 20000 },
  { name: "Person (older adult)", lo: 20, hi: 12000 },
  { name: "Dog", lo: 67, hi: 45000 },
  { name: "Cat", lo: 45, hi: 64000 },
  { name: "Mouse", lo: 1000, hi: 91000 },
  { name: "Bat", lo: 2000, hi: 110000 },
  { name: "Dolphin", lo: 75, hi: 150000 },
];

const PRESETS = [
  { label: "Earthquake rumble", hz: 1 },
  { label: "Elephant rumble", hz: 18 },
  { label: "Lowest piano note", hz: 27.5 },
  { label: "Middle C", hz: 262 },
  { label: "Highest piano note", hz: 4186 },
  { label: "Dog whistle", hz: 25000 },
  { label: "Bat call", hz: 50000 },
  { label: "Medical scan", hz: 3000000 },
];

let freq, readouts;
let audio = null;

const hz = () => Math.pow(10, freq.value());

function niceHz(f) {
  if (f >= 1e6) return `${+(f / 1e6).toFixed(1)} MHz (million per second)`;
  if (f >= 1e3) return `${+(f / 1e3).toFixed(f >= 1e4 ? 0 : 1)} kHz (thousand per second)`;
  return `${+f.toFixed(f < 10 ? 1 : 0)} Hz`;
}
function niceLen(m) {
  if (m >= 1000) return `${+(m / 1000).toFixed(1)} km`;
  if (m >= 1) return `${+m.toFixed(1)} m`;
  if (m >= 0.01) return `${+(m * 100).toFixed(1)} cm`;
  if (m >= 0.001) return `${+(m * 1000).toFixed(1)} mm`;
  return `${+(m * 1e6).toFixed(0)} micrometres (thinner than a hair)`;
}

function play() {
  const f = hz();
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.frequency.value = Math.min(f, 22000);
    gain.gain.setValueAtTime(0, audio.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, audio.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, audio.currentTime + 1.2);
    osc.connect(gain).connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + 1.3);
  } catch (e) {
    /* no sound available: the picture still works */
  }
}

new p5((p) => {
  let stage;
  const X0 = 200;
  const X1 = 920;
  const xOf = (f) => X0 + ((Math.log10(f) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (X1 - X0);

  p.setup = () => {
    stage = document.getElementById("stage");
    p.createCanvas(W, H).parent(stage);
    SimKit.fit(p, stage, W / H);
    p.textFont("Helvetica");

    const controls = document.getElementById("controls");
    freq = SimKit.slider(controls, { label: "Frequency (pitch)", min: LOG_MIN, max: LOG_MAX, step: 0.001, value: Math.log10(262), onChange: update });
    freq.input.parentElement.querySelector("output").id = "freq-out";

    const buttons = document.getElementById("buttons");
    SimKit.button(buttons, { label: "▶ Play it", primary: true, onClick: play });
    for (const pr of PRESETS) SimKit.button(buttons, { label: pr.label, onClick: () => { freq.set(Math.log10(pr.hz)); update(); } });

    readouts = SimKit.readouts(document.getElementById("readouts"), { kind: "Kind of sound", wave: "One wave in air is", who: "Who can hear it" });
    update();
  };

  p.windowResized = () => SimKit.fit(p, stage, W / H);

  function update() {
    const f = hz();
    document.getElementById("freq-out").textContent = niceHz(f);
    readouts.set("kind", f < 20 ? "infrasound (too low for people)" : f > 20000 ? "ultrasound (too high for people)" : "sound people can hear");
    readouts.set("wave", niceLen(SOUND_SPEED / f));
    const who = HEARERS.filter((h) => f >= h.lo && f <= h.hi).map((h) => h.name.toLowerCase());
    readouts.set("who", who.length ? who.join(", ") : "none of these animals");
  }

  p.draw = () => {
    p.scale(p.width / W);
    p.background(Chalk.board);
    const f = hz();

    // Infrasound / audible / ultrasound zones
    p.noStroke();
    p.fill(143, 201, 242, 25);
    p.rect(X0, 40, xOf(20) - X0, 420);
    p.fill(159, 224, 168, 25);
    p.rect(xOf(20), 40, xOf(20000) - xOf(20), 420);
    p.fill(242, 159, 181, 25);
    p.rect(xOf(20000), 40, X1 - xOf(20000), 420);
    p.fill(Chalk.dim);
    p.textSize(14);
    p.textAlign(p.CENTER, p.TOP);
    p.text("infrasound", (X0 + xOf(20)) / 2, 46);
    p.text("what people hear", (xOf(20) + xOf(20000)) / 2, 46);
    p.text("ultrasound", (xOf(20000) + X1) / 2, 46);

    // Hearing ranges as bars
    HEARERS.forEach((h, i) => {
      const y = 90 + i * 44;
      const can = f >= h.lo && f <= h.hi;
      p.noStroke();
      p.fill(can ? Chalk.chalk : Chalk.dim);
      p.textSize(15);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(h.name, X0 - 12, y);
      p.fill(can ? "#f2d46b" : "rgba(244,241,232,0.35)");
      p.rect(xOf(h.lo), y - 9, xOf(h.hi) - xOf(h.lo), 18, 9);
    });

    // Axis
    const ay = 460;
    p.stroke(Chalk.dim);
    p.line(X0, ay, X1, ay);
    p.noStroke();
    p.fill(Chalk.dim);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    const ticks = [[0.1, "0.1 Hz"], [1, "1 Hz"], [10, "10 Hz"], [100, "100 Hz"], [1000, "1 kHz"], [1e4, "10 kHz"], [1e5, "100 kHz"], [1e6, "1 MHz"], [1e7, "10 MHz"]];
    for (const [v, lab] of ticks) {
      p.stroke(Chalk.dim);
      p.line(xOf(v), ay, xOf(v), ay + 6);
      p.noStroke();
      p.text(lab, xOf(v), ay + 9);
    }
    p.textAlign(p.LEFT, p.TOP);
    p.text("← lower pitch, longer waves", X0, ay + 28);
    p.textAlign(p.RIGHT, p.TOP);
    p.text("higher pitch, shorter waves →", X1, ay + 28);

    // Current frequency marker
    const x = xOf(f);
    p.stroke(Chalk.yellow);
    p.strokeWeight(3);
    p.line(x, 70, x, ay);
    p.strokeWeight(1);

    // A little sound wave drawn at the bottom-left, squashier for higher pitches
    const cycles = 1.5 + 6 * ((Math.log10(f) - LOG_MIN) / (LOG_MAX - LOG_MIN));
    p.noFill();
    p.stroke(Chalk.blue);
    p.strokeWeight(2);
    p.beginShape();
    for (let i = 0; i <= 150; i++) p.vertex(20 + i, 515 - 14 * Math.sin((2 * Math.PI * cycles * i) / 150 - p.frameCount * 0.15));
    p.endShape();
    p.strokeWeight(1);
  };
});
