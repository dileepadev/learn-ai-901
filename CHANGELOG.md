# Changelog

All notable changes to this project are documented in this file.

Changes are organized into the following categories:

- **Added:** New features or functionality introduced to the project.
- **Changed:** Modifications to existing functionality that do not add new features.
- **Fixed:** Bug fixes that resolve issues or correct unintended behavior.
- **Removed:** Features or components that have been removed from the project.

## [Unreleased]

### Added

- Every question now shows a passage from Microsoft Learn after you answer, quoted word for word
  from the page that backs up the answer, with a link to it. All 217 quotes were checked against
  their pages, and the build rejects a question without one.
- A static, printable cram sheet, and a lesson quiz page for every lesson (`/learn/<id>/quiz/`).
- Resumable practice exams: the attempt is saved after every answer, the timer runs against a
  wall-clock deadline, and a confirmation dialog lists unanswered and marked questions.
- A mini exam preset (`/exam/?preset=mini`), and practice links that open a set directly
  (`?start=quick|long|rapid|due`, `?topic=`, `?topics=`).
- Keyboard answering (A to D or 1 to 4, Enter to continue), shuffled answer options, and focus
  moved to the marking for keyboard and screen reader users.
- Study plan steps you can tick by hand; lesson and exam steps tick themselves.
- Eleven new questions, new flashcards, a reasoning-model comparison and new quick facts covering
  voice-based prompt agents, guardrail intervention points, Foundry roles, Voice Live and Content
  Understanding model deployments.
- A rebuilt official resources list: 40 checked links, including the AI-901 learning path, the
  course, the labs, the exam experience page and the credential expiration policy.
- Canonical and Open Graph metadata, theme colours, an SVG favicon, and a phone tab bar with a
  "More" menu.

### Changed

- Responsible AI questions now cite Microsoft Learn (What is Responsible AI, and the AI
  fundamentals unit) instead of a microsoft.com marketing page, and most module landing pages were
  replaced by the specific units that cover each answer.
- Two image generation questions no longer say the GPT-image models use diffusion, which
  Microsoft Learn doesn't state. They now ask about diffusion-based models such as the MAI image
  models, or about image generation in general.
- A new design: Inter throughout, a near-white canvas with soft layered cards, one indigo accent,
  keycap-style answer options, a frosted sticky header and phone tab bar, and tinted callouts for
  key facts, traps and changes. Light and dark themes, with the system mono for code.
- Lessons are prerendered HTML; only knowledge checks, demos and progress hydrate. The question
  bank loads on demand, cutting JavaScript per page from 115 to 138 KB gzipped to 29 to 44 KB.
- Content brought up to date with Microsoft Learn: three agent types, managed compute and instant
  access in preview, reasoning model parameters, guardrails, Foundry role names, the GPT-image
  series after the DALL·E 3 retirement, content provenance, and Content Understanding analyzers.
- Every question now has a reference link, and option lengths were rebalanced across more than
  120 questions so that length is a much weaker clue to the right answer.
- Practice exam results report percent correct, with a note that Microsoft's 700 is a scaled
  score, instead of a linear "scaled" estimate.

### Fixed

- Ending a practice session early no longer counts unanswered questions as correct.
- Practice sessions no longer restart every time an answer is saved.
- Flashcards no longer skip or repeat cards when the deck re-sorted mid-session.
- Long lesson sections are now recorded as read (the old threshold could never be met).
- A wrong answer now drops a question two boxes in spaced repetition, as documented.
- Study streaks no longer break across time zones.
- Progress is written before the page is hidden, so the last answer is never lost.
- Opening a page or setting the exam date no longer counts as a study day.
- Comparison rows can be revealed with the keyboard, and the deployment picker no longer
  recommends a batch type for single-geography processing.

<!-- e.g., -->
<!-- Unreleased -->
<!-- v2.0.0 -->
<!-- v1.1.0 -->
<!-- v1.0.0 -->
<!-- v0.0.1 -->

[Unreleased]: https://github.com/dileepadev/learn-ai-901/branches
