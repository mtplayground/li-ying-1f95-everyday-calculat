import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const buttonNames = [
  'Clear',
  'Percentage',
  'Divide',
  'Multiply',
  'Seven',
  'Eight',
  'Nine',
  'Subtract',
  'Four',
  'Five',
  'Six',
  'Add',
  'One',
  'Two',
  'Three',
  'Equals',
  'Zero',
  'Decimal point',
] as const;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('performs a multi-step calculation through button taps', async ({ page }) => {
  await press(page, 'Two');
  await press(page, 'Add');
  await press(page, 'Three');
  await press(page, 'Multiply');
  await press(page, 'Four');
  await press(page, 'Equals');

  await expect(display(page)).toHaveText('20');
});

test('enters and uses a decimal number', async ({ page }) => {
  await press(page, 'One');
  await press(page, 'Decimal point');
  await press(page, 'Five');
  await press(page, 'Add');
  await press(page, 'Two');
  await press(page, 'Equals');

  await expect(display(page)).toHaveText('3.5');
});

test('runs a percentage calculation', async ({ page }) => {
  await press(page, 'Two');
  await press(page, 'Zero');
  await press(page, 'Zero');
  await press(page, 'Add');
  await press(page, 'One');
  await press(page, 'Zero');
  await press(page, 'Percentage');
  await press(page, 'Equals');

  await expect(display(page)).toHaveText('220');
});

test('shows and clears a friendly division-by-zero error', async ({ page }) => {
  await press(page, 'Eight');
  await press(page, 'Divide');
  await press(page, 'Zero');
  await press(page, 'Equals');

  await expect(display(page)).toHaveText("Can't divide by zero");

  await press(page, 'Clear');
  await expect(display(page)).toHaveText('0');
});

test('clear resets the display to the blank state', async ({ page }) => {
  await press(page, 'Four');
  await press(page, 'Two');

  await expect(display(page)).toHaveText('42');

  await press(page, 'Clear');
  await expect(display(page)).toHaveText('0');
});

test('display and full keypad fit without scrolling on a portrait phone viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(display(page)).toBeVisible();
  await expect(page.getByRole('group', { name: 'Calculator keypad' })).toBeVisible();

  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  expect(scrollHeight).toBeLessThanOrEqual(viewportHeight + 1);

  for (const name of buttonNames) {
    const box = await page.getByRole('button', { name }).boundingBox();
    expect(box, `${name} button should be visible`).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
  }
});

function display(page: Page) {
  return page.getByLabel('Calculator display');
}

async function press(page: Page, name: string) {
  await page.getByRole('button', { name }).click();
}
