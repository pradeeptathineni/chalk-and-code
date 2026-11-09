# Chalk & Code

Lessons from years of tutoring and teaching, explained on the board and then brought to life in code.

Since 2018 I have tutored, taught, mentored and run seminars in physics, math, computer science and security. My favourite way to teach physics has always been to write a small program with the student, then change one number and watch what happens. This repository collects those lessons and the simulations that go with them.

## What's here

```
chalk-and-code/
├── content/                  everything a learner reads (built into the site)
│   ├── index.md              home page
│   ├── map/                  clickable map of lessons and prerequisites
│   ├── tracks/               physics, math, computer science, security, study skills
│   │   └── physics/01-motion/   five lessons, each with a simulation
│   ├── sims/                 p5.js simulations, each runnable on its own
│   ├── for-tutors/           how a session runs
│   ├── for-parents-and-teachers/
│   └── credits.md
├── templates/lesson.md       the template every lesson follows
├── data/
│   ├── schema/lesson.schema.json   front matter rules
│   └── graph.json            the lesson graph (generated)
├── tools/build-indexes.mjs   checks every lesson and builds the graph
└── site/                     the site generator (Quartz 4.5.2)
```

## Reading it

- **On GitHub:** start at [content/index.md](content/index.md). Links between lessons work here too.
- **As a website:** build it (below) and open `public/index.html`, or serve it.
- **Just the simulations:** open any `content/sims/<name>/index.html` in a browser. They work offline.

## Building the site

Needs Node 22 or newer.

```sh
npm run setup   # once: installs the site generator's packages
npm run build   # checks lessons, builds the graph, builds the site into public/
npm run serve   # builds and serves at http://localhost:8080
```

## Adding a lesson

1. Copy `templates/lesson.md` into the right unit folder.
2. Fill in the front matter: `id`, `title`, `summary`, `level`, `tags`, `track`, `unit`, `prerequisites`, `sims`, `sources`.
3. Write the sections in order. Keep **The idea** short and let the sim do the work.
4. Run `npm run check`.

## Levels

| Level | Name | Meaning |
|---|---|---|
| 0 | At rest | Never met this idea |
| 1 | Nudge | First meeting: the words and the picture |
| 2 | Rolling | Can do the standard problems |
| 3 | Accelerating | Can use it on a problem you haven't seen before |
| 4 | Orbit | Can teach it to someone else |

## Licence

Teach with it, adapt it, share it.

| What | Licence |
|---|---|
| Lessons, text, diagrams and images | [CC BY-SA 4.0](LICENSE) |
| Code: simulations (`content/sims/`), the topic map (`content/map/view/`), `tools/`, `data/schema/` | [MIT](LICENSE-CODE) |
| The Chalk & Code name | Not licensed; see [TRADEMARK.md](TRADEMARK.md) |
| Third-party parts (Quartz in `site/`, p5.js, KaTeX, cited sources) | Their own licences; see [content/credits.md](content/credits.md) |

If you reuse a lesson, credit it as "Based on Chalk & Code by Pradeep Tathineni (neon1)" with a link, keep the [NOTICE](NOTICE) file, and share your version under CC BY-SA 4.0.
