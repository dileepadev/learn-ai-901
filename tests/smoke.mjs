/**
 * End-to-end smoke test of the whole learning loop against the built site.
 *
 *   npm run build:fast && npm run preview        # in one terminal
 *   npm run test:smoke                           # in another
 *
 * Drives a locally installed Chrome via playwright-core. Override with
 * CHROME_PATH, and the target with E2E_BASE.
 */
import { chromium } from 'playwright-core';
import { existsSync } from 'node:fs';

const BASE = process.env.E2E_BASE ?? 'http://localhost:4321/learn-ai-901';
const results = [];
let failures = 0;

function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  if (!ok) failures++;
  console.log(`${ok ? '  PASS' : '  FAIL'}  ${name}${detail ? ` - ${detail}` : ''}`);
}

const CHROME =
  process.env.CHROME_PATH ??
  ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find((p) => existsSync(p));

if (!CHROME) {
  console.error('No Chrome found. Set CHROME_PATH to a Chrome or Chromium binary.');
  process.exit(2);
}

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

const consoleErrors = [];
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(`${page.url()}: ${m.text()}`);
});
page.on('pageerror', (e) => consoleErrors.push(`${page.url()}: pageerror ${e.message}`));

async function goto(path) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
}

const overflows = () =>
  page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);

/** Answer whatever question is in `card`, any type, and say which format it was. */
async function answer(card) {
  const options = card.locator('.option');
  if ((await options.count()) > 0) {
    if ((await card.locator('.bubble.square').count()) === 0) {
      await options.first().click();
      return 'single';
    }
    const need = Number((await card.locator('.choose').innerText()).match(/Choose (\d+)/)?.[1] ?? 2);
    for (let i = 0; i < need; i++) await options.nth(i).click();
    await checkAnswer(card);
    return 'multi';
  }

  let format = 'order';
  const statements = card.locator('.statement');
  const blanks = card.locator('select.blank');
  const slots = card.locator('button.slot');
  if ((await statements.count()) > 0) {
    // Yes to everything, so a set with a false statement earns partial credit.
    format = 'yesno';
    for (let i = 0; i < (await statements.count()); i++) await statements.nth(i).locator('.yn-choice').first().click();
  } else if ((await blanks.count()) > 0) {
    format = 'dropdown';
    for (let i = 0; i < (await blanks.count()); i++) await blanks.nth(i).selectOption({ index: 1 });
  } else if ((await slots.count()) > 0) {
    // Drag and drop, answered by select-and-place: pick up a value, then choose its row.
    format = 'match';
    for (let i = 0; i < (await slots.count()); i++) {
      await card.locator('.tokens .token').first().click();
      await slots.nth(i).click();
    }
  } else {
    // Build list: select each step to move it into the answer area.
    const steps = card.locator('.steps .token');
    while ((await steps.count()) > 0) await steps.first().click();
  }
  await checkAnswer(card);
  return format;
}

async function checkAnswer(card) {
  const checkBtn = card.getByRole('button', { name: 'Check answer' });
  if (await checkBtn.isVisible().catch(() => false)) await checkBtn.click();
}

/* ---------------- 1. Static rendering and head ---------------- */
console.log('\n[1] Static HTML and metadata');
{
  const res = await page.request.get(`${BASE}/learn/responsible-ai/`);
  const html = await res.text();
  check('lesson HTML is served', res.ok());
  check('lesson content is in the HTML, not drawn by JavaScript', html.includes('lesson-section') && html.includes('<table'));
  check('knowledge checks are server-rendered', html.includes('Check your understanding'));
  check('canonical link present', /<link rel="canonical" href="https?:\/\/[^"]+\/learn\/responsible-ai\/"/.test(html));
  check('Open Graph title present', html.includes('property="og:title"'));
  check('theme-color present', html.includes('name="theme-color"'));
  const home = await (await page.request.get(`${BASE}/`)).text();
  check('home page does not inline the question bank', home.length < 200_000, `${Math.round(home.length / 1024)} KB`);
}

