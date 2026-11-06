---
title: "Topic map"
summary: "Every lesson and what it builds on, in one picture."
---

Each card is a lesson. Arrows point from what you need first to what it unlocks, so the map reads left to right. Filter by track or level, hover for a summary, and click to open.

<iframe src="./view/index.html" title="Topic map" width="100%" height="560" loading="lazy" style="border:0;border-radius:8px"></iframe>

[Open the map on its own page](./view/index.html)

The map is drawn from the lessons themselves: each lesson lists its prerequisites in its front matter, and `tools/build-indexes.mjs` turns those into `graph.json`.
