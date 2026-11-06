---
id: physics.motion.relative-velocity
title: "Relative velocity: crossing a river"
summary: "Add velocities as vectors and solve boat, plane and walkway problems."
level: 3
tags: [physics, kinematics, vectors, two-dimensions]
track: physics
unit: motion
prerequisites: [physics.motion.projectile-motion]
sims: [river-crossing]
sources:
  - { title: "OpenStax College Physics 2e, 3.5 Addition of Velocities", url: "https://openstax.org/books/college-physics-2e/pages/3-5-addition-of-velocities", license: "CC-BY-4.0", use: reference }
---

> **After this lesson you can:**
> - write a velocity "relative to" something, and add velocities as vectors
> - find the fastest way across a river and the way that lands straight opposite
> - explain why those two are different headings

## Start here

You swim straight across a river, aiming at a tree on the far bank. The current pushes you as you swim. Do you reach the tree? If not, which way should you have aimed?

## The common wrong idea

"To land straight across, aim straight across."

The water moves you whether you like it or not. Aiming straight across gives you the **quickest** crossing, but it lands you downstream. To land opposite you must aim partly **upstream**, which makes the crossing slower.

## The idea

Every velocity is measured relative to something. Name both ends:

$$\vec v_\text{boat, ground} = \vec v_\text{boat, water} + \vec v_\text{water, ground}$$

The inner labels "chain" (water … water), which is a handy check that you have set it up right.

For a river of width $w$, current $u$, and a boat speed $v$ through the water at heading $\theta$ from straight across (negative = upstream):

- across-river speed: $v\cos\theta$, so crossing time $t = \dfrac{w}{v\cos\theta}$
- downstream speed: $u + v\sin\theta$, so drift $= (u + v\sin\theta)\,t$

**Fastest crossing:** $\theta = 0$, because that makes $\cos\theta$ as big as possible.
**Land opposite:** make the downstream speed zero, $\sin\theta = -u/v$. This is only possible if $v > u$.

## Play with it

<iframe src="../../../sims/river-crossing/index.html" title="River crossing simulation" width="100%" height="840" loading="lazy" style="border:0;border-radius:8px"></iframe>

[Open the sim on its own page](../../../sims/river-crossing/index.html)

Try this:
1. Heading 0°, current 2 m/s. Note the time to cross. Now change the current to 5 m/s. Did the crossing time change? Why not?
2. Try to land on the green marker by changing only the heading. Then press **Show me: land opposite** and compare.
3. Set the current faster than the boat. Can you land opposite at all? What heading minimises the drift?

## Worked example

A boat moves at $5\text{ m/s}$ through the water across a $60\text{ m}$ river flowing at $3\text{ m/s}$. It wants to land straight opposite.

1. Downstream speed must be zero: $3 + 5\sin\theta = 0 \Rightarrow \sin\theta = -0.6 \Rightarrow \theta \approx -36.9°$ (36.9° upstream).
2. Across speed: $5\cos(36.9°) = 4\text{ m/s}$. (A 3-4-5 triangle.)
3. Time: $60 / 4 = 15\text{ s}$. Compare with $60/5 = 12\text{ s}$ if it aimed straight across and accepted the drift.

## Your turn (faded example)

Same boat and river, but it aims straight across.

1. Time to cross: $t = 60 / 5 = \;?$
2. Drift: $3 \times t = \;?$
3. Speed over ground: $\sqrt{5^2 + 3^2} = \;?$

<details><summary>Answer</summary>

$12\text{ s}$, $36\text{ m}$ downstream, and about $5.83\text{ m/s}$.

</details>

## Practice

1. A plane flies at $200\text{ km/h}$ through the air, heading due north. A wind blows at $50\text{ km/h}$ due east. What is its velocity over the ground?

<details><summary>Answer</summary>

$\sqrt{200^2 + 50^2} \approx 206\text{ km/h}$, at $\tan^{-1}(50/200) \approx 14°$ east of north.

</details>

2. You walk at $1.5\text{ m/s}$ on an airport walkway moving at $1\text{ m/s}$. How fast are you moving relative to the floor if you walk with it? Against it?

<details><summary>Answer</summary>

$2.5\text{ m/s}$ with it. Against it, $1.5 - 1 = 0.5\text{ m/s}$ in the direction you are walking.

</details>

## Check yourself

1. Write the velocity-addition equation with all the "relative to" labels.
2. Which heading gives the fastest crossing?
3. When is landing straight opposite impossible?

## Where this goes next

- Forces and Newton's laws (coming next in [Physics](../index.md))