/* ---------------- 2. Home, as a new visitor ---------------- */
console.log('\n[2] Home: new visitor');
await goto('/');
check('new-visitor hero is shown', await page.locator('#hero-title').isVisible());
check('returning dashboard is hidden', !(await page.locator('.for-returning').isVisible()));
check('exam facts render', (await page.locator('.fact-grid > div').count()) === 4);
const sample = page.locator('.hero-sample .check');
await sample.locator('.option').first().scrollIntoViewIfNeeded();
await sample.locator('.option').first().click();
await page.waitForTimeout(250);
check('sample question is marked straight away', await sample.locator('.verdict').isVisible());
check('every wrong option explains itself', (await sample.locator('.why').count()) >= 1);
check('marking links to its Microsoft Learn page', (await sample.locator('.learn a[href^="https://learn.microsoft.com/"]').count()) === 1);
check('marking quotes Microsoft Learn', ((await sample.locator('.learn blockquote').innerText()) ?? '').trim().length > 20);

/* ---------------- 3. Home, returning ---------------- */
console.log('\n[3] Home: returning visitor');
await goto('/');
await page.waitForSelector('.dash', { timeout: 10000 });
check('returning visitors get the dashboard', await page.locator('.dash').isVisible());
check('new-visitor hero is hidden', !(await page.locator('#hero-title').isVisible()));
check('time-budget choices present', (await page.locator('.budget .segmented button').count()) === 4);
check('a primary recommendation is shown', await page.locator('.primary').isVisible());
await page.locator('.budget .segmented button', { hasText: '3 hours' }).click();
check('budget choice is pressed', (await page.locator('.budget button[aria-pressed="true"]').innerText()).includes('3 hours'));
check('readiness dial renders', await page.locator('figure.ring').isVisible());

/* ---------------- 4. Lessons ---------------- */
console.log('\n[4] Lessons');
await goto('/learn/');
check('all 12 lessons listed', (await page.locator('.mod').count()) === 12);
await goto('/learn/responsible-ai/');
const sectionCount = await page.locator('.lesson-section').count();
check('lesson renders its sections', sectionCount >= 4, `${sectionCount} sections`);
check('rail lists every section', (await page.locator('.rail .toc a').count()) === sectionCount);
check('lesson renders callouts', (await page.locator('.callout').count()) > 0);
const checks = page.locator('.check');
check('inline knowledge checks render', (await checks.count()) >= 3, `${await checks.count()} checks`);
const firstCheck = checks.first();
await firstCheck.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await answer(firstCheck);
await page.waitForTimeout(250);
check('knowledge check is marked', await firstCheck.locator('.verdict').isVisible());
check('options show right and wrong', (await firstCheck.locator('.option.right, .option.wrong, .option.missed').count()) > 0);
await page.locator('.lesson-end').scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
const stored = JSON.parse((await page.evaluate(() => localStorage.getItem('ai901:progress'))) ?? '{}');
check('lesson start is recorded', Boolean(stored.modules?.['responsible-ai']?.startedAt));
check('scrolled sections are recorded as read', (stored.modules?.['responsible-ai']?.sectionsSeen ?? []).length >= 1);
await page.locator('.finish').getByRole('button', { name: 'Mark complete' }).click();
await page.waitForTimeout(200);
check('lesson can be marked complete', await page.locator('.done-title').isVisible());

