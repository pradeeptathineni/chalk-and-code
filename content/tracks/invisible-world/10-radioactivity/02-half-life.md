---
id: invisible-world.radioactivity.half-life
title: "Half-life: random atoms, predictable crowds"
summary: "Discover that you can't predict when one atom will decay, yet a crowd of them halves like clockwork, and how that lets us date ancient bones."
level: 2
tags: [radioactivity, half-life, probability]
track: invisible-world
unit: radioactivity
prerequisites: [invisible-world.radioactivity.unstable-atoms]
sims: [half-life]
sources:
  - { title: "OpenStax College Physics 2e, chapters 31 (Radioactivity and Nuclear Physics) and 32 (Medical Applications of Nuclear Physics)", url: "https://openstax.org/details/books/college-physics-2e", license: "CC-BY-4.0", use: reference }
  - { title: "US Nuclear Regulatory Commission, Doses in Our Daily Lives", url: "https://www.nrc.gov/about-nrc/radiation/around-us/doses-daily-lives.html", license: "public domain (US government work)", use: reference }
---

> **After this lesson you can:**
> - explain what a half-life is
> - work out how much is left after a whole number of half-lives
> - explain how carbon dating tells us the age of old things

## Start here

Toss 100 coins. Take out every coin that lands heads. Toss the rest again, and take out the heads again. Before you try it: how many tosses until you're down to about 6 coins?

## The common wrong idea

"If something has a half-life of 10 years, it's all gone after 20 years."

After one half-life, **half** is left. After the second, **half of that half**: a quarter. Then an eighth, a sixteenth... It keeps halving, getting smaller and smaller, but it takes a long time to disappear completely.

## The idea

Each unstable atom has the same chance of decaying in any second. It's like every atom is flipping its own coin, over and over. You can **never** say when a particular atom will go. But with billions of atoms, the chances average out beautifully, and the total halves at a perfectly steady rate.

The **half-life** is the time it takes for half of the atoms to decay. Each kind of atom has its own:

| Atom | Half-life |
|---|---|
| radon-222 (a gas from rocks) | about 4 days |
| carbon-14 | about 5,700 years |
| uranium-238 | about 4.5 billion years, about the age of the Earth |

**Carbon dating.** Every living thing takes in carbon, and a tiny fraction of it is radioactive carbon-14. When a plant or animal dies, it stops taking in new carbon, and the carbon-14 already inside it starts to halve, every 5,700 years. Measure how much is left in an old bone or a piece of wood, and you can tell how long ago it died.

## Play with it

<iframe src="../../../sims/half-life/index.html" title="Half-life simulation" width="100%" height="820" loading="lazy" style="border:0;border-radius:8px"></iframe>

[Open the sim on its own page](../../../sims/half-life/index.html)

Try this:
1. Press **Flip a coin for every atom** once. How close are you to 200? Flip again. How close to 100?
2. Press **Reset** and **Start**. When the "Half-lives passed" reaches 1, how many atoms are left?
3. Compare the yellow line (what happened) with the dashed line (the formula). Why do they match so well?

## Worked example

You start with 800 radioactive atoms with a half-life of 2 hours. How many are left after 6 hours?

1. 6 hours is  \div 2 = 3$ half-lives.
2. Halve three times: 00 \to 400 \to 200 \to 100$.
3. About **100** atoms are left.

## Your turn (faded example)

You start with 1,000 atoms of carbon-14 in a piece of wood. How many are left after 11,400 years?

1. 1{,}400 \div 5{,}700 = \;?$ half-lives.
2. Halve that many times: {,}000 \to \;? \to \;?$

<details><summary>Answer</summary>

2 half-lives: {,}000 \to 500 \to 250$. About 250 are left.

</details>

## Practice

1. A bone has one-eighth of the carbon-14 it had when the animal was alive. Roughly how old is it?

<details><summary>Answer</summary>

One-eighth means it has halved three times ( \to \frac12 \to \frac14 \to \frac18$). Three half-lives of 5,700 years is about **17,100 years**.

</details>

2. You have just 1 radioactive atom with a half-life of 1 hour. Will it decay in the next hour?

<details><summary>Answer</summary>

Nobody can say. It has a 50% chance. Half-lives only become predictable when there are lots of atoms.

</details>

## Check yourself

1. What is a half-life?
2. After two half-lives, what fraction is left?
3. How does carbon dating work?

## Where this goes next

- [Living with radiation](./03-living-with-radiation.md)
