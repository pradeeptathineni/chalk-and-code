---
title: "Simulations"
summary: "Every interactive simulation, each one runnable on its own."
---

Each sim is a single page with a p5.js sketch. Open one directly, or meet it inside its lesson.

| Sim | Teaches | Used in |
|---|---|---|
| [Motion graphs](./motion-graphs/index.html) | position, velocity and acceleration graphs of one cart | [Where is it?](../tracks/physics/01-motion/01-where-is-it.md), [How fast?](../tracks/physics/01-motion/02-how-fast.md), [Speeding up](../tracks/physics/01-motion/03-speeding-up.md) |
| [Projectile motion](./projectile-motion/index.html) | independent horizontal and vertical motion, range, air drag | [Projectile motion](../tracks/physics/01-motion/04-projectile-motion.md) |
| [River crossing](./river-crossing/index.html) | relative velocity as vector addition | [Relative velocity](../tracks/physics/01-motion/05-relative-velocity.md) |

## How a sim is put together

```
sims/
├── lib/
│   ├── p5.min.js       p5.js 1.11.1 (LGPL-2.1, unmodified; licence in p5.LICENSE.txt)
│   ├── sim-kit.js      shared sliders, buttons, arrows and the chalkboard look
│   └── sim.css
└── projectile-motion/
    ├── index.html      the page: title, hint, canvas, controls
    └── sketch.js       the physics, written out with comments
```

To make a new sim, copy a folder, rename it, and rewrite `sketch.js`. Keep the physics readable: a student should be able to open the file and find the equation from the lesson.
