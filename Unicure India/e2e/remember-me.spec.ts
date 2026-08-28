import { test, expect, type Page } from "@playwright/test";

// These tests verify that the "Remember me" checkbox on /auth controls
// whether the persisted Supabase session survives a browser restart, while
// always surviving a page refresh. They stub a Supabase session directly into
// localStorage so no real backend account is needed.

const SUPABASE_KEY = "sb-qhvlfzahkjoixfscenru-auth-token";
const REMEMBER_KEY = "unicure.rememberMe";
const TAB_MARKER_KEY = "unicure.sessionActive";

// A minimal Supabase v2 session shape — enough that supabase-js accepts it
// on boot. Expires far in the future so nothing auto-refreshes during tests.
function fakeSession() {
  const farFuture = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
  return {
    access_token: "fake.access.token",
    refresh_token: "fake.refresh.token",
    expires_at: farFuture,
    expires_in: 60 * 60 * 24 * 365,
    token_type: "bearer",
    user: {
      id: "00000000-0000-0000-0000-000000000000",
      aud: "authenticated",
      role: "authenticated",
      email: "test@example.com",
    },
  };
}

async function seedSession(page: Page, opts: { remember: boolean }) {
  // Load a public route once so localStorage is scoped to the app origin.
  await page.goto("/");
  await page.evaluate(
    ({ session, key, rememberKey, tabKey, remember }) => {
      window.localStorage.setItem(key, JSON.stringify(session));
      window.localStorage.setItem(rememberKey, remember ? "1" : "0");
      if (remember) window.sessionStorage.removeItem(tabKey);
      else window.sessionStorage.setItem(tabKey, "1");
    },
    {
      session: fakeSession(),
      key: SUPABASE_KEY,
      rememberKey: REMEMBER_KEY,
      tabKey: TAB_MARKER_KEY,
      remember: opts.remember,
    },
  );
}

async function hasSession(page: Page): Promise<boolean> {
  return page.evaluate((key) => window.localStorage.getItem(key) !== null, SUPABASE_KEY);
}

// A "refresh" preserves both localStorage and sessionStorage.
async function simulateRefresh(page: Page) {
  await page.reload();
  // Give the root-mount effect a tick to run any signOut cleanup.
  await page.waitForTimeout(300);
}

// A "browser restart" preserves localStorage but wipes sessionStorage.
async function simulateBrowserRestart(page: Page) {
  await page.evaluate(() => window.sessionStorage.clear());
  await page.reload();
  await page.waitForTimeout(500);
}

test.describe("Remember-me session persistence", () => {
  test("checked: session survives a page refresh", async ({ page }) => {
    await seedSession(page, { remember: true });
    await simulateRefresh(page);
    expect(await hasSession(page)).toBe(true);
  });

  test("checked: session survives a browser restart", async ({ page }) => {
    await seedSession(page, { remember: true });
    await simulateBrowserRestart(page);
    expect(await hasSession(page)).toBe(true);
  });

  test("unchecked: session survives a page refresh", async ({ page }) => {
    await seedSession(page, { remember: false });
    await simulateRefresh(page);
    expect(await hasSession(page)).toBe(true);
  });

  test("unchecked: session is cleared after a browser restart", async ({ page }) => {
    await seedSession(page, { remember: false });
    await simulateBrowserRestart(page);
    // Root-mount effect calls supabase.auth.signOut(), which removes the token.
    await expect
      .poll(() => hasSession(page), { timeout: 5000, intervals: [100, 250, 500] })
      .toBe(false);
  });
});
