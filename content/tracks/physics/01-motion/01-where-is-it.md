---
id: physics.motion.where-is-it
title: "Where is it? Position, distance and displacement"
summary: "Describe where something is and how far it moved, and tell distance and displacement apart."
level: 1
tags: [physics, kinematics, vectors]
track: physics
unit: motion
prerequisites: []
sims: [motion-graphs]
sources:
  - { title: "OpenStax College Physics 2e, 2.1 Displacement", url: "https://openstax.org/books/college-physics-2e/pages/2-1-displacement", license: "CC-BY-4.0", use: reference }
---

> **After this lesson you can:**
> - say where something is using a number line, a zero point and a positive direction
> - work out displacement as "final minus initial"
> - explain why distance and displacement can be different numbers for the same trip

## Start here

You walk 4 m to the fridge, then 4 m back to your desk. How far did you go?

There are two honest answers. You covered 8 m of floor. But you ended up exactly where you started, so in another sense you went nowhere. Physics keeps both answers and gives them different names.

## The common wrong idea

"Distance and displacement are the same thing with a fancier word."

They agree only when you move in one direction and never turn back. The moment you turn around, they split apart.

## The idea

**Position** needs three choices before it means anything:

1. a **zero point** (the origin),
2. a **positive direction**,
3. a **unit** (usually metres).

With those choices, position is just a number, $x$. A cart at $x = -3\text{ m}$ is 3 m on the negative side of the origin.

**Displacement** is the change in position:

$$\Delta x = x_\text{final} - x_\text{initial}$$

It has a sign. A positive displacement means you ended up further in the positive direction.

**Distance** is the total length of path you covered. It never goes negative, and it never goes down.

For the fridge trip, taking the desk as $x=0$ and the fridge direction as positive:

| | value |
|---|---|
| distance | $4 + 4 = 8\text{ m}$ |
| displacement | $0 - 0 = 0\text{ m}$ |

## Play with it

<iframe src="../../../sims/motion-graphs/index.html" title="Motion graphs simulation" width="100%" height="760" loading="lazy" style="border:0;border-radius:8px"></iframe>

[Open the sim on its own page](../../../sims/motion-graphs/index.html)

Try this:
1. Set $x_0 = -6$, $v_0 = 2$, $a = 0$ and press Go. Pause at about 3 s. What is the displacement so far?
2. Press **Try: turn around**. The cart goes forward, stops, and comes back. Watch the position graph: where is the cart furthest from where it started?
3. In that same run, find a moment when the displacement is zero but the distance is not.

## Worked example

A runner starts at $x = 2\text{ m}$, runs to $x = 10\text{ m}$, then jogs back to $x = 6\text{ m}$.

1. Displacement only cares about start and end: $\Delta x = 6 - 2 = +4\text{ m}$.
2. Distance adds up each leg: $|10 - 2| + |6 - 10| = 8 + 4 = 12\text{ m}$.
3. Sanity check: distance is bigger than the size of the displacement, which always happens when you turn around.

## Your turn (faded example)

A cat starts at $x = 5\text{ m}$, walks to $x = -1\text{ m}$, then to $x = 3\text{ m}$.

1. Displacement: $\Delta x = 3 - 5 = \;?$
2. Distance: $|{-1} - 5| + |3 - (-1)| = \;?$

<details><summary>Answer</summary>

Displacement is $-2\text{ m}$ (the cat ended 2 m on the negative side of where it started). Distance is $6 + 4 = 10\text{ m}$.

</details>

## Practice

1. A lift goes from floor 3 up to floor 9, then down to floor 1. Each floor is 3 m. Find the distance and the displacement, taking up as positive.

<details><summary>Answer</summary>

Distance: $(6 + 8)\times 3 = 42\text{ m}$. Displacement: $(1 - 3)\times 3 = -6\text{ m}$, so 6 m down.

</details>

2. Can displacement ever be bigger than distance? Explain in one sentence.

<details><summary>Answer</summary>

No. The straight line from start to end is the shortest possible path, so the size of the displacement is at most the distance.

</details>

## Check yourself

1. What three choices do you need before a position means anything?
2. Write displacement as a formula.
3. Which one can be negative: distance or displacement?

## Where this goes next

- [How fast? Speed and velocity](./02-how-fast.md)
