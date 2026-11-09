// A message on a wave: how radio, wifi and Bluetooth carry information.
//
// 1. Each letter becomes a code of eight bits (1s and 0s). "H" is 01001000.
// 2. The bits change a steady "carrier" wave:
//      On–off: wave on for a 1, off for a 0 (like Morse code with a flashlight)
//      AM (amplitude modulation): big wave for a 1, small wave for a 0
//      FM (frequency modulation): fast wiggles for a 1, slow wiggles for a 0
// 3. On the way, the wave picks up noise. The receiver has to guess each bit back.

const W = 960;
const H = 560;
const PER_BIT = 64; // samples per bit
const SHOW_BITS = 16; // bits drawn on screen (the first two letters)
const X0 = 40;
const BIT_W = 880 / SHOW_BITS;

let mode = "am";
let noise, readouts, msgInput;
let sent = []; // samples of the sent wave
let received = [];
let bits = [];

function toBits(text) {
  const out = [];
  for (const ch of text) {
    const code = ch.charCodeAt(0) & 255;
    for (let b = 7; b >= 0; b--) out.push((code >> b) & 1);
  }
  return out;
}

function fromBits(bs) {
  let s = "";
  for (let i = 0; i + 7 < bs.length; i += 8) {
    let c = 0;
    for (let b = 0; b < 8; b++) c = c * 2 + bs[i + b];
    s += c >= 32 && c < 127 ? String.fromCharCode(c) : "?";
  }
  return s;
}

// The sent wave for one sample n inside bit b
function sample(bit, n) {
  const t = n / PER_BIT; // 0..1 across the bit
  if (mode === "onoff") return bit ? Math.sin(2 * Math.PI * 4 * t) : 0;
  if (mode === "am") return (bit ? 1 : 0.35) * Math.sin(2 * Math.PI * 4 * t);
  return Math.sin(2 * Math.PI * (bit ? 6 : 3) * t); // fm
}

// A bell-shaped random number (the usual shape of noise)
function gauss() {
  return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
}

function send() {
  bits = toBits(msgInput.value || " ");
  sent = [];
  received = [];
  for (const bit of bits) {
    for (let n = 0; n < PER_BIT; n++) {
      const s = sample(bit, n);
      sent.push(s);
      received.push(s + noise.value() * gauss());
    }
  }
}

// The receiver's guess for each bit.
// AM and on–off receivers judge how big the wave is, so noise (which makes everything bigger) fools them.
// An FM receiver only cares how fast the wave wiggles, which noise changes much less.
function decode() {
  const out = [];
  const sizes = [];
  for (let i = 0; i < bits.length; i++) {
    const chunk = received.slice(i * PER_BIT, (i + 1) * PER_BIT);
    if (mode === "fm") {
      // Compare the chunk with a slow wiggle and a fast wiggle; pick whichever matches better.
      const match = (cycles) => {
        let a = 0;
        let b = 0;
        for (let n = 0; n < chunk.length; n++) {
          const ph = (2 * Math.PI * cycles * n) / PER_BIT;
          a += chunk[n] * Math.sin(ph);
          b += chunk[n] * Math.cos(ph);
        }
        return a * a + b * b;
      };
      out.push(match(6) > match(3) ? 1 : 0);
    } else {
      // Measure how big the wave is in this bit.
      sizes.push(Math.sqrt(chunk.reduce((s, v) => s + v * v, 0) / chunk.length));
    }
  }
  if (mode !== "fm") {
    // Call a bit 1 if it's bigger than halfway between the smallest and biggest bits seen.
    const cut = (Math.min(...sizes) + Math.max(...sizes)) / 2;
    for (const s of sizes) out.push(s > cut ? 1 : 0);
  }
  return out;
}