/* ---------------- 5. Lesson quiz ---------------- */
console.log('\n[5] Lesson quiz');
await goto('/learn/responsible-ai/quiz/');
check('quiz page shows the runner', await page.locator('.runner-title').isVisible());
check('quiz shows its length', /Question 1 of \d+/.test(await page.locator('.runner-head .small').first().innerText()));
const formats = new Set();
let partial = false;
let dragged = false;
for (let guard = 0; guard < 30; guard++) {
  if (await page.locator('.result-sheet').isVisible().catch(() => false)) break;
  const card = page.locator('.question-sheet');
  if (!(await card.isVisible().catch(() => false))) break;
  if (!dragged && (await card.locator('button.slot').count()) > 0) {
    // Real drag and drop, once: a value dragged onto a row fills it. Both ends
    // must be on screen first, because scrolling mid-drag cancels a native drag.
    await card.locator('.dnd').evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await card.locator('.tokens .token').first().dragTo(card.locator('button.slot').first());
    dragged = await card
      .locator('button.slot.filled')
      .first()
      .waitFor({ timeout: 3000 })
      .then(() => true)
      .catch(() => false);
    await card.getByRole('button', { name: /^Remove / }).first().click().catch(() => {});
  }
  const format = await answer(card);
  formats.add(format);
  await page.waitForTimeout(120);
  if (format === 'yesno') partial ||= /Partly right: \d+ of \d+ points/.test(await card.locator('.verdict-head').innerText());
  const next = card.getByRole('button', { name: /Next question|See results/ });
  if (await next.isVisible().catch(() => false)) await next.click();
  await page.waitForTimeout(120);
}
check('quiz reaches its results', await page.locator('.result-sheet').isVisible());
check('lesson quiz includes a Yes/No set', formats.has('yesno'));
check('lesson quiz includes a sentence to complete', formats.has('dropdown'));
check('lesson quiz includes drag and drop', formats.has('match'));
check('a value can be dragged onto a row', dragged);
check('a partly right Yes/No set earns partial points', partial);
check('results give a score', /\d+ of \d+ correct/.test(await page.locator('#result-title').innerText()));

/* ---------------- 6. Practice ---------------- */
console.log('\n[6] Practice');
await goto('/practice/');
check('practice sets listed', (await page.locator('.set').count()) >= 6);
await page.locator('.set', { hasText: 'Quick set' }).click();
await page.waitForSelector('.question-sheet', { timeout: 10000 });
check('a quick set starts', await page.locator('.question-sheet').isVisible());
// Letter shortcuts belong to choice questions, so move past any other format first.
for (let guard = 0; guard < 10 && (await page.locator('.question-sheet .option').count()) === 0; guard++) {
  await answer(page.locator('.question-sheet'));
  await page.locator('.question-sheet').getByRole('button', { name: /Next question/ }).click();
}
await page.keyboard.press('a');
await page.waitForTimeout(200);
const afterKey = (await page.locator('.question-sheet .verdict').isVisible()) || (await page.locator('.question-sheet .option.chosen').count()) > 0;
check('keyboard answers work', afterKey);
await page.getByRole('button', { name: /End session|Leave this session/ }).click();
await page.waitForTimeout(200);
check('ending early only scores what was answered', await page.locator('.result-sheet, .empty').first().isVisible());

await goto('/practice/?start=quick');
await page.waitForSelector('.question-sheet', { timeout: 10000 });
check('?start=quick opens a set directly', await page.locator('.runner-title').isVisible());

await goto('/practice/?start=code');
await page.waitForSelector('.question-sheet', { timeout: 10000 });
check('?start=code opens the Code set', (await page.locator('.runner-title').innerText()).includes('Code'));
let snippetShown = false;
let blankInCode = false;
for (let guard = 0; guard < 20 && !(snippetShown && blankInCode); guard++) {
  const sheet = page.locator('.question-sheet');
  if ((await sheet.locator('.q-code:not(.answer-code)').count()) > 0) snippetShown = true;
  if ((await sheet.locator('.answer-code select.blank').count()) > 0) blankInCode = true;
  await answer(sheet);
  const next = sheet.getByRole('button', { name: /Next question/ });
  if ((await next.count()) === 0) break;
  await next.click();
}
check('code questions show their Python snippet', snippetShown);
check('code dropdowns put the blanks in the code', blankInCode);

await goto('/practice/?start=unseen');
await page.waitForSelector('.question-sheet', { timeout: 10000 });
check('?start=unseen opens the never-tried set', (await page.locator('.runner-title').innerText()).includes('Never tried'));

await goto('/practice/weak/?topic=responsible-ai');
await page.waitForSelector('.runner-title', { timeout: 10000 });
check('weak-area drill honours ?topic', (await page.locator('.runner-title').innerText()).includes('Responsible AI'));

await goto('/practice/mistakes/');
await page.waitForSelector('.runner-title, .empty', { timeout: 10000 });
check('mistakes set renders questions or an empty state', await page.locator('.runner-title, .empty').first().isVisible());

