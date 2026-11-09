---
id: invisible-world.signals-through-the-air.gps
title: "GPS: finding yourself with clocks in space"
summary: "See how your phone works out exactly where you are by timing signals from satellites 20,000 km up."
level: 2
tags: [gps, satellites, radio, signals]
track: invisible-world
unit: signals-through-the-air
prerequisites: [invisible-world.signals-through-the-air.a-message-on-a-wave]
sims: [gps]
sources:
  - { title: "OpenStax College Physics 2e, chapter 24 (Electromagnetic Waves)", url: "https://openstax.org/details/books/college-physics-2e", license: "CC-BY-4.0", use: reference }
  - { title: "GPS.gov, How GPS Works", url: "https://www.gps.gov/systems/gps/", license: "public domain (US government work)", use: reference }
---

> **After this lesson you can:**
> - explain how timing a signal tells you a distance
> - explain why one or two satellites aren't enough, and three (on a flat map) are
> - explain why GPS needs incredibly accurate clocks

## Start here

Your phone knows where you are to within a few metres, anywhere on Earth, even in the middle of the ocean. It isn't sending anything to do it. It's only *listening*. How can listening tell you where you are?

## The common wrong idea

"GPS satellites watch you and tell your phone where you are."

The satellites have no idea where you are. They just keep announcing, over and over: "This is satellite number 12, and the time is exactly ..." Your phone does all the working out.

## The idea

About 30 GPS satellites circle the Earth, roughly **20,000 km up**. Each carries an **atomic clock**, a clock that keeps time by counting the steady vibrations of atoms. It is so accurate it would take thousands of years to drift by a single second.

1. Each satellite sends a radio signal saying when it was sent.
2. Your phone notes when the signal arrives. The signal travels at the speed of light, so the delay tells your phone the distance: **distance = speed of light × time taken**. A delay of 0.067 seconds means about 20,000 km.
3. Knowing you're 20,000 km from satellite A puts you somewhere on a big circle around it. That's not enough!
4. Add satellite B: now you're where the two circles cross, which is one of **two** places.
5. Add satellite C: only **one** place is on all three circles. That's you.

(Real GPS works in three dimensions, so the circles are really spheres. It also uses a **fourth** satellite to correct your phone's clock, which is nowhere near as good as an atomic clock.)

Here's the "wait, really?" part: light travels 300 km in a single millisecond. If your phone's timing were off by just **one thousandth of a second**, your position would be off by 300 km. GPS works because it measures time to within a few **billionths** of a second.

## Play with it

<iframe src="../../../sims/gps/index.html" title="GPS simulation" width="100%" height="860" loading="lazy" style="border:0;border-radius:8px"></iframe>

[Open the sim on its own page](../../../sims/gps/index.html)

Try this:
1. Press **Show the next circle** once. Drag the phone along circle A. Does the time from satellite A change?
2. Show two circles. Find the second place where they cross. Could the phone be there instead?
3. Show all three circles, then set the clock error to 1 ms. What happens to where the circles meet?

## Worked example

A signal from a satellite takes 0.07 seconds to arrive. How far away is the satellite?

1. Light travels 300,000 km every second.
2. 00{,}000 \times 0.07 = 21{,}000$.
3. The satellite is about **21,000 km** away.

## Your turn (faded example)

A signal takes 0.06 seconds.

1. distance = 300,000 × ___
2. distance = ___ km

<details><summary>Answer</summary>

00{,}000 \times 0.06 = 18{,}000$ km.

</details>

## Practice

1. You know you're exactly 100 km from Town A and 100 km from Town B, which are 150 km apart. How many places could you be?

<details><summary>Answer</summary>

Two: the two points where the circles around A and B cross, one on each side of the road between the towns. You'd need a third town to choose.

</details>

2. **Stretch (grades 7–8):** why would a clock error of a millionth of a second (0.000001 s) matter to GPS?

<details><summary>Answer</summary>

Light travels 00{,}000{,}000 \times 0.000001 = 300$ m in that time. Your map would put you 300 m away, maybe on the wrong street.

</details>

## Check yourself

1. Does your phone send anything to the GPS satellites?
2. How does a time delay tell you a distance?
3. Why does one satellite only put you "somewhere on a circle"?

## Where this goes next

- [Sound you can't hear](../06-sound-you-cant-hear/index.md), where bats use the same timing trick with sound
