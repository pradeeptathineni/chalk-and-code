---
id: physics.motion.projectile-motion
title: "Projectile motion: two motions at once"
summary: "Split a launch into independent horizontal and vertical motions and solve for time, range and height."
level: 2
tags: [physics, kinematics, vectors, two-dimensions]
track: physics
unit: motion
prerequisites: [physics.motion.speeding-up]
sims: [projectile-motion]
sources:
  - { title: "OpenStax College Physics 2e, 3.4 Projectile Motion", url: "https://openstax.org/books/college-physics-2e/pages/3-4-projectile-motion", license: "CC-BY-4.0", use: reference }
  - { title: "PhET Projectile Motion (for comparison)", url: "https://phet.colorado.edu/en/simulations/projectile-motion", license: "CC-BY-4.0", use: reference }
---

> **After this lesson you can:**
> - split a launch velocity into horizontal and vertical components
> - explain why the horizontal velocity stays constant (with no air resistance)
> - find time of flight, maximum height and range

## Start here

You drop one coin and flick another off the edge of a table at the same moment. Which one hits the floor first?

## The common wrong idea

"The flicked coin is moving faster, so it stays up longer" (or "lands sooner").

They land together. Falling is a vertical motion. How fast you are going sideways does not change how fast you fall. That one fact is the whole lesson.

## The idea

Treat the flight as **two separate one-dimensional problems** that share the same clock:

| | horizontal ($x$) | vertical ($y$) |
|---|---|---|
| start velocity | $v_0\cos\theta$ | $v_0\sin\theta$ |
| acceleration | $0$ | $-g$ |
| so | $x = v_0\cos\theta \; t$ | $y = h + v_0\sin\theta\; t - \tfrac12 g t^2$ |

Useful results for a launch from ground level, landing at the same height:

$$t_\text{flight} = \frac{2v_0\sin\theta}{g} \qquad H_\text{max} = \frac{(v_0\sin\theta)^2}{2g} \qquad R = \frac{v_0^2\sin 2\theta}{g}$$

Don't memorise those three. Derive them once from the table above, and you'll be able to rebuild them whenever you need them.

## Play with it

<iframe src="../../../sims/projectile-motion/index.html" title="Projectile motion simulation" width="100%" height="820" loading="lazy" style="border:0;border-radius:8px"></iframe>

[Open the sim on its own page](../../../sims/projectile-motion/index.html)

Try this:
1. Launch at 45°. Watch the blue $v_x$ arrow the whole way. Does it ever change length?
2. Press **Try: 30° vs 60°**. Why do they land in the same place? Use $\sin 2\theta$ to explain.
3. Turn air drag up to about 0.1 and launch again with **Keep earlier paths** on. What happens to the range, and to the shape of the way down?
4. Set launch height to 10 m. Is 45° still the angle that goes furthest? Try 35° and 40°.

## Worked example

A ball is kicked at $20\text{ m/s}$ at $30°$ above flat ground. Find its range.

1. Components: $v_x = 20\cos 30° \approx 17.3\text{ m/s}$, $v_y = 20\sin 30° = 10\text{ m/s}$.
2. Vertical problem for the time: it lands when $y = 0$, so $0 = 10t - 4.9t^2 \Rightarrow t = 10/4.9 \approx 2.04\text{ s}$.
3. Horizontal problem for the distance: $x = 17.3 \times 2.04 \approx 35.3\text{ m}$.
4. Check with the sim: speed 20, angle 30, height 0.

## Your turn (faded example)

A stone is thrown horizontally at $8\text{ m/s}$ off a $20\text{ m}$ cliff. How far from the base does it land?

1. Vertical: $v_y = 0$, so $20 = \tfrac12 (9.8) t^2 \Rightarrow t = \;?$
2. Horizontal: $x = 8t = \;?$

<details><summary>Answer</summary>

$t = \sqrt{40/9.8} \approx 2.02\text{ s}$, so $x \approx 16.2\text{ m}$.

</details>

## Practice

1. On the Moon ($g = 1.6\text{ m/s}^2$) you throw a ball at $10\text{ m/s}$ and $45°$. Compare its range with the same throw on Earth.

<details><summary>Answer</summary>

Range scales as $1/g$. Earth: $100/9.8 \approx 10.2\text{ m}$. Moon: $100/1.6 = 62.5\text{ m}$, about 6 times further.

</details>

2. What is the velocity of a projectile at the very top of its path?

<details><summary>Answer</summary>

Purely horizontal: $v_0\cos\theta$. The vertical part is zero at that instant, but the acceleration is still $g$ downward.

</details>

## Check yourself

1. Which component of velocity stays constant, and why?
2. What decides how long a projectile is in the air?
3. Which two launch angles give the same range on flat ground as 20°?

## Where this goes next

- [Relative velocity: crossing a river](./05-relative-velocity.md)
