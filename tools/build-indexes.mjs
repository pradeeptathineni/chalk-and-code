#!/usr/bin/env node
// Reads every lesson's front matter, checks it, and writes the topic graph.
//
//   node tools/build-indexes.mjs          check + write data/graph.json and content/map/graph.json
//   node tools/build-indexes.mjs --check  check only (exit 1 on any problem)
//
// A lesson is any Markdown file under content/tracks/ whose front matter has an `id`.
// Graph format (shared with Ready, Secure, Go): {nodes:[{id,type,label}], edges:[{source,target,type}]}

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from "node:fs"
import { join, relative, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(join(root, "site", "package.json"))
const matter = require("gray-matter")

const checkOnly = process.argv.includes("--check")
const schema = JSON.parse(readFileSync(join(root, "data/schema/lesson.schema.json"), "utf8"))
const LEVEL_NAMES = ["At rest", "Nudge", "Rolling", "Accelerating", "Orbit"]

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".md") ? [p] : []
  })
}

const problems = []
const lessons = []

for (const file of walk(join(root, "content/tracks"))) {
  const { data } = matter(readFileSync(file, "utf8"))
  if (!data.id) continue // track and unit landing pages
  const rel = relative(root, file)
  for (const key of schema.required) {
    if (!(key in data)) problems.push(`${rel}: missing "${key}"`)
  }
  if (!Number.isInteger(data.level) || data.level < 0 || data.level > 4) {
    problems.push(`${rel}: level must be an integer 0–4`)
  }
  for (const s of data.sources ?? []) {
    for (const k of ["title", "url", "license", "use"]) if (!s[k]) problems.push(`${rel}: a source is missing "${k}"`)
    if (s.use && !["copy", "adapt", "reference"].includes(s.use)) problems.push(`${rel}: source use "${s.use}" is not copy|adapt|reference`)
  }
  for (const sim of data.sims ?? []) {
    if (!existsSync(join(root, "content/sims", sim, "index.html"))) problems.push(`${rel}: sim "${sim}" not found in content/sims`)
  }
  lessons.push({ ...data, file: rel })
}

const ids = new Set()
for (const l of lessons) {
  if (ids.has(l.id)) problems.push(`${l.file}: duplicate id "${l.id}"`)
  ids.add(l.id)
}
for (const l of lessons) {
  for (const pre of l.prerequisites ?? []) {
    if (!ids.has(pre)) problems.push(`${l.file}: prerequisite "${pre}" is not a lesson id`)
  }
}

if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join("\n"))
  process.exit(1)
}
console.log(`✓ ${lessons.length} lessons checked`)
if (checkOnly) process.exit(0)

// Build the graph.
const nodes = []
const edges = []
const seen = new Set()
const add = (node) => {
  if (!seen.has(node.id)) {
    seen.add(node.id)
    nodes.push(node)
  }
}

for (const l of lessons) {
  const trackId = `track.${l.track}`
  const unitId = `unit.${l.track}.${l.unit}`
  add({ id: trackId, type: "track", label: l.track })
  add({ id: unitId, type: "unit", label: l.unit })
  add({
    id: l.id,
    type: "lesson",
    label: l.title,
    level: l.level,
    levelName: LEVEL_NAMES[l.level],
    track: l.track,
    unit: l.unit,
    summary: l.summary,
    // Site path relative to the site root, without the .md extension.
    href: l.file.replace(/^content\//, "").replace(/\.md$/, ""),
  })
  edges.push({ source: unitId, target: trackId, type: "part-of" })
  edges.push({ source: l.id, target: unitId, type: "part-of" })
  for (const pre of l.prerequisites ?? []) edges.push({ source: pre, target: l.id, type: "prerequisite" })
  for (const sim of l.sims ?? []) {
    add({ id: `sim.${sim}`, type: "sim", label: sim, href: `sims/${sim}/index.html` })
    edges.push({ source: l.id, target: `sim.${sim}`, type: "uses-sim" })
  }
}

const unique = new Map(edges.map((e) => [`${e.source}|${e.target}|${e.type}`, e]))
const graph = { nodes, edges: [...unique.values()] }
const json = JSON.stringify(graph, null, 2) + "\n"

mkdirSync(join(root, "content/map"), { recursive: true })
writeFileSync(join(root, "data/graph.json"), json)
writeFileSync(join(root, "content/map/graph.json"), json)
console.log(`✓ graph: ${nodes.length} nodes, ${graph.edges.length} edges → data/graph.json, content/map/graph.json`)
