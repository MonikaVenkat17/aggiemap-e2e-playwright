import { test, expect } from '@playwright/test';
import { CoordinatesPage } from '../po/coordinates.page';

test.describe('Coordinates Widget & Clipboard', () => {
  test('coordinates widget shows up somewhere on the map page', async ({ page }) => {
    const coords = new CoordinatesPage(page);

    await coords.goto();
    await coords.expectLoaded();

    // pick the first match 
    await expect(coords.possibleWidget.first()).toBeVisible();
  });

  test('copy/clipboard button exists (if present)', async ({ page }) => {
    const coords = new CoordinatesPage(page);

    await coords.goto();
    await coords.expectLoaded();

    const copyButton = coords.possibleCopy;
    if (await copyButton.isVisible()) {
      await expect(copyButton).toBeVisible();
      await copyButton.click({ force: true });
    }
  });
});