/* ---------------- 7. Practice exam ---------------- */
console.log('\n[7] Practice exam');
await page.evaluate(() => localStorage.removeItem('ai901:exam'));
await goto('/exam/');
await page.getByRole('button', { name: 'Custom' }).click();
await page.locator('.slider input[type=range]').first().fill('10');
await page.getByRole('button', { name: 'Start the exam' }).click();
await page.waitForSelector('.exam-bar', { timeout: 10000 });
check('exam starts with a timer', await page.locator('.timer').isVisible());
check('question palette has every question', (await page.locator('.palette .pal').count()) === 10);
check('each question names its format', ((await page.locator('.q-type').innerText()) ?? '').trim().length > 0);
await answer(page.locator('.exam-question'));
await page.waitForTimeout(200);
check('nothing is marked during the exam', (await page.locator('.verdict').count()) === 0);
check('answered questions fill their palette square', (await page.locator('.palette .pal.done').count()) >= 1);
await page.getByRole('button', { name: 'Reset answer' }).click();
check('an answer can be reset', (await page.locator('.palette .pal.done').count()) === 0);
await answer(page.locator('.exam-question'));
await page.waitForTimeout(200);
await page.getByRole('button', { name: 'Mark for review' }).click();
check('questions can be marked for review', (await page.locator('.palette .pal.flag').count()) === 1);

await page.reload({ waitUntil: 'networkidle' });
check('an attempt in progress survives a reload', await page.locator('.resume').isVisible());
await page.getByRole('button', { name: 'Resume the exam' }).click();
await page.waitForSelector('.exam-bar', { timeout: 10000 });
check('resuming keeps the answers', (await page.locator('.palette .pal.done').count()) >= 1);

await page.getByRole('button', { name: 'Review answers' }).first().click();
check('the review screen lists every question', (await page.locator('.review-row').count()) === 10);
await page.locator('.review-screen .segmented button', { hasText: 'For review' }).click();
check('the review screen filters to marked questions', (await page.locator('.review-row').count()) === 1);
await page.locator('.review-row').first().click();
check('a review row opens its question', await page.locator('.exam-question').isVisible());
await page.getByRole('button', { name: 'Back to review' }).click();
await page.getByRole('button', { name: 'Finish the exam' }).click();
check('finishing asks for confirmation', await page.locator('dialog.review').isVisible());
await page.getByRole('button', { name: 'Finish and see my result' }).click();
await page.waitForSelector('.score-sheet', { timeout: 10000 });
check('exam reports a percentage', /\d+%/.test(await page.locator('.score-big').innerText()));
check('exam is scored in points', /\d+ of \d+ points/.test(await page.locator('.score-sheet h1').innerText()));
check('results show performance by section', (await page.locator('.section-bar').count()) >= 1);
check('topic report renders', (await page.locator('.topic-report li').count()) > 0);
check('the finished attempt is cleared', (await page.evaluate(() => localStorage.getItem('ai901:exam'))) === null);

// A question counts as answered only once every part is: fe-008 is a build list, fe-002 a "Choose 2".
await page.evaluate(() =>
  localStorage.setItem(
    'ai901:exam',
    JSON.stringify({
      v: 1, preset: 'custom', ids: ['fe-008', 'fe-002'], seed: 1, answers: {}, done: [], flagged: [], index: 0,
      startedAt: Date.now(), deadline: null, limitSeconds: null,
    }),
  ),
);
await goto('/exam/');
await page.getByRole('button', { name: 'Resume the exam' }).click();
await page.waitForSelector('.exam-bar', { timeout: 10000 });
const steps = page.locator('.exam-question .steps .token');
await steps.first().click();
check('a part-built list is not answered', (await page.locator('.palette .pal.done').count()) === 0);
while ((await steps.count()) > 0) await steps.first().click();
check('a full list is answered', (await page.locator('.palette .pal.done').count()) === 1);
await page.locator('.palette .pal').nth(1).click();
await page.locator('.exam-question .option').first().click();
check('one pick on a "Choose 2" is not answered', (await page.locator('.palette .pal.done').count()) === 1);
await page.locator('.exam-question .option').nth(1).click();
check('two picks on a "Choose 2" are answered', (await page.locator('.palette .pal.done').count()) === 2);
await page.locator('.exam-question .option').nth(2).click();
check('a third pick is refused, and says so', (await page.locator('.exam-question .option.chosen').count()) === 2 && (await page.getByText(/You have chosen 2/).first().isVisible()));
await page.evaluate(() => localStorage.removeItem('ai901:exam'));