new p5((p) => {
  let stage;
  const modeBtns = {};

  p.setup = () => {
    stage = document.getElementById("stage");
    p.createCanvas(W, H).parent(stage);
    SimKit.fit(p, stage, W / H);
    p.textFont("Helvetica");

    const controls = document.getElementById("controls");
    msgInput = document.getElementById("msg");
    msgInput.addEventListener("input", () => {
      msgInput.value = msgInput.value.toUpperCase();
      send();
    });
    noise = SimKit.slider(controls, { label: "Noise on the way", min: 0, max: 3, step: 0.05, value: 0.3, digits: 2, onChange: send });

    const buttons = document.getElementById("buttons");
    modeBtns.onoff = SimKit.button(buttons, { label: "On–off", onClick: () => setMode("onoff") });
    modeBtns.am = SimKit.button(buttons, { label: "AM: bigger and smaller", onClick: () => setMode("am") });
    modeBtns.fm = SimKit.button(buttons, { label: "FM: faster and slower", onClick: () => setMode("fm") });
    SimKit.button(buttons, { label: "Send again", primary: true, onClick: send });

    readouts = SimKit.readouts(document.getElementById("readouts"), { got: "Received", wrong: "Bits wrong" });
    setMode("am");
  };

  p.windowResized = () => SimKit.fit(p, stage, W / H);

  function setMode(m) {
    mode = m;
    for (const [k, b] of Object.entries(modeBtns)) b.className = k === m ? "primary" : "";
    send();
  }

  function trace(samples, top, h, color) {
    const n = Math.min(samples.length, SHOW_BITS * PER_BIT);
    p.noFill();
    p.stroke(color);
    p.strokeWeight(1.6);
    p.beginShape();
    for (let i = 0; i < n; i++) p.vertex(X0 + (i * BIT_W) / PER_BIT, top + h / 2 - (h / 2.6) * Math.max(-1.3, Math.min(1.3, samples[i])));
    p.endShape();
    p.strokeWeight(1);
  }

  function label(text, y) {
    p.noStroke();
    p.fill(Chalk.yellow);
    p.textSize(14);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text(text, X0, y - 4);
  }

  p.draw = () => {
    p.scale(p.width / W);
    p.background(Chalk.board);
    const guess = decode();
    const shown = Math.min(SHOW_BITS, bits.length);

    // Bit boundaries and letters
    for (let i = 0; i <= shown; i++) {
      p.stroke(Chalk.grid);
      p.line(X0 + i * BIT_W, 40, X0 + i * BIT_W, H - 20);
    }
    p.noStroke();
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textSize(14);
    p.fill(Chalk.chalk);
    const text = msgInput.value || " ";
    for (let L = 0; L < Math.min(2, text.length); L++) p.text(`"${text[L]}"`, X0 + (L * 8 + 4) * BIT_W, 34);

    // 1. Bits
    label("1. The message as bits", 70);
    for (let i = 0; i < shown; i++) {
      p.fill(bits[i] ? Chalk.yellow : Chalk.dim);
      p.textSize(22);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(bits[i], X0 + (i + 0.5) * BIT_W, 90);
    }

    // 2. Wave sent
    label("2. The wave sent from the antenna", 140);
    trace(sent, 140, 110, Chalk.blue);

    // 3. Wave received
    label("3. The wave that arrives, with noise picked up on the way", 290);
    trace(received, 290, 130, "#e0a36b");

    // 4. Receiver's guesses
    label("4. What the receiver works out", 470);
    for (let i = 0; i < shown; i++) {
      const ok = guess[i] === bits[i];
      p.fill(ok ? Chalk.green : "#e05a5a");
      p.textSize(22);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(guess[i], X0 + (i + 0.5) * BIT_W, 490);
    }
    p.fill(Chalk.dim);
    p.textSize(12);
    p.textAlign(p.LEFT, p.TOP);
    if (bits.length > SHOW_BITS) p.text(`Showing the first 2 letters; all ${text.length} are sent.`, X0, 520);

    const wrong = guess.reduce((s, g, i) => s + (g !== bits[i] ? 1 : 0), 0);
    readouts.set("got", `"${fromBits(guess)}"`);
    readouts.set("wrong", `${wrong} of ${bits.length}`);
  };
});
