---
title: "Physics"
summary: "How things move and why, with a simulation for every idea."
tags: [physics]
---

Physics is the subject where code helps most. An equation tells you what happens. A simulation lets you change one number and **watch** what happens, and that is usually the moment it makes sense.

## Units

| # | Unit | Lessons | Sims | Status |
|---|---|---|---|---|
| 1 | [Motion](./01-motion/index.md) | position, velocity, acceleration, projectiles, relative velocity | motion graphs, projectile motion, river crossing | Ready |
| 2 | Forces | Newton's laws, free-body diagrams, friction, inclines, tension | free-body builder, incline | Planned |
| 3 | Energy and momentum | work, kinetic and potential energy, conservation, collisions | roller coaster energy bars, 1D collisions | Planned |
| 4 | Circular motion and gravity | centripetal force, orbits, Kepler's laws | orbit sandbox (three.js) | Planned |
| 5 | Oscillations and waves | springs, pendulums, waves, sound, interference | spring–mass, pendulum, two-source interference | Planned |
| 6 | Electricity and magnetism | charge, fields, potential, circuits | field lines, circuit builder (embedded) | Planned |
| 7 | Modern physics | light as a wave and a particle, atoms, relativity basics | double slit | Planned |

## How the sims are built

Every simulation is a short p5.js sketch in [sims](../../sims/index.md). The physics is written out by hand in the sketch, with comments, so a curious student can read exactly what the computer is doing. That is the point: the code is part of the lesson.