/* ---------------- 8. Rapid review ---------------- */
console.log('\n[8] Rapid review');
await goto('/review/');
const front = await page.locator('.index-card .face').innerText();
await page.locator('.index-card').click();
check('flashcard reveals the answer', await page.locator('.index-card .face.back').isVisible());
await page.getByRole('button', { name: /Got it/ }).click();
await page.waitForTimeout(150);
check('flashcard advances after rating', (await page.locator('.index-card .face').innerText()) !== front);
await page.locator('.controls .segmented button', { hasText: 'Comparisons' }).click();
check('comparisons listed', (await page.locator('.cmp').count()) > 0);
await page.locator('.cmp-toggle').first().click();
check('comparison cells start hidden', (await page.locator('.hidden-cell').count()) > 0);
const hiddenBefore = await page.locator('.hidden-cell').count();
await page.locator('.row-toggle').first().click();
check('revealing a row works by button', (await page.locator('.hidden-cell').count()) < hiddenBefore);
await page.locator('.controls .segmented button', { hasText: 'Know this' }).click();
check('facts render', (await page.locator('.fact').count()) > 0);

/* ---------------- 9. Cram, plan, progress, resources ---------------- */
console.log('\n[9] Cram, plan, progress, resources');
await goto('/cram/');
check('cram sheet lists key facts', (await page.locator('.key-group').count()) > 0);
check('cram sheet lists traps', (await page.locator('.callout-trap').count()) > 0);
check('cram sheet lists changes', (await page.locator('.callout-changed').count()) > 0);

await goto('/plan/');
check('plan has four days', (await page.locator('.day').count()) === 4);
const manual = page.locator('.step input[type=checkbox]:not([disabled])').first();
await manual.check();
await page.waitForTimeout(200);
const planDone = JSON.parse((await page.evaluate(() => localStorage.getItem('ai901:progress'))) ?? '{}').planDone ?? [];
check('plan steps can be ticked by hand', planDone.length >= 1);

await goto('/progress/');
check('progress report renders', await page.locator('.boxes').isVisible());
check('milestones render', (await page.locator('.milestones li').count()) === 12);
check('session history renders', (await page.locator('table.data tbody tr').count()) > 0);

await goto('/resources/');
const allCount = await page.locator('.group .res').count();
check('resources listed', allCount >= 30, `${allCount} resources`);
await page.locator('.search input').fill('speech');
await page.waitForTimeout(150);
const searched = await page.locator('.group .res').count();
check('search narrows the list', searched > 0 && searched < allCount, `${searched} matches`);

/* ---------------- 10. Theme and phones ---------------- */
console.log('\n[10] Theme and phones');
await goto('/');
const before = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
await page.locator('[data-theme-toggle]').click();
await page.waitForTimeout(200);
const after = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
check('theme toggle changes the page', before !== after, `${before} -> ${after}`);
await page.locator('[data-theme-toggle]').click();
await page.locator('[data-theme-toggle]').click();

await page.setViewportSize({ width: 390, height: 844 });
for (const path of ['/', '/learn/vision/', '/practice/', '/exam/', '/review/', '/cram/', '/plan/', '/progress/', '/resources/']) {
  await goto(path);
  check(`no sideways scrolling on a phone: ${path}`, !(await overflows()));
}
check('phones get the bottom tab bar', await page.locator('.tabbar').isVisible());
await page.locator('.more-btn').click();
check('the More menu opens', await page.locator('#more-menu').isVisible());

/* ---------------- 11. Console ---------------- */
console.log('\n[11] Console');
const realErrors = consoleErrors.filter((e) => !e.includes('favicon') && !e.includes('Failed to load resource'));
check('no console errors', realErrors.length === 0, realErrors.slice(0, 3).join(' | '));

await browser.close();

console.log(`\n${'='.repeat(60)}`);
console.log(`${results.length - failures}/${results.length} checks passed`);
if (failures) {
  console.log('\nFailures:');
  for (const r of results.filter((r) => !r.ok)) console.log(`  - ${r.name} ${r.detail}`);
}
process.exit(failures ? 1 : 0);
