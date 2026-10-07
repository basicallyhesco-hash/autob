import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('atlas, city, learning paths, notebook, references and quiz pass automated accessibility checks', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const scan = async () => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
  };
  await scan();
  await page.getByRole('tab', { name: 'Human body as a city' }).click();
  await scan();
  for (const name of ['Learning paths', 'My notebook', 'About this atlas', 'Test your knowledge']) {
    await page.getByRole('button', { name, exact: true }).first().click();
    await scan();
    await page.getByRole('button', { name: 'Close dialog' }).click();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await scan();
});
