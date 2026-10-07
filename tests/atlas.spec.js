import { test, expect } from '@playwright/test';
import { journeys, quizQuestions, structures } from '../src/data.js';

test('anatomy and city share all organ landmarks and structure selections', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Heart', exact: true })).toBeVisible();
  await expect(page.locator('.organ')).toHaveCount(
    structures.filter((s) => s.system === 'organs').length,
  );
  await page.getByRole('button', { name: 'Explore Brain', exact: true }).first().click();
  await page.getByRole('button', { name: 'Explore Heart', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Heart', exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Human body as a city' }).click();
  await expect(page.locator('.building')).toHaveCount(15);
  await expect(page.locator('.building.is-selected')).toHaveAttribute(
    'aria-label',
    'Explore Heart',
  );
  await page.getByRole('button', { name: 'Explore Brain', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Brain', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Central command', exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Human anatomy', exact: true }).click();
  await expect(page.locator('.organ.is-selected')).toHaveAttribute('aria-label', 'Explore Brain');
  await page.getByRole('tab', { name: 'Connections', exact: true }).click();
  await expect(
    page.getByText(
      'The brain communicates with the body through the spinal cord and cranial nerves.',
    ),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test('layers, region isolation, labels, pan, zoom, and focus controls work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('switch', { name: 'Show Arteries', exact: true }).uncheck();
  await expect(page.getByRole('button', { name: 'Explore Aorta', exact: true })).toHaveCount(0);
  await page.getByRole('switch', { name: 'Show Nerves', exact: true }).check();
  const sciatic = page.getByRole('button', { name: 'Explore Sciatic nerves', exact: true }).first();
  await sciatic.scrollIntoViewIfNeeded();
  const point = await sciatic.evaluate((el) => {
    const path = el.querySelector('path');
    const p = path.getPointAtLength(path.getTotalLength() * 0.25);
    const screen = new DOMPoint(p.x, p.y).matrixTransform(path.getScreenCTM());
    return { x: screen.x, y: screen.y };
  });
  await page.mouse.click(point.x, point.y);
  await expect(page.getByRole('heading', { name: 'Sciatic nerves', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Head & neck' }).click();
  await expect(page.locator('.organ[aria-label="Explore Heart"]')).toHaveAttribute(
    'opacity',
    '0.16',
  );
  await page.getByRole('button', { name: 'Labels', exact: true }).click();
  await expect(page.locator('.anatomy-label')).toHaveCount(0);
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(page.locator('.map-controls')).toContainText('120%');
  const svg = page.locator('.atlas-svg'),
    box = await svg.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 + 40, { steps: 5 });
  await page.mouse.up();
  await expect(svg.locator(':scope > g')).not.toHaveAttribute('transform', /^translate\(0 0\)/);
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  await expect(page.locator('.map-controls')).toContainText('100%');
  await expect(svg.locator(':scope > g')).toHaveAttribute('transform', /^translate\(0 0\)/);
  await page.getByRole('button', { name: 'Enter focus mode' }).click();
  await expect(page.locator('.left-sidebar')).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(page.locator('.left-sidebar')).toBeVisible();
  await page.getByRole('button', { name: 'Show all', exact: true }).click();
  for (const name of ['Organs', 'Arteries', 'Veins', 'Nerves', 'Lymphatics'])
    await expect(page.getByRole('switch', { name: `Show ${name}`, exact: true })).toBeChecked();
});

test('search finds structures, enables hidden systems, and notebook persists', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  const search = page.getByRole('textbox', { name: 'Search anatomy' });
  await expect(search).toBeFocused();
  await search.fill('kidney');
  await expect(page.locator('.search-results>button')).toHaveCount(2);
  await page
    .locator('.search-results')
    .getByRole('button', { name: /Right kidney/ })
    .click();
  await expect(page.getByRole('heading', { name: 'Right kidney', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Save to notebook', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: /My notebook/ }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /Right kidney Right water/ })
    .click();
  await expect(page.getByRole('heading', { name: 'Right kidney', exact: true })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Remove from notebook', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await search.fill('thoracic duct');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('switch', { name: 'Show Lymphatics' })).toBeChecked();
  await expect(page.getByRole('heading', { name: 'Thoracic duct', exact: true })).toBeVisible();
  await search.fill('not-a-real-organ');
  await expect(
    page.getByText('No structures found. Try “heart”, “nerve”, or “lymph”.'),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.search-results')).toHaveCount(0);
});

for (const journey of journeys) {
  test(`guided learning completes the ${journey.id} journey`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Learning paths', exact: true }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: new RegExp(journey.name) })
      .click();
    for (let i = 0; i < journey.steps.length; i++) {
      await expect(page.locator('.journey-player>p')).toHaveText(journey.steps[i].text);
      await expect(page.locator('.structure-title>h2')).toHaveText(
        structures.find((s) => s.id === journey.steps[i].id).name,
      );
      if (i === 1) {
        await page.locator('.journey-player').getByRole('button', { name: 'Back' }).click();
        await expect(page.locator('.journey-player>p')).toHaveText(journey.steps[0].text);
        await page.locator('.journey-player').getByRole('button', { name: 'Continue' }).click();
      }
      await page
        .locator('.journey-player')
        .getByRole('button', { name: i < journey.steps.length - 1 ? 'Continue' : 'Complete' })
        .click();
    }
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('.journey-player')).toHaveCount(0);
  });
}

test('quiz checks answers, prevents repeats, scores results, and supports review', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Test your knowledge' }).click();
  const dialog = page.getByRole('dialog');
  for (let i = 0; i < quizQuestions.length; i++) {
    const q = quizQuestions[i],
      answer = i === 0 ? 'liver' : q.answer;
    await expect(dialog.getByRole('heading')).toHaveText(q.question);
    const name = structures.find((s) => s.id === answer).name;
    await dialog
      .locator('.quiz-options')
      .getByRole('button', { name: new RegExp(name) })
      .click();
    await expect(dialog.getByText(q.why, { exact: true })).toBeVisible();
    await expect(dialog.locator('.quiz-options>button:disabled')).toHaveCount(4);
    await dialog
      .getByRole('button', {
        name: i === quizQuestions.length - 1 ? 'See my results' : 'Next question',
      })
      .click();
  }
  await expect(dialog.locator('.score')).toHaveText('6 / 7');
  await dialog.locator('.quiz-review').getByRole('button', { name: 'Heart', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('.structure-title>h2')).toHaveText('Heart');
});

test('mobile has no horizontal overflow and supports both maps and keyboard dialog dismissal', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.getByRole('tab', { name: 'Human body as a city' }).click();
  await page.getByRole('button', { name: 'Explore Stomach', exact: true }).first().click();
  await expect(page.locator('.structure-title>h2')).toHaveText('Stomach');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.getByRole('button', { name: 'About this atlas', exact: true }).first().click();
  await expect(page.getByRole('dialog')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(
    page.getByRole('link', { name: 'NCBI Bookshelf · Anatomy reference library' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close dialog' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
