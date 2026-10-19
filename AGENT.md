# AGENT.md

The single set of instructions for any AI coding agent working in this repo.
Claude Code, GitHub Copilot, Antigravity and Cursor all point here.

## What this is

An interactive exam-prep app for **Microsoft Exam AI-901: Microsoft Azure AI Fundamentals**.
Static site, no backend. All user progress lives in `localStorage`.

Live at <https://dileepadev.github.io/learn-ai-901>

## Stack

- **Astro 7**, static output (`output: 'static'`)
- **Svelte 5** islands (runes: `$state`, `$derived`, `$effect`)
- **TypeScript**, strict mode
- No CSS framework, no chart library, no runtime dependency beyond Svelte

Requires Node 22.12+.

## Commands

```bash
npm run dev          # dev server
npm run check        # astro check + svelte-check  (run this before you finish)
npm run build        # check + build
npm run build:fast   # build, skipping check
npm run preview      # serve dist/ on :4321
npm run test:smoke   # Playwright smoke tests - needs `npm run preview` running first
```

## Layout

```
src/data/          All content. Most changes go here.
  exam.ts          Exam metadata, domains, topic weights
  questions/       The question bank, split by topic
  modules/         Lessons, as arrays of typed blocks
  review.ts        Flashcards, comparisons, quick facts
  resources.ts     Official links
  types.ts         Every content type
src/lib/           Engine: progress store, SRS, scoring, catalog refs, exam session
src/components/    Svelte islands (the interactive UI); lesson/ renders lessons statically
src/pages/         Astro pages (the static shell)
src/layouts/       Base.astro
tests/smoke.mjs    Playwright smoke suite
```

## Content rules

**Accuracy comes first.** This is study material - a wrong fact costs someone marks.

- Verify against the [official study guide](https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-901)
  (skills measured as of **April 15, 2026**) and current Microsoft Learn docs.
  Use the Microsoft Learn MCP when it is available.
- Never invent a fact, a service name, or a URL. If you cannot verify it, leave it out and say so.
- Give every question a real `reference` link.
- Use **current** product naming: Microsoft Foundry (not Azure AI Foundry or Azure AI Studio),
  Foundry Tools (not Cognitive Services or Azure AI services), prompt agents and hosted agents,
  Azure Content Understanding, Foundry resource and project (not AI hub).

**The build validates content for you.** It fails on a duplicate question or module id, a
single-answer question without exactly one correct option, a multi-answer question with fewer
than two, and a lesson referencing a question id that does not exist. Run `npm run check`.

## Writing style

- **No em dashes.** Use a hyphen with spaces, a comma, or a new sentence. This is enforced
  across all copy.
- British spelling in prose.
- Short and direct. Explain *why* a wrong answer is wrong, not just that it is.

## Code conventions

- Match the surrounding code - naming, comment density, idiom.
- Build internal links from `import.meta.env.BASE_URL`, never hardcode `/learn-ai-901`.
- Keep bundle size in mind: no new runtime dependency without a good reason.
- Islands must not import `data/questions` or `data/modules` just to count or score. Pass the
  build-time refs from `lib/pageData` as props, and `await import('../data/questions')` only
  when a session actually starts.
- Islands are server-rendered, so read progress through `liveProgress()` (`lib/live.svelte.ts`),
  never during the first render, or hydration will not match.
- Keep components typed. `any` is a smell.

## Git

`main` and `dev` are **protected** - never commit directly to them. Branch first.

- Branches: `feat/x`, `fix/x`, `docs/x`, `style/x`, `refactor/x`, `perf/x`
- Commits: `<type>(<scope>): <short message>`, e.g. `fix(content): Correct Foundry portal URL`

Full detail in [BRANCH_NAMING_GUIDELINES.md](./BRANCH_NAMING_GUIDELINES.md),
[COMMIT_MESSAGE_GUIDELINES.md](./COMMIT_MESSAGE_GUIDELINES.md) and
[PULL_REQUEST_GUIDELINES.md](./PULL_REQUEST_GUIDELINES.md).

Commit only when asked.

## Before you finish

1. `npm run check` - must be 0 errors
2. `npm run build:fast`
3. `npm run preview` then `npm run test:smoke` if you touched components or pages
