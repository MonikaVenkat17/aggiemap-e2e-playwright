import { Page, Locator, expect } from '@playwright/test';

export class CoordinatesPage {
  readonly page: Page;
  readonly possibleWidget: Locator;
  readonly possibleCopy: Locator;

  constructor(page: Page) {
    this.page = page;

    // these are "best guess" selectors — tweak after you Inspect the real UI
    this.possibleWidget = page.getByText(/coordinate|lat|lon|x\s*\/\s*y/i);
    this.possibleCopy = page.getByRole('button', { name: /copy|clipboard/i });
  }

  async goto() {
    await this.page.goto('http://localhost:4200/map/d');
  }

  async expectLoaded() {
    await expect(this.page.getByRole('heading', { name: /Aggiemap Beta/i })).toBeVisible();
  }
}
