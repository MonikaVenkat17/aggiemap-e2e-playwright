import { expect, Page, Locator } from '@playwright/test';

export class AppShellPage {
  readonly page: Page;

  // Shell bits
  readonly headerTitle: Locator;
  readonly searchInput: Locator;
  readonly layersHeading: Locator;
  readonly mapLabelSimpson: Locator;

  // Sidebar + routing
  readonly sidebarToggle: Locator;  // hamburger
  readonly routingButton: Locator;

  // 2D / 3D
  readonly mode2DButton: Locator;
  readonly mode3DButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // “Aggie Map” in the top-right header
    this.headerTitle = page.getByText('Aggie Map', { exact: false });

    // Search bar text from your screenshot
    this.searchInput = page.getByPlaceholder('Find Building or Parking');

    // “Layers” heading above layer list
    this.layersHeading = page.getByText('Layers', { exact: false });

    // A stable map label in your screenshot for extent checks
    this.mapLabelSimpson = page.getByText('Simpson Drill Field', {
      exact: false,
    });

    // Hamburger menu in top-right shell
    this.sidebarToggle = page.locator('button[aria-label*="menu" i]').first()
      .or(page.getByRole('button', { name: /menu/i }));

    // Vertical routing button (left toolbar) – aria-label usually “Routing”
    this.routingButton = page.locator('button[aria-label*="routing" i]').first()
      .or(page.getByRole('button', { name: /routing/i }));

    // 2D / 3D toggle (top-left over the map)
    this.mode2DButton = page.getByRole('button', { name: /^2d$/i });
    this.mode3DButton = page.getByRole('button', { name: /^3d$/i });
  }

  // --- core flows ---

  async gotoShell() {
    // root route; router will land on map view
    await this.page.goto('/');

    // Title is something like “Aggie Map - Texas A&M University”
    await expect(this.page).toHaveTitle(/Aggie\s*Map/i);

    await this.dismissPopups();
    await this.expectShellLoaded();
  }

  async dismissPopups() {
    // 1) Beta / info modal with “I Understand”
    const understand = this.page.getByRole('button', { name: /I Understand/i });
    if (await understand.isVisible().catch(() => false)) {
      await understand.click();
    }

    // 2) Gameday banner with “Don’t show again”
    const dontShow = this.page.getByText("Don't show again", { exact: false });
    if (await dontShow.isVisible().catch(() => false)) {
      await dontShow.click();
    }
  }

  async expectShellLoaded() {
    await expect(this.headerTitle).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.layersHeading).toBeVisible();
    await expect(this.mapLabelSimpson).toBeVisible();
  }

  // --- sidebar ---

  async isSidebarVisible(): Promise<boolean> {
    return this.layersHeading.isVisible();
  }

  async toggleSidebar() {
    await this.sidebarToggle.click();
  }

  async setSidebarVisible(visible: boolean) {
    if ((await this.isSidebarVisible()) === visible) return;
    await this.toggleSidebar();
    await expect(this.layersHeading)[visible ? 'toBeVisible' : 'not.toBeVisible']();
  }

  // --- routing ---

  async openRouting() {
    await this.routingButton.click();
  }

  // Route assertion – tweak selector if routing panel text differs
  async expectRoutingPanelVisible() {
    const routingPanelTitle = this.page.getByText(/Routing|Directions/i);
    await expect(routingPanelTitle).toBeVisible();
  }

  // --- 2D / 3D ---

  async switchTo3D() {
    if (await this.mode3DButton.isVisible().catch(() => false)) return; // already 3D
    await this.mode2DButton.click();
    await expect(this.mode3DButton).toBeVisible();
  }

  async switchTo2D() {
    if (await this.mode2DButton.isVisible().catch(() => false)) return; // already 2D
    await this.mode3DButton.click();
    await expect(this.mode2DButton).toBeVisible();
  }

  async expectExtentPreservedAroundSimpson() {
    // Simpler “extent” check: landmark text visible before and after
    await expect(this.mapLabelSimpson).toBeVisible();
  }
}

