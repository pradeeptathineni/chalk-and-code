---
id: physics.motion.speeding-up
title: "Speeding up: acceleration and the constant-acceleration equations"
summary: "Treat acceleration as the rate of change of velocity, read it from graphs, and use the four kinematic equations."
level: 2
tags: [physics, kinematics, graphs, equations]
track: physics
unit: motion
prerequisites: [physics.motion.how-fast]
sims: [motion-graphs]
sources:
  - { title: "OpenStax College Physics 2e, 2.5 Motion Equations for Constant Acceleration in One Dimension", url: "https://openstax.org/books/college-physics-2e/pages/2-5-motion-equations-for-constant-acceleration-in-one-dimension", license: "CC-BY-4.0", use: reference }
---

> **After this lesson you can:**
> - say what acceleration measures, including when it is negative
> - read acceleration as the slope of a velocity–time graph, and displacement as the area under it
> - choose and use the right constant-acceleration equation

## Start here

A ball thrown straight up stops for an instant at the top. At that instant, is its acceleration zero?

Hold that thought. Most people say yes. The sim below is going to argue with them.

## The common wrong idea

"Zero velocity means zero acceleration," and its cousin, "negative acceleration means slowing down."

Acceleration is about how velocity is **changing**, not what it is right now. At the top of the throw the velocity is zero, but it is changing from up to down, so the acceleration is still $9.8\text{ m/s}^2$ downward. And negative acceleration only means slowing down if the velocity is positive.

## The idea

$$a = \frac{\Delta v}{\Delta t}$$

When $a$ is constant, four equations cover everything. Each one leaves out one quantity, which is how you pick:

| Equation | Leaves out |
|---|---|
| $v = v_0 + at$ | $\Delta x$ |
| $\Delta x = v_0 t + \tfrac12 a t^2$ | $v$ |
| $v^2 = v_0^2 + 2a\,\Delta x$ | $t$ |
| $\Delta x = \tfrac12 (v_0 + v)\, t$ | $a$ |

On graphs:

- acceleration is the **slope** of the $v$–$t$ graph
- displacement is the **area** under the $v$–$t$ graph
- with constant acceleration the $x$–$t$ graph is a **parabola**

## Play with it

<iframe src="../../../sims/motion-graphs/index.html" title="Motion graphs simulation" width="100%" height="760" loading="lazy" style="border:0;border-radius:8px"></iframe>

[Open the sim on its own page](../../../sims/motion-graphs/index.html)

Try this:
1. Press **Try: turn around** ($v_0 = 5$, $a = -2$). Pause when the velocity graph crosses zero. Look at the acceleration graph at that moment. Is it zero?
2. Set $v_0 = -4$ and $a = +1.5$. Is the cart speeding up or slowing down at first? Does the sign of $a$ alone tell you?
3. Watch the position graph curve. Where is it steepest? Check that against the velocity graph at the same time.

## Worked example

A car at $15\text{ m/s}$ brakes at $3\text{ m/s}^2$. How far does it travel before stopping?

1. Knowns: $v_0 = 15$, $v = 0$, $a = -3$ (taking the direction of travel as positive). Unknown: $\Delta x$. We don't know or need $t$.
2. The equation that leaves out $t$: $v^2 = v_0^2 + 2a\,\Delta x$.
3. $0 = 225 + 2(-3)\Delta x \Rightarrow \Delta x = 225 / 6 = 37.5\text{ m}$.

## Your turn (faded example)

A skateboarder starts from rest and accelerates at $2\text{ m/s}^2$ for $4\text{ s}$. How far do they go?

1. Knowns: $v_0 = 0$, $a = 2$, $t = 4$. Unknown: $\Delta x$. Leaves out $v$, so use $\Delta x = v_0 t + \tfrac12 a t^2$.
2. $\Delta x = 0 + \tfrac12 (2)(4)^2 = \;?$

<details><summary>Answer</summary>

$16\text{ m}$.

</details>

## Practice

1. A ball is thrown straight up at $12\text{ m/s}$. How high does it go? (Use $g = 9.8\text{ m/s}^2$.)

<details><summary>Answer</summary>

At the top $v = 0$. With up positive, $a = -9.8$. $0 = 144 - 19.6\,\Delta x \Rightarrow \Delta x \approx 7.3\text{ m}$.

</details>

2. A velocity graph is a straight line from $(0\text{ s}, 2\text{ m/s})$ to $(6\text{ s}, 14\text{ m/s})$. Find the acceleration and the displacement.

<details><summary>Answer</summary>

Slope: $(14-2)/6 = 2\text{ m/s}^2$. Area (a trapezoid): $\tfrac12(2+14)(6) = 48\text{ m}$.

</details>

## Check yourself

1. At the top of a vertical throw, what are the velocity and the acceleration?
2. Which kinematic equation would you use if the problem never mentions time?
3. What does the area under a velocity–time graph represent?

## Where this goes next

- [Projectile motion](./04-projectile-motion.md)
