# Learn AI-901

An interactive exam-prep app for **Exam AI-901: Microsoft Azure AI Fundamentals**, built for a
few-day study sprint rather than a leisurely course.

**[dileepadev.github.io/learn-ai-901](https://dileepadev.github.io/learn-ai-901/)**

It is not a documentation site. It is a learning loop:

> Learn, answer, get marked, find the weak spots, practise, review, sit a practice exam, improve.

Everything is static. Progress lives in your browser. No backend, no account, no tracking.

---

## What's in it

| | |
| :--- | :--- |
| **12 lessons** | About 4 hours in all, in recommended study order, with 8 interactive demos and 80 inline knowledge checks |
| **257 questions** | 225 exam-style plus 32 lesson checks, each mapped to an official AI-901 skill, in the formats of Microsoft's practice assessment: single and multiple choice, Yes/No statement sets, sentences to complete from a dropdown, drag and drop, and build lists. Each comes with an explanation, a reason why every wrong option is wrong, and a passage quoted word for word from the Microsoft Learn page that backs it up, with a link to that page. Options are shuffled, so the answer is never always A |
| **Spaced repetition** | A Leitner scheduler tuned for a sprint: intervals run from 8 minutes to 4 days, so the whole bank can resurface before exam day |
| **Weak-area drilling** | Topics ranked by *weighted readiness left on the table*, so a shaky high-weight topic outranks a neglected small one |
| **Mistakes mode** | Every question currently sitting on a wrong answer, in one place |
| **Code questions** | 20 questions on Python SDK code, 17 of them with a snippet to complete or read, following the code in the official training units and Microsoft Learn quickstarts: Speech, chat and agent clients, vision, text analysis and Content Understanding. Every class and method in them, right or wrong, is real |
| **Practice exam** | 45 questions in 45 minutes (or a 15-question mini exam), weighted like the blueprint, nothing marked until the end, mark for review, a review screen that filters by answered, unanswered and marked, a wall-clock timer, and an attempt saved after every answer so a reload can be resumed. Multi-part questions earn a point for each correct part, as on the real exam, and the report breaks your score down by exam section and by topic |
| **Rapid review** | 78 flashcards with their own review schedule, 11 comparison drills with hidden cells, and 23 one-line facts |
| **Cram sheet** | 20 key facts, 14 exam traps and 17 renamed-or-retired notes in one printable pass, for the final day |
| **Study plan** | A three-day sprint: lesson and exam steps tick themselves off, and you tick the rest |

### The dashboard answers one question

> *"I have 30 minutes right now - what should I do?"*

Pick a time budget and it ranks concrete actions: finish the lesson you started, clear your
misses, drill your weakest weighted topic, work the review backlog, or sit a timed paper. The
first card is always the single highest-value thing you could do with that much time.

---

## Content accuracy

Written against the **skills measured as of April 15, 2026**, verified against Microsoft Learn
via the [official study guide](https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-901)
and current product documentation.

AI-901 replaced AI-900, and a lot of study material still in circulation is stale. Things this
app treats as current, and older material usually gets wrong:

- **Foundry resources and projects**, not AI hubs. Hub-based projects are the *classic* model;
  a Foundry project is a child of a Foundry resource and needs no separate Storage or Key Vault.
- **Prompt agents, voice-based prompt agents and hosted agents** - the three agent types in
  Foundry Agent Service - plus calling the Responses API directly for an ephemeral agent, and
  **toolboxes** for shared tools.
- **Two deployment options** (Serverless API, and managed compute in preview), with provisioned
  throughput as a deployment *type* rather than a third option, and **instant access** (preview)
  removing the deployment step for supported models.
- **Reasoning models** such as the GPT-5 series, which reject `temperature` and `top_p` and are
  steered with `reasoning_effort` instead.
- **Guardrails** checked at user input, tool calls, tool responses and output, and the renamed
  **Foundry User** family of roles.
- **Foundry IQ**: multi-source knowledge bases, agentic retrieval, permission-aware answers with
  citations.
- **Azure Content Understanding** across documents, images, audio and video - analyzers, the
  Extract / Classify / Generate field methods, and confidence-driven straight-through processing.
- The **GPT-image** series and **Sora 2**: DALL·E 3 was retired on 4 March 2026. Image Analysis
  4.0 is deprecated, and several Azure Language features retire on 31 March 2029.
- Current naming: **Foundry Tools**, not Cognitive Services.

There is a whole section of the cram sheet dedicated to these, because they are where stale practice
questions will cost you marks.

The original markdown notes this repo started as are archived in
[`notes/`](./notes/README.md), with a table of exactly what in them is no longer true.

> These are practice questions written for this app, not real exam questions. Microsoft's own
> [practice assessment](https://aiskillsnavigator.microsoft.com/credentials/cert-83587e0a0754cfee561ade3e27d9fa1cdaf15ae03be52d2413b2b858d1b4eda4)
> is worth taking as well.

---

## Local development

Requires **Node 22.12 or later** (24 recommended) - Astro 7 sets that floor.

```bash
npm install
npm run dev          # http://localhost:4321/learn-ai-901/
```

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check then build to `dist/` |
| `npm run build:fast` | Build without type-checking |
| `npm run preview` | Serve the production build locally |
| `npm run check` | Type-check `.astro` and `.svelte` files |
| `npm run test:smoke` | Drive the built site in a headless browser and verify the whole learning loop |

`test:smoke` needs the preview server running and a local Chrome or Chromium (set `CHROME_PATH`
if it is not on a standard path). It walks the dashboard, a lesson, a quiz, practice, the exam
exam, rapid review, the cram sheet, the plan, progress and resources - 80 checks, including
server-rendered HTML, persistence, resuming an exam, keyboard answering, theme switching and
phone layouts. Worth running after editing content or components.

The dev server serves under `/learn-ai-901/` because that is the GitHub Pages base path. To work
at the root instead:

```bash
BASE_PATH=/ npm run dev
```

---

## Deploying to GitHub Pages

The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and
deploys on every push to `main`.

**One-time setup:** in the repository, go to **Settings**, then **Pages**, and set **Source** to
**GitHub Actions**. Then push to `main`.

The site publishes to `https://<user>.github.io/<repo>/`.

### Base path

`astro.config.mjs` reads two environment variables, both set by the workflow:

```js
const base = process.env.BASE_PATH ?? '/learn-ai-901';
const site = process.env.SITE_URL ?? 'https://dileepadev.github.io';
```

If you fork this, change `BASE_PATH` and `SITE_URL` in the workflow to match your repository.
For a **custom domain** or a **user site** (`<user>.github.io`), set `BASE_PATH: /` and put your
domain in `SITE_URL`.

All internal links are built from `import.meta.env.BASE_URL`, so nothing else needs changing.

---

## How the app is put together

```text
src/
├── data/                 # Content - plain data, no application logic
│   ├── types.ts          #   Content model + progress schema
│   ├── exam.ts           #   Exam metadata, topics, and weights
│   ├── modules/          #   12 lessons, authored as typed block arrays
│   ├── questions/        #   217 questions, one file per topic + two scenario banks
│   ├── review.ts         #   Flashcards, comparisons, quick facts
│   ├── resources.ts      #   Official links, each one checked
│   └── roadmap.ts        #   The three-day sprint plan and exam-day tips
├── lib/                  # Engine - no UI
│   ├── store.ts          #   localStorage-backed observable, Svelte store contract
│   ├── srs.ts            #   Leitner scheduling, tuned for a few-day sprint
│   ├── scoring.ts        #   Readiness, per-topic mastery, streaks
│   ├── queue.ts          #   Question selection per mode, exam-weighted sampling
│   ├── recommend.ts      #   "What should I do next?"
│   ├── catalog.ts        #   Compact question/lesson refs passed to islands
│   ├── pageData.ts       #   Build-time refs shared by pages (server only)
│   ├── live.svelte.ts    #   Hydration-safe progress for islands
│   ├── examSession.ts    #   The saved, resumable practice exam attempt
│   └── markdown.ts       #   Tiny escape-first inline markdown renderer
├── components/           # Svelte islands, lesson/ (static lesson renderer) and demos/
├── layouts/ pages/       # Astro shell and routes
└── styles/global.css     # Design tokens, light and dark, plus print styles
```

Content and logic are kept apart on purpose. Adding a question means adding an object to a file
in `data/questions/`; nothing in `lib/` or `components/` needs to change.

### Adding content

**A question** - add it to the right file in `src/data/questions/`, or to a scenario bank:

```ts
{
  id: 'rai-023',                    // must be unique; the build fails on duplicates
  topic: 'responsible-ai',          // drives weighting and weak-area routing
  objective: 'Describe considerations for fairness in an AI solution',
  difficulty: 'medium',
  kind: 'exam',                     // 'exam' counts towards the practice exam; 'learn' does not
  scenario: 'Optional case setup shown above the question.',
  prompt: 'The question itself.',
  options: [
    { id: 'a', text: 'The right answer', correct: true },
    { id: 'b', text: 'A plausible one', correct: false, why: 'Why it is wrong.' },
  ],
  explanation: 'Why the correct answer is correct.',
  reference: {
    label: 'Page title',
    url: 'https://learn.microsoft.com/...',
    quote: 'A sentence or two copied word for word from that page.',
  },
}
```

`type` may be omitted for ordinary single-answer questions. Use `type: 'multi'`, `'match'` (drag and
drop), `'order'` (build list), `'yesno'` (a set of statements, each with `yes` and a `why`) or
`'dropdown'` (a sentence with `___` for each blank, and a `blanks` list of options) for the others.
See `src/data/questions/exam-formats.ts` for worked examples of the last two.

**A lesson** - add a module in `src/data/modules/` and register it in that folder's `index.ts`.
Lessons are arrays of typed blocks: `p`, `list`, `table`, `code`, `key`, `trap`, `changed`,
`steps`, `demo` and `check`.

The build **fails** on a duplicate question id, an `objective` that is not the exact wording of a skill
measured under the question's topic, a question whose `reference` is not a Microsoft Learn
page or has no `quote`, a
single-answer question without exactly one correct option, a wrong option without a `why`, a Yes/No
statement without a `why`, a dropdown whose `___` blanks do not match its `blanks`, a
lesson referencing a question id that does not exist, or a lesson quiz that repeats its own
knowledge checks - so broken content never ships.

### Progress and privacy

Everything is stored under one `localStorage` key in your browser. Clearing site data clears it.
There is an export/import backup on the [progress page](https://dileepadev.github.io/learn-ai-901/progress/)
if you need to move between devices.

---

## Tech

[Astro 7](https://astro.build) (static output) with [Svelte 5](https://svelte.dev) islands and
TypeScript in strict mode. No CSS framework, no chart library, no runtime dependencies beyond
Svelte. Type is Inter, one variable font self-hosted at build time, with the tailed `l` turned on
so "AI" and "Il" never blur together. Code uses the system monospace font.

### Performance

Every page is prerendered, lessons included: their text, tables and callouts are plain HTML, and
only the interactive parts (knowledge checks, demos, progress) hydrate, mostly when they scroll
into view. Islands work from compact build-time refs, so the 240 KB question bank is downloaded
only when a practice session or exam starts. Pages load 29 to 44 KB of gzipped JavaScript.

## Licence

Study content and code in this repository are provided as-is for personal exam preparation.
Microsoft, Azure, and AI-901 are trademarks of Microsoft Corporation; this is an independent
study aid and is not affiliated with or endorsed by Microsoft.
