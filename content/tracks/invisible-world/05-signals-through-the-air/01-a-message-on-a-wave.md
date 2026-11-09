---
id: invisible-world.signals-through-the-air.a-message-on-a-wave
title: "A message on a wave: on-off, AM and FM"
summary: "Find out how a radio wave, which is just a steady wiggle, can carry a song, a voice or a text message."
level: 2
tags: [radio, signals, modulation]
track: invisible-world
unit: signals-through-the-air
prerequisites: [invisible-world.waves.measuring-waves, invisible-world.light-we-cant-see.the-spectrum]
sims: [signal-on-a-wave]
sources:
  - { title: "OpenStax College Physics 2e, chapter 24 (Electromagnetic Waves)", url: "https://openstax.org/details/books/college-physics-2e", license: "CC-BY-4.0", use: reference }
---

> **After this lesson you can:**
> - explain how a steady wave can be changed to carry a message
> - tell the difference between AM and FM
> - explain why FM radio sounds clearer than AM

## Start here

A radio wave is a steady wiggle of invisible light, billions of times a second. A steady wiggle says nothing at all, just like a flashlight that's always on. So how does a radio station get a whole song into it?

## The common wrong idea

"The radio station sends the sound itself through the air."

Sound can't travel far. Shout across a football field and the far end barely hears you. A radio station turns the sound into a pattern of **changes** in a radio wave, which flies at the speed of light for hundreds of kilometres. Your radio reads the changes and turns them back into sound.

## The idea

The steady wave a station sends out is called the **carrier**, because it carries the message. On its own it's boring: same size, same speed, forever. The trick is to **change** it in a pattern. Changing a wave to carry a message is called **modulation**.

- **On-off.** Switch the wave on and off. Long and short bursts can spell out letters in Morse code. That's how the first radio messages crossed the Atlantic, in 1901.
- **AM, amplitude modulation.** Make the wave **bigger and smaller** to follow the message.
- **FM, frequency modulation.** Keep the size the same but make it wiggle **faster and slower**.

Wifi and phones send **bits**, 1s and 0s, instead of sound. Every letter you type becomes a code of eight bits ("H" is 01001000), and the bits change the wave just like a song would.

Here's why FM sounds clearer. On its way to you, a wave picks up **noise** from lightning, motors and electrical gadgets, and noise mostly adds random bumps to the wave's *size*. An AM receiver is reading the size, so the noise gets into the message. An FM receiver only cares about how *fast* the wave wiggles, so it mostly ignores the bumps.

## Play with it

<iframe src="../../../sims/signal-on-a-wave/index.html" title="A message on a wave simulation" width="100%" height="860" loading="lazy" style="border:0;border-radius:8px"></iframe>

[Open the sim on its own page](../../../sims/signal-on-a-wave/index.html)

Try this:
1. Type your name. Look at the bits for the first letter. Now find where the wave sent (row 2) gets bigger or smaller.
2. Slowly raise the noise with **AM** selected until letters start going wrong. Remember that noise level. Now press **FM** at the same noise. What happens?
3. Try **On–off**. Is it better or worse than AM when it's noisy?

## Worked example

With AM in the sim, a 1 is a big wave and a 0 is a small wave. The receiver sees: small, big, small, small, big, small, small, small. What's the letter?

1. Big means 1 and small means 0, so the bits are 0 1 0 0 1 0 0 0.
2. That's the code for **"H"** (type H into the sim and compare).

## Your turn (faded example)

With FM, a 1 is fast wiggles and a 0 is slow wiggles. You receive: slow, fast, slow, slow, fast, slow, slow, fast.

1. Bits: 0 1 ___ ___ ___ ___ ___ ___
2. Type "I" into the sim and compare.

<details><summary>Answer</summary>

0 1 0 0 1 0 0 1, the code for "I". So far you've received "HI".

</details>

## Practice

1. Why can't a radio station just broadcast loud sound instead of radio waves?

<details><summary>Answer</summary>

Sound fades quickly and travels slowly, at about 340 m every second. Radio waves are light, travel 300,000 km every second, and reach hundreds of kilometres away.

</details>

2. During a thunderstorm, an AM station crackles but an FM station sounds fine. Why?

<details><summary>Answer</summary>

Lightning sends out bursts of radio noise that add bumps to the size of every wave around. AM carries its message in the wave's size, so the bumps become crackles. FM carries its message in how fast the wave wiggles, which the bumps barely change.

</details>

## Check yourself

1. What is a carrier wave?
2. What does AM change about the wave? What does FM change?
3. How does wifi turn a letter into something a wave can carry?

## Where this goes next

- [Wifi and Bluetooth](./02-wifi-and-bluetooth.md)
