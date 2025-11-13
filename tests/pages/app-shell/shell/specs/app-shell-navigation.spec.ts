import { test, expect } from '@playwright/test';
import { AppShellPage } from '../po/app-shell.page';

test.describe('App Shell (AggieMap) – app-shell', () => {
  test.beforeEach(async ({ page }) => {
    const shell = new AppShellPage(page);
    await shell.gotoShell();
  });

  //
  // 1. App load & smoke
  //
  test('app loads: header, search, layers, and map label visible', async ({ page }) => {
    const shell = new AppShellPage(page);
    await shell.expectShellLoaded();
  });

  //
  // 2. Global routing / route assertions
  //
  test('routing tab opens routing UI', async ({ page }) => {
    const shell = new AppShellPage(page);

    await shell.openRouting();
    await shell.expectRoutingPanelVisible();

    // If routing changes URL, uncomment and adjust:
    // await expect(page).toHaveURL(/routing/i);
  });

  //
  // 3. Sidebar show/hide
  //
  test('sidebar visibility can be toggled', async ({ page }) => {
    const shell = new AppShellPage(page);

    // Start with visible sidebar
    await shell.setSidebarVisible(true);
    await expect(shell.layersHeading).toBeVisible();

    // Hide it
    await shell.setSidebarVisible(false);
    await expect(shell.layersHeading).not.toBeVisible();

    // Show it again
    await shell.setSidebarVisible(true);
    await expect(shell.layersHeading).toBeVisible();
  });

  //
  // 4. 2D/3D toggle preserves visible extent
  //
  test('2D/3D toggle works and keeps the same map area', async ({ page }) => {
    const shell = new AppShellPage(page);

    // In 2D, Simpson Drill Field visible
    await shell.expectExtentPreservedAroundSimpson();

    // Switch to 3D, Simpson should still be visible
    await shell.switchTo3D();
    await shell.expectExtentPreservedAroundSimpson();

    // Switch back to 2D, still visible
    await shell.switchTo2D();
    await shell.expectExtentPreservedAroundSimpson();
  });
});

